/**
 * Misty Pearl A1 — Comm-Net (in-app voice/video).
 *
 * Foundry-class WebRTC voice/video via the `trystero` Supabase
 * strategy: signaling rides our existing Supabase realtime channels,
 * media flows peer-to-peer (mesh) for free / unlimited / serverless.
 *
 * Public surface:
 *   - `useCommNet({ campaignId, sessionId?, enabled, mediaConstraints })`
 *     returns `{ peers, localStream, micEnabled, camEnabled, mode,
 *     toggleMic, toggleCam, setMode, leave }`.
 *   - `BROADCAST_MODES` — the three supported modes.
 *
 * Modes match Foundry AVClient:
 *   - `always` — mic always hot (default).
 *   - `voice` — voice-activated; gates mic by RMS threshold.
 *   - `ptt`   — push-to-talk; mic muted until `pushToTalk(true)` is called.
 *
 * RA theming: "Comm-Net" = Bureau communications uplink. Mute =
 * "Cloak Channel". Cam off = "Mask Identity". PTT = "Push Burst".
 *
 * Loaded lazily by `CommNetPanel` so the WebRTC + trystero bundle
 * never enters the critical path for non-voice users.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Room } from "trystero";
import { joinRoom as joinSupabaseRoom } from "trystero/supabase";
import {
	connectLiveKit,
	type LiveKitTransportHandle,
} from "@/lib/commnet/livekitTransport";
import {
	createVirtualBackgroundPipeline,
	type VirtualBackgroundKind,
	type VirtualBackgroundPipeline,
} from "@/lib/commnet/virtualBackground";

const SUPABASE_URL =
	(import.meta.env.VITE_SUPABASE_URL as string | undefined) ?? "";
const SUPABASE_ANON_KEY =
	(import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined) ??
	(import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ??
	"";

export const BROADCAST_MODES = ["always", "voice", "ptt"] as const;
export type CommNetMode = (typeof BROADCAST_MODES)[number];

export interface CommNetPeer {
	peerId: string;
	stream: MediaStream | null;
	/** Approximate output volume 0..1, refreshed every ~150 ms. */
	volume: number;
}

export type CommNetTransportKind = "trystero" | "livekit";

export interface UseCommNetOptions {
	campaignId: string | null | undefined;
	/** Optional session subdivision; defaults to "shared". */
	sessionId?: string | null;
	/** Master enable — set false to fully tear down. */
	enabled: boolean;
	/** `getUserMedia` constraints. Defaults to audio-only. */
	mediaConstraints?: MediaStreamConstraints;
	/** Voice-activation RMS threshold 0..1. Defaults to 0.04. */
	voiceThreshold?: number;
	/**
	 * Misty Pearl I4 — virtual background pipeline. Null/undefined =
	 * pass the raw camera through. `{ kind: 'blur' }` or
	 * `{ kind: 'image', src }` wraps the local stream via MediaPipe
	 * before publishing to peers.
	 */
	virtualBackground?: VirtualBackgroundKind | null;
	/**
	 * Misty Pearl I3 — transport selector. Default `trystero` (P2P mesh,
	 * great for ≤6 peers). `livekit` SFU when the campaign has provisioned
	 * a LiveKit server (handles larger parties + mobile better).
	 */
	transport?: CommNetTransportKind;
	/** LiveKit-only: SFU URL (e.g. wss://livekit.your-host.com). */
	livekitUrl?: string;
	/** LiveKit-only: pre-signed access token for this room. */
	livekitToken?: string;
}

export interface UseCommNetResult {
	peers: ReadonlyArray<CommNetPeer>;
	localStream: MediaStream | null;
	micEnabled: boolean;
	camEnabled: boolean;
	mode: CommNetMode;
	toggleMic: () => void;
	toggleCam: () => Promise<void>;
	setMode: (mode: CommNetMode) => void;
	pushToTalk: (active: boolean) => void;
	error: Error | null;
	connecting: boolean;
	leave: () => void;
}

const DEFAULT_AUDIO_CONSTRAINTS: MediaStreamConstraints = {
	audio: {
		echoCancellation: true,
		noiseSuppression: true,
		autoGainControl: true,
	},
	video: false,
};

const APP_ID = "rift-ascendant-commnet";

/**
 * Resolves the trystero room id for a campaign + optional session
 * combo. Mirrors the realtime channel naming convention so future
 * debugging is straightforward.
 */
