import { Mic, MicOff, Sparkles, Video, VideoOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	BROADCAST_MODES,
	type CommNetMode,
	type CommNetPeer,
	type CommNetTransportKind,
	useCommNet,
} from "@/hooks/useCommNet";
import type { VirtualBackgroundKind } from "@/lib/commnet/virtualBackground";
import { cn } from "@/lib/utils";

/**
 * Misty Pearl A1 — Comm-Net rail tab UI.
 *
 * Lightweight WebRTC voice/video panel. Each connected peer becomes
 * a small tile with a waveform indicator + remote video stream (if
 * shared). Local controls: mic / cam / mode + PTT (hold Space).
 *
 * RA theming: "Comm-Net" = Bureau communications uplink. Mute =
 * "Cloak Channel". Cam off = "Mask Identity". PTT = "Push Burst".
 */
export interface CommNetPanelProps {
	campaignId: string | null;
	sessionId?: string | null;
	enabled: boolean;
	enableVideo?: boolean;
	/**
	 * Misty Pearl I3 — transport override. Default `trystero` (P2P mesh).
	 * If the campaign provisioned a LiveKit server, pass `'livekit'` plus
	 * `livekitUrl` + `livekitToken` (minted server-side by a Supabase
	 * edge function or self-hosted equivalent).
	 */
	transport?: CommNetTransportKind;
	livekitUrl?: string;
	livekitToken?: string;
}

export function CommNetPanel({
	campaignId,
	sessionId,
	enabled,
	enableVideo = false,
	transport = "trystero",
	livekitUrl,
	livekitToken,
}: CommNetPanelProps) {
	// Misty Pearl I4 — local virtual-background selection. Null = pass-through.
	const [virtualBackground, setVirtualBackground] =
		useState<VirtualBackgroundKind | null>(null);

	const {
		peers,
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
	} = useCommNet({
		campaignId,
		sessionId: sessionId ?? null,
		enabled,
		mediaConstraints: {
			audio: {
				echoCancellation: true,
				noiseSuppression: true,
				autoGainControl: true,
			},
			video: enableVideo,
		},
		virtualBackground,
		transport,
		livekitUrl,
		livekitToken,
	});

	// Hold Space for PTT when in PTT mode.
	useEffect(() => {
		if (!enabled || mode !== "ptt") return;
		const onDown = (e: KeyboardEvent) => {
			if (e.code === "Space" && !e.repeat) pushToTalk(true);
		};
		const onUp = (e: KeyboardEvent) => {
			if (e.code === "Space") pushToTalk(false);
		};
		window.addEventListener("keydown", onDown);
		window.addEventListener("keyup", onUp);
		return () => {
			window.removeEventListener("keydown", onDown);
			window.removeEventListener("keyup", onUp);
		};
	}, [enabled, mode, pushToTalk]);

	return (
		<section
			className="space-y-3 p-2"
			data-testid="commnet-panel"
			aria-label="Bureau Comm-Net controls"
		>
			<div>
				<p
					className="font-resurge text-[10px] uppercase tracking-[0.4em] text-primary/80"
					id="commnet-panel-heading"
				>
					Bureau Comm-Net
				</p>
				<div aria-live="polite" aria-atomic="true">
					{!enabled && (
						<p className="text-xs text-muted-foreground mt-1">
							Uplink offline. Enable from the Warden's session controls.
						</p>
					)}
					{connecting && (
						<p className="text-xs text-amber-300 mt-1">Negotiating uplink…</p>
					)}
					{error && (
						<p className="text-xs text-destructive mt-1" role="alert">
							{error.message}
						</p>
					)}
				</div>
			</div>

			{enabled && (
				<div className="flex flex-wrap gap-1.5">
					<Button
						size="sm"
						variant={micEnabled ? "default" : "outline"}
						onClick={toggleMic}
						aria-label={micEnabled ? "Cloak channel" : "Open channel"}
						data-testid="commnet-mic-toggle"
					>
						{micEnabled ? (
							<Mic className="w-3.5 h-3.5" />
						) : (
							<MicOff className="w-3.5 h-3.5" />
						)}
					</Button>
					<Button
						size="sm"
						variant={camEnabled ? "default" : "outline"}
						onClick={() => void toggleCam()}
						aria-label={camEnabled ? "Mask identity" : "Reveal identity"}
						data-testid="commnet-cam-toggle"
					>
						{camEnabled ? (
							<Video className="w-3.5 h-3.5" />
						) : (
							<VideoOff className="w-3.5 h-3.5" />
						)}
					</Button>
					<div className="inline-flex rounded-md border border-border/60 overflow-hidden text-[10px]">
						{BROADCAST_MODES.map((m) => (
							<button
								key={m}
								type="button"
								onClick={() => setMode(m as CommNetMode)}
								className={cn(
									"px-2 py-1 capitalize",
									mode === m
										? "bg-primary text-primary-foreground"
										: "bg-transparent text-foreground/70 hover:bg-muted/40",
								)}
								data-testid={`commnet-mode-${m}`}
							>
								{m === "ptt" ? "PTT" : m}
							</button>
						))}
					</div>
				</div>
			)}

			{enabled && mode === "ptt" && (
				<p className="text-[10px] text-muted-foreground">
					Hold <kbd className="px-1 rounded border border-border">Space</kbd> to
					push burst.
				</p>
			)}

			{/* Misty Pearl I4 — virtual background selector */}
			{enabled && enableVideo && (
				<div className="space-y-1.5">
					<p
						className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground flex items-center gap-1"
						id="commnet-bg-label"
					>
						<Sparkles className="w-3 h-3" aria-hidden /> Field Cloak
					</p>
					<fieldset
						className="inline-flex rounded-md border border-border/60 overflow-hidden text-[10px]"
						aria-labelledby="commnet-bg-label"
					>
						<button
							type="button"
							onClick={() => setVirtualBackground(null)}
							className={cn(
								"px-2 py-1",
								virtualBackground === null
									? "bg-primary text-primary-foreground"
									: "bg-transparent text-foreground/70 hover:bg-muted/40",
							)}
							data-testid="commnet-bg-none"
						>
							None
						</button>
						<button
							type="button"
							onClick={() => setVirtualBackground({ kind: "blur", sigma: 12 })}
							className={cn(
								"px-2 py-1",
								virtualBackground?.kind === "blur"
									? "bg-primary text-primary-foreground"
									: "bg-transparent text-foreground/70 hover:bg-muted/40",
							)}
							data-testid="commnet-bg-blur"
						>
							Blur
						</button>
					</fieldset>
					<p className="text-[10px] text-muted-foreground">
						On-device person segmentation via MediaPipe. No cloud calls.
					</p>
				</div>
			)}

			{enabled && (
				<div className="space-y-1.5">
					{localStream && (
						<CommNetPeerTile
							peer={{
								peerId: "local",
								stream: localStream,
								volume: 0,
							}}
							muted
							label="You (local)"
						/>
					)}
					{peers.map((peer) => (
						<CommNetPeerTile key={peer.peerId} peer={peer} />
					))}
					{peers.length === 0 && (
						<p className="text-xs text-muted-foreground italic">
							No remote operatives detected on the uplink yet.
						</p>
					)}
				</div>
			)}
		</section>
	);
}

