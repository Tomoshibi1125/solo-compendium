import type { IncomingMessage, ServerResponse } from "node:http";
import { handleSovereignGenerationRequest } from "./_sovereignGeneration";

const MAX_BODY_BYTES = 16 * 1024;

type VercelLikeRequest = IncomingMessage & { body?: unknown };
type VercelLikeResponse = ServerResponse & {
	status: (code: number) => VercelLikeResponse;
	json: (body: unknown) => unknown;
};

function headerValue(
	value: string | string[] | undefined,
): string | undefined {
	return Array.isArray(value) ? value[0] : value;
}

async function readBody(req: VercelLikeRequest): Promise<unknown> {
	if (req.body !== undefined && req.body !== null) {
		if (typeof req.body !== "string") return req.body;
		if (Buffer.byteLength(req.body, "utf8") > MAX_BODY_BYTES) {
			throw new Error("REQUEST_TOO_LARGE");
		}
		return JSON.parse(req.body);
	}

	let raw = "";
	let bytes = 0;
	for await (const chunk of req) {
		const text = Buffer.isBuffer(chunk) ? chunk.toString("utf8") : String(chunk);
		bytes += Buffer.byteLength(text, "utf8");
		if (bytes > MAX_BODY_BYTES) throw new Error("REQUEST_TOO_LARGE");
		raw += text;
	}
	return raw ? JSON.parse(raw) : {};
}

export default async function handler(
	req: VercelLikeRequest,
	res: VercelLikeResponse,
) {
	const allowedOrigin = process.env.ALLOWED_ORIGIN || "*";
	res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
	res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
	res.setHeader("Cache-Control", "no-store");

	if (req.method === "OPTIONS") {
		res.statusCode = 204;
		return res.end();
	}
	if (req.method !== "POST") {
		res.setHeader("Allow", "POST, OPTIONS");
		return res.status(405).json({ error: "Method not allowed" });
	}

	let body: unknown;
	try {
		body = await readBody(req);
	} catch (error) {
		return res.status(error instanceof Error && error.message === "REQUEST_TOO_LARGE" ? 413 : 400).json({
			error:
				error instanceof Error && error.message === "REQUEST_TOO_LARGE"
					? "Request body too large"
					: "Invalid JSON body",
		});
	}

	const forwarded = headerValue(req.headers["x-forwarded-for"]);
	const clientIp =
		forwarded?.split(",")[0]?.trim() || req.socket?.remoteAddress || "unknown";
	const result = await handleSovereignGenerationRequest({
		authorization: headerValue(req.headers.authorization),
		clientIp,
		body,
		env: process.env,
	});
	return res.status(result.status).json(result.body);
}
