/**
 * Misty Pearl I4 — Comm-Net virtual backgrounds.
 *
 * Uses `@mediapipe/tasks-vision`'s ImageSegmenter to extract the
 * person mask from a local video stream, composites it over a blurred
 * background (or a custom image), and returns a derived MediaStream
 * the host can plug into `useCommNet` in place of the raw camera
 * feed.
 *
 * Free, MIT, runs entirely on-device — no cloud calls.
 *
 * Usage:
 *   const wrapper = await createVirtualBackgroundPipeline({ kind: 'blur' });
 *   const wrappedStream = await wrapper.start(rawStream);
 *   commNet.replaceVideoTrack(wrappedStream.getVideoTracks()[0]);
 *   // …later:
 *   wrapper.stop();
 */

export type VirtualBackgroundKind =
	| { kind: "blur"; sigma?: number }
	| { kind: "image"; src: string };

export interface VirtualBackgroundPipeline {
	start(source: MediaStream): Promise<MediaStream>;
	stop(): void;
	isActive(): boolean;
}

const MODEL_ASSET_URL =
	"https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter/float16/latest/selfie_segmenter.tflite";

interface ImageSegmenter {
	segmentForVideo(
		image: HTMLVideoElement | OffscreenCanvas,
		timestamp: number,
		callback: (result: { categoryMask?: { getAsUint8Array(): Uint8Array } }) => void,
	): void;
	close(): void;
}

interface SegmenterFactory {
	createFromOptions(
		filesetResolver: unknown,
		options: Record<string, unknown>,
	): Promise<ImageSegmenter>;
}

let cachedSegmenter: ImageSegmenter | null = null;

async function ensureSegmenter(): Promise<ImageSegmenter> {
	if (cachedSegmenter) return cachedSegmenter;
	const mp = (await import("@mediapipe/tasks-vision")) as unknown as {
		FilesetResolver: { forVisionTasks(url: string): Promise<unknown> };
		ImageSegmenter: SegmenterFactory;
	};
	const fileset = await mp.FilesetResolver.forVisionTasks(
		"https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm",
	);
	const segmenter = await mp.ImageSegmenter.createFromOptions(fileset, {
		baseOptions: { modelAssetPath: MODEL_ASSET_URL, delegate: "GPU" },
		runningMode: "VIDEO",
		outputCategoryMask: true,
		outputConfidenceMasks: false,
	});
	cachedSegmenter = segmenter;
	return segmenter;
}

export async function createVirtualBackgroundPipeline(
	kind: VirtualBackgroundKind,
): Promise<VirtualBackgroundPipeline> {
	const segmenter = await ensureSegmenter();
	let raf: number | null = null;
	let active = false;
	let stopRequested = false;
	let bgImage: HTMLImageElement | null = null;
	if (kind.kind === "image") {
		bgImage = new Image();
		bgImage.crossOrigin = "anonymous";
		bgImage.src = kind.src;
		await new Promise<void>((resolve, reject) => {
			if (!bgImage) return reject(new Error("no image"));
			bgImage.onload = () => resolve();
			bgImage.onerror = () => reject(new Error("image load failed"));
		});
	}

	const start = async (source: MediaStream): Promise<MediaStream> => {
		const videoTrack = source.getVideoTracks()[0];
		if (!videoTrack) throw new Error("no video track on source stream");

		const settings = videoTrack.getSettings();
		const width = settings.width ?? 640;
		const height = settings.height ?? 360;

		const video = document.createElement("video");
		video.srcObject = source;
		video.muted = true;
		video.playsInline = true;
		await video.play();

		const canvas = document.createElement("canvas");
		canvas.width = width;
		canvas.height = height;
		const ctx = canvas.getContext("2d", {
			willReadFrequently: true,
		}) as CanvasRenderingContext2D;
		if (!ctx) throw new Error("canvas 2D context unavailable");

		const draw = (ts: number) => {
			if (stopRequested) return;
			raf = requestAnimationFrame(draw);
			if (video.readyState < 2) return;

			segmenter.segmentForVideo(video, ts, (result) => {
				const mask = result.categoryMask?.getAsUint8Array();
				if (!mask) return;
				// 1. Draw the original frame at full opacity.
				ctx.drawImage(video, 0, 0, width, height);
				const frame = ctx.getImageData(0, 0, width, height);
				const data = frame.data;
				// 2. Build a background fill — blurred frame or static image.
				if (kind.kind === "blur") {
					ctx.filter = `blur(${kind.sigma ?? 12}px)`;
					ctx.drawImage(video, 0, 0, width, height);
					ctx.filter = "none";
				} else if (bgImage) {
					ctx.drawImage(bgImage, 0, 0, width, height);
				}
				const bg = ctx.getImageData(0, 0, width, height).data;
				// 3. Composite: keep person pixels (mask = 0), use bg elsewhere.
				const composite = ctx.createImageData(width, height);
				for (let i = 0; i < mask.length; i++) {
					const offset = i * 4;
					const isPerson = mask[i] === 0;
					if (isPerson) {
						composite.data[offset] = data[offset];
						composite.data[offset + 1] = data[offset + 1];
						composite.data[offset + 2] = data[offset + 2];
						composite.data[offset + 3] = 255;
					} else {
						composite.data[offset] = bg[offset];
						composite.data[offset + 1] = bg[offset + 1];
						composite.data[offset + 2] = bg[offset + 2];
						composite.data[offset + 3] = 255;
					}
				}
				ctx.putImageData(composite, 0, 0);
			});
		};
		raf = requestAnimationFrame(draw);
		active = true;

		const outStream = canvas.captureStream(30);
		// Preserve audio tracks from the original source.
		for (const audio of source.getAudioTracks()) {
			outStream.addTrack(audio);
		}
		return outStream;
	};

	const stop = () => {
		stopRequested = true;
		if (raf !== null) cancelAnimationFrame(raf);
		active = false;
	};

	return { start, stop, isActive: () => active };
}
