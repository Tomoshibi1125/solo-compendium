/**
 * Type surface for the plain-JS Vercel serverless handler (api/ai.js), so
 * TypeScript tests can import and exercise the free provider chain directly.
 */
interface AiProxyRequest {
	method?: string;
	headers: Record<string, string | undefined>;
	socket?: { remoteAddress?: string };
	body?: unknown;
}

interface AiProxyResponse {
	setHeader(name: string, value: string): void;
	status(code: number): AiProxyResponse;
	json(payload: unknown): AiProxyResponse;
	end(): AiProxyResponse;
}

declare function handler(
	req: AiProxyRequest,
	res: AiProxyResponse,
): Promise<unknown>;

export default handler;
