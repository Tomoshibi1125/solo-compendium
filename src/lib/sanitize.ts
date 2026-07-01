/**
 * Input sanitization utilities
 * Prevents XSS and ensures safe data handling
 */

import DOMPurify from "dompurify";

const RICH_TEXT_ALLOWED_TAGS = [
	"a",
	"p",
	"br",
	"strong",
	"em",
	"u",
	"s",
	"ul",
	"ol",
	"li",
	"blockquote",
	"pre",
	"code",
	"span",
	"h1",
	"h2",
	"h3",
];

const RICH_TEXT_ALLOWED_ATTR = ["href", "target", "rel", "style", "class"];

// Sanitize HTML content (basic - for user-generated content)
export function sanitizeHTML(html: string): string {
	const div = document.createElement("div");
	div.textContent = html;
	return div.innerHTML;
}

// Sanitize rich text HTML while preserving safe formatting.
export function sanitizeRichText(html: string): string {
	if (typeof window === "undefined") {
		return sanitizeHTML(html);
	}

	const sanitized = DOMPurify.sanitize(html, {
		ALLOWED_TAGS: RICH_TEXT_ALLOWED_TAGS,
		ALLOWED_ATTR: RICH_TEXT_ALLOWED_ATTR,
	});

	const doc = new DOMParser().parseFromString(sanitized, "text/html");
	doc.querySelectorAll('a[target="_blank"]').forEach((anchor) => {
		anchor.setAttribute("rel", "noopener noreferrer");
	});
	return doc.body.innerHTML;
}
