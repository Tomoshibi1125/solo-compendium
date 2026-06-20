import { Volume2 } from "lucide-react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { SourceBookStatBlock } from "@/components/compendium/SourceBookStatBlock";
import { anomalies } from "@/data/compendium/anomalies";
import type { CompendiumAnomaly } from "@/types/compendium";

// ---------------------------------------------------------------------------
// Shared renderer for all campaign-book / wiki markdown. Adds:
//   • GFM tables (the chapters are full of them — Dread track, d20 tables, CR
//     bands) — react-markdown alone does not render these.
//   • "Read aloud" blockquotes styled as boxed read-aloud callouts.
//   • Auto-surfaced creature stat blocks: any section that mentions a canonical
//     anomaly id (e.g. anomaly-0700) gets a collapsible of its printed blocks,
//     reusing SourceBookStatBlock so the Warden never has to leave the page.
// ---------------------------------------------------------------------------

const ANOMALY_BY_ID = new Map(
	(anomalies as CompendiumAnomaly[]).map((a) => [a.id, a] as const),
);

const ANOMALY_ID_RE = /anomaly-0\d{3}/g;
const READ_ALOUD_RE = /^\s*read[\s-]*aloud/i;

const remarkPlugins = [remarkGfm];

// react-markdown passes hast nodes to component overrides; gather their text.
type HastNode = { type?: string; value?: string; children?: HastNode[] };
function nodeText(node: HastNode | undefined): string {
	if (!node) return "";
	if (node.type === "text") return node.value ?? "";
	return (node.children ?? []).map(nodeText).join("");
}

const baseComponents: Components = {
	blockquote({ node, children }) {
		const text = nodeText(node as unknown as HastNode);
		if (READ_ALOUD_RE.test(text)) {
			return (
				<div className="not-prose my-5 rounded-md border border-amber-500/40 border-l-4 border-l-amber-500/80 bg-amber-950/15 px-5 py-3 shadow-inner">
					<div className="mb-1.5 flex items-center gap-1.5 font-display text-[10px] uppercase tracking-[0.2em] text-amber-400/80">
						<Volume2 className="h-3 w-3" />
						Read Aloud
					</div>
					<div className="font-serif italic leading-relaxed text-amber-100/90">
						{children}
					</div>
				</div>
			);
		}
		return (
			<blockquote className="my-4 border-l-2 border-fuchsia-500/40 pl-4 italic text-slate-400">
				{children}
			</blockquote>
		);
	},
	table({ children }) {
		return (
			<div className="not-prose my-5 overflow-x-auto rounded-md border border-fuchsia-500/20">
				<table className="w-full border-collapse text-sm">{children}</table>
			</div>
		);
	},
	th({ children }) {
		return (
			<th className="border border-fuchsia-500/20 bg-fuchsia-950/40 px-3 py-2 text-left font-display text-xs uppercase tracking-wider text-fuchsia-300">
				{children}
			</th>
		);
	},
	td({ children }) {
		return (
			<td className="border border-fuchsia-500/15 px-3 py-2 align-top text-slate-300">
				{children}
			</td>
		);
	},
};

interface BookMarkdownProps {
	children?: string;
	/** Extra component overrides (e.g. the wiki's wiki:// link handler). */
	extraComponents?: Components;
}

export function BookMarkdown({ children, extraComponents }: BookMarkdownProps) {
	const content = typeof children === "string" ? children : "";

	const referenced = Array.from(new Set(content.match(ANOMALY_ID_RE) ?? []))
		.map((id) => ANOMALY_BY_ID.get(id))
		.filter((a): a is CompendiumAnomaly => Boolean(a));

	const components = extraComponents
		? { ...baseComponents, ...extraComponents }
		: baseComponents;

	return (
		<>
			<ReactMarkdown remarkPlugins={remarkPlugins} components={components}>
				{content}
			</ReactMarkdown>
			{referenced.length > 0 && (
				<details className="not-prose mt-8 rounded-lg border border-fuchsia-500/25 bg-black/30 [&[open]]:bg-black/40">
					<summary className="cursor-pointer select-none px-4 py-3 font-display text-xs uppercase tracking-[0.2em] text-fuchsia-300 transition-colors hover:text-white">
						Stat Blocks Referenced ({referenced.length})
					</summary>
					<div className="space-y-6 px-4 pb-5 pt-2">
						{referenced.map((creature) => (
							<SourceBookStatBlock key={creature.id} Anomaly={creature} />
						))}
					</div>
				</details>
			)}
		</>
	);
}
