import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// The production Vercel serverless handler (plain ESM JS).
import handler from "../../../api/ai.js";

type JsonRecord = Record<string, unknown>;

function makeReq(body: JsonRecord, ip = "203.0.113.7") {
	return {
		method: "POST",
		headers: { "x-forwarded-for": ip } as Record<string, string>,
		socket: { remoteAddress: ip },
		body,
	};
}

function makeRes() {
	const res = {
		statusCode: 200,
		headers: {} as Record<string, string>,
		payload: undefined as unknown,
		setHeader(name: string, value: string) {
			res.headers[name] = value;
		},
		status(code: number) {
			res.statusCode = code;
			return res;
		},
		json(payload: unknown) {
			res.payload = payload;
			return res;
		},
		end() {
			return res;
		},
	};
	return res;
}

const geminiSuccess = (text: string) =>
	new Response(
		JSON.stringify({
			candidates: [{ content: { parts: [{ text }] } }],
			usageMetadata: { promptTokenCount: 1, candidatesTokenCount: 1 },
		}),
		{ status: 200, headers: { "Content-Type": "application/json" } },
	);

const notFound = () =>
	new Response(JSON.stringify({ error: { message: "model not found" } }), {
		status: 404,
		headers: { "Content-Type": "application/json" },
	});

describe("/api/ai free provider chain", () => {
	beforeEach(() => {
		vi.stubEnv("GEMINI_API_KEY", "test-key");
		vi.stubEnv("GEMINI_MODEL", "");
		vi.stubEnv("OPENROUTER_API_KEY", "");
		vi.stubEnv("OPENROUTER_MODEL", "");
		vi.stubEnv("AI_PROVIDER_ORDER", "gemini,openrouter,pollinations");
		vi.stubEnv("AI_PROXY_SECRET", "");
	});

	afterEach(() => {
		vi.unstubAllEnvs();
		vi.unstubAllGlobals();
		vi.restoreAllMocks();
	});

	it("tries gemini-3.5-flash first and falls through the model ladder on 404", async () => {
		const fetchMock = vi
			.fn<typeof fetch>()
			.mockResolvedValueOnce(notFound()) // gemini-3.5-flash
			.mockResolvedValueOnce(geminiSuccess("ladder-success")); // gemini-3-flash-preview
		vi.stubGlobal("fetch", fetchMock);

		const res = makeRes();
		await handler(makeReq({ prompt: "Say hi" }, "203.0.113.10"), res);

		expect(res.statusCode).toBe(200);
		expect(res.payload).toMatchObject({
			success: true,
			text: "ladder-success",
			model: "gemini-3-flash-preview",
			provider: "gemini",
		});

		const urls = fetchMock.mock.calls.map(([url]) => String(url));
		expect(urls[0]).toContain("/models/gemini-3.5-flash:");
		expect(urls[1]).toContain("/models/gemini-3-flash-preview:");
	});

	it("falls back to keyless pollinations when every gemini model fails", async () => {
		const fetchMock = vi.fn<typeof fetch>().mockImplementation(async (url) => {
			if (String(url).includes("generativelanguage.googleapis.com")) {
				return notFound();
			}
			// pollinations
			return new Response(
				JSON.stringify({
					choices: [{ message: { content: "pollinations-success" } }],
				}),
				{ status: 200, headers: { "Content-Type": "application/json" } },
			);
		});
		vi.stubGlobal("fetch", fetchMock);

		const res = makeRes();
		await handler(makeReq({ prompt: "Say hi" }, "203.0.113.11"), res);

		expect(res.statusCode).toBe(200);
		expect(res.payload).toMatchObject({
			success: true,
			text: "pollinations-success",
			provider: "pollinations",
		});
	});

	it("routes vision requests down the Gemini leg with inlineData parts", async () => {
		const fetchMock = vi
			.fn<typeof fetch>()
			.mockResolvedValueOnce(geminiSuccess("vision-success"));
		vi.stubGlobal("fetch", fetchMock);

		const res = makeRes();
		await handler(
			makeReq(
				{
					prompt: "Describe the artwork",
					images: ["data:image/png;base64,aGVsbG8="],
				},
				"203.0.113.13",
			),
			res,
		);

		expect(res.statusCode).toBe(200);
		expect(res.payload).toMatchObject({ success: true, provider: "gemini" });

		const [, init] = fetchMock.mock.calls[0];
		const body = JSON.parse(String(init?.body)) as {
			contents: Array<{ parts: Array<Record<string, unknown>> }>;
		};
		expect(body.contents[0].parts).toEqual([
			{ text: "Describe the artwork" },
			{ inlineData: { mimeType: "image/png", data: "aGVsbG8=" } },
		]);
	});

	it("never sends images to non-vision legs: no Gemini key → 502, not pollinations", async () => {
		vi.stubEnv("GEMINI_API_KEY", "");
		const fetchMock = vi.fn<typeof fetch>();
		vi.stubGlobal("fetch", fetchMock);

		const res = makeRes();
		await handler(
			makeReq(
				{ prompt: "Describe", images: ["data:image/png;base64,aGVsbG8="] },
				"203.0.113.14",
			),
			res,
		);

		expect(res.statusCode).toBe(502);
		expect(String((res.payload as { error?: string }).error)).toContain(
			"Gemini leg",
		);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it("rejects malformed image payloads with 400", async () => {
		const fetchMock = vi.fn<typeof fetch>();
		vi.stubGlobal("fetch", fetchMock);

		for (const images of [
			["not-a-data-url"],
			[{ mimeType: "text/plain", data: "aGVsbG8=" }],
			"data:image/png;base64,aGVsbG8=", // not an array
		]) {
			const res = makeRes();
			await handler(makeReq({ prompt: "x", images }, "203.0.113.15"), res);
			expect(res.statusCode).toBe(400);
		}
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it("user-pinned openrouter model is tried before the default ladder", async () => {
		vi.stubEnv("OPENROUTER_API_KEY", "test-or-key");
		const fetchMock = vi
			.fn<typeof fetch>()
			.mockImplementation(async (url, init) => {
				if (String(url).includes("openrouter.ai")) {
					const body = JSON.parse(String(init?.body)) as { model: string };
					return new Response(
						JSON.stringify({
							model: body.model,
							choices: [{ message: { content: `via ${body.model}` } }],
						}),
						{ status: 200, headers: { "Content-Type": "application/json" } },
					);
				}
				return notFound();
			});
		vi.stubGlobal("fetch", fetchMock);

		const res = makeRes();
		await handler(
			makeReq(
				{
					prompt: "Say hi",
					provider: "openrouter",
					model: "meta-llama/llama-3.3-70b-instruct:free",
				},
				"203.0.113.12",
			),
			res,
		);

		expect(res.statusCode).toBe(200);
		expect(res.payload).toMatchObject({
			success: true,
			model: "meta-llama/llama-3.3-70b-instruct:free",
			provider: "openrouter",
		});
	});
});