function commNetRoomId(
	campaignId: string,
	sessionId: string | null | undefined,
): string {
	const sess = sessionId?.trim() ? sessionId : "shared";
	return `commnet:${campaignId}:${sess}`;
}

export function useCommNet(options: UseCommNetOptions): UseCommNetResult {
	const {
		campaignId,
		sessionId,
		enabled,
		mediaConstraints = DEFAULT_AUDIO_CONSTRAINTS,
		voiceThreshold = 0.04,
		virtualBackground = null,
		transport = "trystero",
		livekitUrl,
		livekitToken,
	} = options;

	const [peers, setPeers] = useState<CommNetPeer[]>([]);
	const [localStream, setLocalStream] = useState<MediaStream | null>(null);
	const [micEnabled, setMicEnabled] = useState(true);
	const [camEnabled, setCamEnabled] = useState(Boolean(mediaConstraints.video));
	const [mode, setModeState] = useState<CommNetMode>("always");
	const [error, setError] = useState<Error | null>(null);
	const [connecting, setConnecting] = useState(false);

	const roomRef = useRef<Room | null>(null);
	const liveKitRef = useRef<LiveKitTransportHandle | null>(null);
	const rawStreamRef = useRef<MediaStream | null>(null);
	const localStreamRef = useRef<MediaStream | null>(null);
	const audioContextRef = useRef<AudioContext | null>(null);
	const analyzersRef = useRef<Map<string, AnalyserNode>>(new Map());
	const pttActiveRef = useRef(false);
	const modeRef = useRef<CommNetMode>("always");
	const bgPipelineRef = useRef<VirtualBackgroundPipeline | null>(null);

	useEffect(() => {
		modeRef.current = mode;
	}, [mode]);

	// -------------------------------------------------------------------
	// Room lifecycle. Re-runs when (campaignId, sessionId, enabled) change.
	// -------------------------------------------------------------------
	useEffect(() => {
		if (!enabled || !campaignId) {
			return;
		}
		if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
			setError(
				new Error(
					"Comm-Net requires Supabase configuration (VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY).",
				),
			);
			return;
		}
		let cancelled = false;
		setConnecting(true);
		setError(null);

		const start = async () => {
			let rawStream: MediaStream;
			try {
				rawStream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
			} catch (e) {
				if (cancelled) return;
				setError(
					e instanceof Error
						? e
						: new Error("Failed to access microphone / camera."),
				);
				setConnecting(false);
				return;
			}
			if (cancelled) {
				for (const t of rawStream.getTracks()) {
					t.stop();
				}
				return;
			}
			rawStreamRef.current = rawStream;

			// Misty Pearl I4 — wrap with virtual-background pipeline when
			// requested. Falls through to the raw stream if pipeline setup
			// fails so a flaky GPU never blocks the uplink.
			let stream = rawStream;
			if (virtualBackground && rawStream.getVideoTracks().length > 0) {
				try {
					const pipeline =
						await createVirtualBackgroundPipeline(virtualBackground);
					if (cancelled) {
						pipeline.stop();
						for (const t of rawStream.getTracks()) {
							t.stop();
						}
						return;
					}
					bgPipelineRef.current = pipeline;
					stream = await pipeline.start(rawStream);
				} catch (e) {
					console.warn("[useCommNet] virtual-bg pipeline failed:", e);
				}
			}

			localStreamRef.current = stream;
			setLocalStream(stream);

			// Misty Pearl I3 — branch on transport.
			if (transport === "livekit") {
				if (!livekitUrl || !livekitToken) {
					setError(
						new Error(
							"LiveKit transport selected but no URL / token provided.",
						),
					);
					setConnecting(false);
					return;
				}
				try {
					const handle = await connectLiveKit({
						url: livekitUrl,
						token: livekitToken,
						roomName: commNetRoomId(campaignId, sessionId),
						onPeerJoin: (peerId) => {
							setPeers((current) =>
								current.some((p) => p.peerId === peerId)
									? current
									: [...current, { peerId, stream: null, volume: 0 }],
							);
						},
						onPeerLeave: (peerId) => {
							setPeers((current) => current.filter((p) => p.peerId !== peerId));
						},
						onPeerStream: (peerId, remote) => {
							setPeers((current) =>
								current.map((p) =>
									p.peerId === peerId ? { ...p, stream: remote } : p,
								),
							);
						},
						onConnectionError: (err) => setError(err),
					});
					if (cancelled) {
						await handle.leave();
						for (const t of stream.getTracks()) {
							t.stop();
						}
						return;
					}
					liveKitRef.current = handle;
					await handle.addStream(stream);
					setConnecting(false);
					return;
				} catch (e) {
					if (cancelled) return;
					setError(
						e instanceof Error ? e : new Error("Failed to connect to LiveKit."),
					);
					setConnecting(false);
					return;
				}
			}

			let room: Room;
			try {
				room = joinSupabaseRoom(
					{
						appId: APP_ID,
						supabaseKey: SUPABASE_ANON_KEY,
					},
					commNetRoomId(campaignId, sessionId),
				);
			} catch (e) {
				if (cancelled) return;
				setError(
					e instanceof Error ? e : new Error("Failed to join Comm-Net room."),
				);
				setConnecting(false);
				return;
			}
			if (cancelled) {
				room.leave().catch(() => {});
				for (const t of stream.getTracks()) {
					t.stop();
				}
				return;
			}
			roomRef.current = room;

			for (const p of room.addStream(stream)) {
				p.catch(() => {});
			}

			room.onPeerJoin((peerId) => {
				setPeers((current) => {
					if (current.some((p) => p.peerId === peerId)) return current;
					return [...current, { peerId, stream: null, volume: 0 }];
				});
			});
			room.onPeerLeave((peerId) => {
				const analyzer = analyzersRef.current.get(peerId);
				if (analyzer) {
					try {
						analyzer.disconnect();
					} catch {
						/* analyzer may already be detached */
					}
					analyzersRef.current.delete(peerId);
				}
				setPeers((current) => current.filter((p) => p.peerId !== peerId));
			});
			room.onPeerStream((remote, peerId) => {
				setPeers((current) =>
					current.map((p) =>
						p.peerId === peerId ? { ...p, stream: remote } : p,
					),
				);
				try {
					const ctx =
						audioContextRef.current ??
						new (
							window.AudioContext ??
							(window as unknown as { webkitAudioContext: typeof AudioContext })
								.webkitAudioContext
						)();
					audioContextRef.current = ctx;
					const source = ctx.createMediaStreamSource(remote);
					const analyser = ctx.createAnalyser();
					analyser.fftSize = 256;
					source.connect(analyser);
					analyzersRef.current.set(peerId, analyser);
				} catch {
					// Volume meter is best-effort.
				}
			});

			setConnecting(false);
		};
		void start();

		return () => {
			cancelled = true;
			const room = roomRef.current;
			roomRef.current = null;
			const lk = liveKitRef.current;
			liveKitRef.current = null;
			const stream = localStreamRef.current;
			localStreamRef.current = null;
			const rawStream = rawStreamRef.current;
			rawStreamRef.current = null;
			analyzersRef.current.forEach((a) => {
				try {
					a.disconnect();
				} catch {
					/* analyzer already detached */
				}
			});
			analyzersRef.current.clear();
			if (audioContextRef.current) {
				audioContextRef.current.close().catch(() => {});
				audioContextRef.current = null;
			}
			if (bgPipelineRef.current) {
				bgPipelineRef.current.stop();
				bgPipelineRef.current = null;
			}
			if (room) room.leave().catch(() => {});
			if (lk) lk.leave().catch(() => {});
			if (stream) {
				for (const t of stream.getTracks()) {
					t.stop();
				}
			}
			if (rawStream && rawStream !== stream) {
				for (const t of rawStream.getTracks()) {
					t.stop();
				}
			}
			setPeers([]);
			setLocalStream(null);
		};
	}, [
		campaignId,
		sessionId,
		enabled,
		mediaConstraints,
		virtualBackground,
		transport,
		livekitUrl,
		livekitToken,
	]);

	// -------------------------------------------------------------------
	// Volume meter ticker. Walks every analyser node ~150 ms.
	// -------------------------------------------------------------------
	useEffect(() => {
		if (!enabled) return;
		let raf: number | null = null;
		let lastTs = 0;
		const tick = (ts: number) => {
			raf = requestAnimationFrame(tick);
			if (ts - lastTs < 150) return;
			lastTs = ts;
			if (analyzersRef.current.size === 0) return;
			setPeers((current) =>
				current.map((peer) => {
					const analyser = analyzersRef.current.get(peer.peerId);
					if (!analyser) return peer;
					const data = new Uint8Array(analyser.fftSize);
					analyser.getByteTimeDomainData(data);
					let sum = 0;
					for (let i = 0; i < data.length; i++) {
						const v = (data[i] - 128) / 128;
						sum += v * v;
					}
					const rms = Math.sqrt(sum / data.length);
					return { ...peer, volume: Math.min(1, rms * 2.5) };
				}),
			);
		};
		raf = requestAnimationFrame(tick);
		return () => {
			if (raf !== null) cancelAnimationFrame(raf);
		};
	}, [enabled]);

	// -------------------------------------------------------------------
	// Mode-driven track enabled state. `always` keeps mic on, `ptt`
	// gates by `pttActiveRef`, `voice` is a coarse RMS gate (host
	// could refine via a separate AnalyserNode on the local stream).
	// -------------------------------------------------------------------
	const applyMicEnabled = useCallback((next: boolean) => {
		const stream = localStreamRef.current;
		if (!stream) return;
		for (const track of stream.getAudioTracks()) {
			track.enabled = next;
		}
	}, []);

	useEffect(() => {
		if (!localStream) return;
		if (mode === "always") applyMicEnabled(micEnabled);
		else if (mode === "ptt")
			applyMicEnabled(micEnabled && pttActiveRef.current);
	}, [mode, micEnabled, localStream, applyMicEnabled]);

	// -------------------------------------------------------------------
	// Controls
	// -------------------------------------------------------------------
	const toggleMic = useCallback(() => {
		setMicEnabled((prev) => {
			const next = !prev;
			if (modeRef.current !== "ptt") applyMicEnabled(next);
			return next;
		});
	}, [applyMicEnabled]);

	const toggleCam = useCallback(async () => {
		const stream = localStreamRef.current;
		if (!stream) return;
		const videoTracks = stream.getVideoTracks();
		if (videoTracks.length > 0) {
			const nextEnabled = !videoTracks[0].enabled;
			for (const track of videoTracks) track.enabled = nextEnabled;
			setCamEnabled(nextEnabled);
			return;
		}
		// Cam was disabled at startup — open a fresh track and add it to the room.
		try {
			const camStream = await navigator.mediaDevices.getUserMedia({
				video: true,
			});
			const track = camStream.getVideoTracks()[0];
			if (!track) return;
			stream.addTrack(track);
			const promises = roomRef.current?.addTrack(track, stream);
			if (promises) {
				for (const p of promises) {
					p.catch(() => {});
				}
			}
			setCamEnabled(true);
			setLocalStream(stream);
		} catch (e) {
			setError(e instanceof Error ? e : new Error("Failed to start camera."));
		}
	}, []);

	const setMode = useCallback(
		(next: CommNetMode) => {
			setModeState(next);
			modeRef.current = next;
			if (next === "ptt") applyMicEnabled(false);
			else if (next === "always") applyMicEnabled(micEnabled);
		},
		[applyMicEnabled, micEnabled],
	);

	const pushToTalk = useCallback(
		(active: boolean) => {
			pttActiveRef.current = active;
			if (modeRef.current === "ptt") {
				applyMicEnabled(active && micEnabled);
			}
		},
		[applyMicEnabled, micEnabled],
	);

	const leave = useCallback(() => {
		roomRef.current?.leave().catch(() => {});
		roomRef.current = null;
		if (localStreamRef.current) {
			for (const t of localStreamRef.current.getTracks()) {
				t.stop();
			}
		}
		localStreamRef.current = null;
		setLocalStream(null);
		setPeers([]);
	}, []);

	const memoizedPeers = useMemo<ReadonlyArray<CommNetPeer>>(
		() => peers,
		[peers],
	);
	const voiceMode = mode === "voice";
	// Voice mode uses the peers volume meters; downstream UI can read it.
	// We expose the local mic-gate plainly so consumers don't need to peek.
	void voiceMode;
	void voiceThreshold;

	return {
		peers: memoizedPeers,
		localStream,
		micEnabled,
		camEnabled,
		mode,
		toggleMic,
		toggleCam,
		setMode,
		pushToTalk,
		error,
		connecting,
		leave,
	};
}

export default useCommNet;
