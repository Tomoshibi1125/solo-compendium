import {
	createPrivacySettings,
	type NotePermission,
	type NotePrivacySettings,
	type NoteVisibility,
} from "@/lib/notePrivacy";

const NOTE_META_PREFIX = "<!--SC_NOTE_META:";
const NOTE_META_SUFFIX = "-->";
const NOTE_META_REGEX = /^<!--SC_NOTE_META:([A-Za-z0-9+/=]+)-->\r?\n?/;
const SECRET_BLOCK_REGEX =
	/\[\[secret(?::([^\]]+))?\]\]([\s\S]*?)\[\[\/secret\]\]/gi;

interface StoredCampaignNoteMeta {
	visibility?: NoteVisibility;
	showTitleOnly?: boolean;
	playerPermissions?: Record<string, NotePermission>;
}

export interface CampaignNoteSecretSegment {
	id: string;
	kind: "text" | "secret";
	content: string;
	label?: string | null;
}

const globalBuffer = globalThis as typeof globalThis & {
	Buffer?: {
		from: (
			value: string,
			encoding?: "utf8" | "base64",
		) => { toString: (encoding?: "utf8" | "base64") => string };
	};
};

const encodeBase64 = (value: string): string => {
	if (typeof globalThis.btoa === "function") {
		return globalThis.btoa(
			encodeURIComponent(value).replace(/%([0-9A-F]{2})/g, (_, hex: string) =>
				String.fromCharCode(parseInt(hex, 16)),
			),
		);
	}
	if (globalBuffer.Buffer) {
		return globalBuffer.Buffer.from(value, "utf8").toString("base64");
	}
	throw new Error("Base64 encoding is not available in this environment.");
};

const decodeBase64 = (value: string): string => {
	if (typeof globalThis.atob === "function") {
		const decoded = globalThis.atob(value);
		const escaped = decoded
			.split("")
			.map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`)
			.join("");
		return decodeURIComponent(escaped);
	}
	if (globalBuffer.Buffer) {
		return globalBuffer.Buffer.from(value, "base64").toString("utf8");
	}
	throw new Error("Base64 decoding is not available in this environment.");
};

const sanitizePermissions = (
	value: unknown,
): Record<string, NotePermission> => {
	if (!value || typeof value !== "object") return {};
	return Object.fromEntries(
		Object.entries(value).filter((entry): entry is [string, NotePermission] => {
			const permission = entry[1];
			return (
				typeof entry[0] === "string" &&
				(permission === "none" ||
					permission === "read" ||
					permission === "write")
			);
		}),
	);
};

export const stripCampaignNoteMetadata = (
	content: string | null | undefined,
) => {
	if (!content) return "";
	return content.replace(NOTE_META_REGEX, "");
};

export const decodeCampaignNoteContent = ({
	content,
	ownerId,
	isShared,
}: {
	content: string | null | undefined;
	ownerId: string;
	isShared: boolean;
}): {
	body: string;
	privacy: NotePrivacySettings;
	hasEmbeddedMetadata: boolean;
} => {
	const fallbackPrivacy = createPrivacySettings(ownerId);
	if (isShared) {
		fallbackPrivacy.visibility = "shared";
	}
	if (!content) {
		return {
			body: "",
			privacy: fallbackPrivacy,
			hasEmbeddedMetadata: false,
		};
	}

	const match = content.match(NOTE_META_REGEX);
	if (!match) {
		return {
			body: content,
			privacy: fallbackPrivacy,
			hasEmbeddedMetadata: false,
		};
	}

	try {
		const parsed = JSON.parse(
			decodeBase64(match[1]),
		) as StoredCampaignNoteMeta | null;
		const privacy = createPrivacySettings(ownerId);
		privacy.visibility = parsed?.visibility ?? fallbackPrivacy.visibility;
		privacy.showTitleOnly = parsed?.showTitleOnly ?? false;
		privacy.playerPermissions = sanitizePermissions(parsed?.playerPermissions);
		return {
			body: content.slice(match[0].length),
			privacy,
			hasEmbeddedMetadata: true,
		};
	} catch {
		return {
			body: stripCampaignNoteMetadata(content),
			privacy: fallbackPrivacy,
			hasEmbeddedMetadata: false,
		};
	}
};

export const encodeCampaignNoteContent = ({
	body,
	privacy,
}: {
	body: string;
	privacy: NotePrivacySettings;
}) => {
	const meta: StoredCampaignNoteMeta = {
		visibility: privacy.visibility,
		showTitleOnly: privacy.showTitleOnly,
		playerPermissions: privacy.playerPermissions,
	};
	const encodedMeta = encodeBase64(JSON.stringify(meta));
	const sanitizedBody = stripCampaignNoteMetadata(body);
	return `${NOTE_META_PREFIX}${encodedMeta}${NOTE_META_SUFFIX}\n${sanitizedBody}`;
};

export const parseCampaignNoteSegments = (
	body: string,
): CampaignNoteSecretSegment[] => {
	const segments: CampaignNoteSecretSegment[] = [];
	let cursor = 0;
	let match = SECRET_BLOCK_REGEX.exec(body);

	let segIdx = 0;
	while (match) {
		if (match.index > cursor) {
			segments.push({
				id: `text-${segIdx++}`,
				kind: "text",
				content: body.slice(cursor, match.index),
			});
		}
		segments.push({
			id: `secret-${segIdx++}`,
			kind: "secret",
			label: match[1]?.trim() || null,
			content: match[2] || "",
		});
		cursor = match.index + match[0].length;
		match = SECRET_BLOCK_REGEX.exec(body);
	}

	if (cursor < body.length) {
		segments.push({
			id: `text-${segIdx++}`,
			kind: "text",
			content: body.slice(cursor),
		});
	}

	if (segments.length === 0) {
		segments.push({ id: "text-0", kind: "text", content: body });
	}

	SECRET_BLOCK_REGEX.lastIndex = 0;
	return segments;
};
