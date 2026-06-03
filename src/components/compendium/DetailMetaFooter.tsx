import { AutoLinkText } from "@/components/compendium/AutoLinkText";
import { Badge } from "@/components/ui/badge";
import { formatRegentVernacular } from "@/lib/vernacular";

/**
 * Shared "show what's there" footer for compendium detail views: surfaces the
 * universally-present metadata fields (flavor, lore/discovery_lore, tags,
 * source) that individual detail views frequently forget to render. Each field
 * renders only when populated. Use at the end of a detail view to guarantee
 * these data fields reach the UI (DDB-style completeness — audit Part 2).
 */
/** Render any populated scalar/array/object value as readable text. */
function stringifyExtra(value: unknown): string {
	if (value === null || value === undefined) return "";
	if (typeof value === "string") return value;
	if (typeof value === "number" || typeof value === "boolean")
		return String(value);
	if (Array.isArray(value))
		return value
			.map((v) => stringifyExtra(v))
			.filter(Boolean)
			.join(", ");
	if (typeof value === "object") {
		return Object.entries(value as Record<string, unknown>)
			.filter(([, v]) => v !== null && v !== undefined && v !== "")
			.map(([k, v]) => `${k}: ${stringifyExtra(v)}`)
			.join(" · ");
	}
	return "";
}

export function DetailMetaFooter({
	flavor,
	lore,
	discoveryLore,
	tags,
	sourceBook,
	extra,
}: {
	flavor?: string | null;
	lore?: string | { history?: string } | null;
	discoveryLore?: string | null;
	tags?: string[] | null;
	sourceBook?: string | null;
	/** Extra category-specific fields to surface as labeled rows when present. */
	extra?: Array<{ label: string; value: unknown }>;
}) {
	const loreText =
		(typeof lore === "string" ? lore : lore?.history) || discoveryLore || "";
	const tagList = Array.isArray(tags) ? tags.filter(Boolean) : [];
	const extraRows = (extra ?? [])
		.map((e) => ({ label: e.label, text: stringifyExtra(e.value) }))
		.filter((e) => e.text.length > 0);

	const hasAny =
		flavor || loreText || tagList.length > 0 || sourceBook || extraRows.length;
	if (!hasAny) return null;

	return (
		<div className="space-y-3">
			{extraRows.length > 0 && (
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
					{extraRows.map((row) => (
						<div key={row.label}>
							<span className="text-muted-foreground">{row.label}: </span>
							<span>
								<AutoLinkText text={row.text} />
							</span>
						</div>
					))}
				</div>
			)}
			{flavor && (
				<p className="text-sm italic text-muted-foreground leading-relaxed">
					<AutoLinkText text={flavor} />
				</p>
			)}
			{loreText && (
				<div className="pt-2 border-t border-primary/10">
					<h4 className="text-amethyst font-bold text-[10px] uppercase tracking-wider mb-1">
						Historical Record
					</h4>
					<p className="text-sm text-muted-foreground leading-relaxed">
						<AutoLinkText text={loreText} />
					</p>
				</div>
			)}
			{tagList.length > 0 && (
				<div className="flex flex-wrap gap-2">
					{tagList.map((tag) => (
						<Badge key={tag} variant="outline" className="text-[10px]">
							{formatRegentVernacular(tag)}
						</Badge>
					))}
				</div>
			)}
			{sourceBook && (
				<div className="flex justify-end">
					<Badge
						variant="outline"
						className="text-[10px] opacity-50 uppercase tracking-tighter"
					>
						Source: {formatRegentVernacular(sourceBook)}
					</Badge>
				</div>
			)}
		</div>
	);
}