function CommNetPeerTile({
	peer,
	label,
	muted,
}: {
	peer: CommNetPeer;
	label?: string;
	muted?: boolean;
}) {
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const videoRef = useRef<HTMLVideoElement | null>(null);

	useEffect(() => {
		if (audioRef.current && peer.stream) {
			audioRef.current.srcObject = peer.stream;
		}
		if (videoRef.current && peer.stream) {
			videoRef.current.srcObject = peer.stream;
		}
	}, [peer.stream]);

	const hasVideo =
		!!peer.stream && peer.stream.getVideoTracks().some((t) => t.enabled);
	const volumePct = Math.round(peer.volume * 100);

	return (
		<div
			className="flex items-center gap-2 rounded-md border border-border/60 bg-muted/30 p-2"
			data-testid={`commnet-peer-${peer.peerId}`}
		>
			{hasVideo ? (
				<video
					ref={videoRef}
					autoPlay
					playsInline
					muted={muted}
					className="w-10 h-10 rounded object-cover bg-black"
				/>
			) : (
				<div className="w-10 h-10 rounded bg-muted flex items-center justify-center text-[10px] uppercase tracking-wide text-foreground/60">
					{peer.peerId.slice(0, 2)}
				</div>
			)}
			<div className="flex-1 min-w-0">
				<p className="text-xs font-medium truncate">
					{label ?? `Operative ${peer.peerId.slice(0, 6)}`}
				</p>
				<div className="mt-1 h-1 rounded bg-muted overflow-hidden">
					<div
						className="h-full bg-primary transition-[width] duration-150"
						style={{ width: `${Math.min(100, volumePct)}%` }}
					/>
				</div>
			</div>
			{!muted && peer.stream && (
				<audio ref={audioRef} autoPlay>
					<track kind="captions" />
				</audio>
			)}
		</div>
	);
}
