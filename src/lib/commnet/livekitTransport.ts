/**
 * Misty Pearl I3 — Comm-Net LiveKit SFU fallback.
 *
 * Provides an alternative transport for `useCommNet` when the
 * trystero mesh degrades past ~6 peers. The interface mirrors what
 * `useCommNet` already exposes (peers, addStream, leave, etc.) so
 * the consumer hook can switch transports behind the same surface.
 *
 * LiveKit Cloud free tier covers small communities; self-hosted
 * LiveKit servers are MIT-licensed for full sovereignty. No paid
 * features in the host integration.
 */
import {
	type LocalParticipant,
	type Participant,
	type RemoteParticipant,
	type RemoteTrackPublication,
	Room,
	RoomEvent,
	type Track,
} from "livekit-client";

interface LiveKitTransportOptions {
	url: string;
	token: string;
	roomName: string;
	onPeerJoin?: (peerId: string) => void;
	onPeerLeave?: (peerId: string) => void;
	onPeerStream?: (peerId: string, stream: MediaStream) => void;
	onConnectionError?: (err: Error) => void;
}

export interface LiveKitTransportHandle {
	addStream(stream: MediaStream): Promise<void>;
	removeStream(stream: MediaStream): Promise<void>;
	leave(): Promise<void>;
	getRoom(): Room;
	getLocalParticipant(): LocalParticipant;
}

const streamsFor = (participant: Participant): MediaStream => {
	const ms = new MediaStream();
	for (const publication of participant.trackPublications.values()) {
		const track = publication.track as Track | undefined;
		if (track?.mediaStreamTrack) {
			ms.addTrack(track.mediaStreamTrack);
		}
	}
	return ms;
};

/**
 * Connect to a LiveKit room using a pre-signed token. The host is
 * expected to mint the token via a Supabase edge function (or a
 * self-hosted equivalent) — the client never sees the API secret.
 */
export async function connectLiveKit(
	options: LiveKitTransportOptions,
): Promise<LiveKitTransportHandle> {
	const room = new Room({
		adaptiveStream: true,
		dynacast: true,
		publishDefaults: { simulcast: true },
	});

	const announceStream = (participant: RemoteParticipant) => {
		options.onPeerStream?.(participant.identity, streamsFor(participant));
	};

	room.on(RoomEvent.ParticipantConnected, (participant) => {
		options.onPeerJoin?.(participant.identity);
		// Some tracks may already be subscribed; re-announce after a tick.
		setTimeout(() => announceStream(participant), 200);
	});
	room.on(RoomEvent.ParticipantDisconnected, (participant) => {
		options.onPeerLeave?.(participant.identity);
	});
	room.on(RoomEvent.TrackSubscribed, (_track, _publication, participant) => {
		announceStream(participant);
	});
	room.on(RoomEvent.TrackUnsubscribed, (_track, _publication, participant) => {
		announceStream(participant);
	});

	try {
		await room.connect(options.url, options.token);
	} catch (err) {
		options.onConnectionError?.(
			err instanceof Error ? err : new Error("LiveKit connect failed"),
		);
		throw err;
	}

	const addStream = async (stream: MediaStream) => {
		for (const track of stream.getTracks()) {
			await room.localParticipant.publishTrack(track, {
				simulcast: track.kind === "video",
				dtx: track.kind === "audio",
			});
		}
	};

	const removeStream = async (stream: MediaStream) => {
		for (const track of stream.getTracks()) {
			await room.localParticipant.unpublishTrack(track, true);
		}
	};

	const leave = async () => {
		await room.disconnect();
	};

	// Suppress unused-import warning for RemoteTrackPublication.
	void ({} as RemoteTrackPublication);

	return {
		addStream,
		removeStream,
		leave,
		getRoom: () => room,
		getLocalParticipant: () => room.localParticipant,
	};
}
