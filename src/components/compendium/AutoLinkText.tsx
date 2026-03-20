import type { ReactNode } from "react";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useStartupData } from "@/hooks/useStartupData";
import { formatRegentVernacular } from "@/lib/vernacular";
import { CompendiumTooltip } from "./CompendiumTooltip";

interface AutoLinkTextProps {
	text: string;
	enabled?: boolean;
	tooltipEnabled?: boolean;
}

export function AutoLinkText({
	text,
	enabled = true,
	tooltipEnabled = true,
}: AutoLinkTextProps) {
	const { data: startupData } = useStartupData();

	const formattedText = useMemo(() => formatRegentVernacular(text), [text]);

	const processedContent = useMemo(() => {
		if (!enabled || !startupData?.entries || startupData.entries.length === 0) {
			return formattedText;
		}

		// Create a map of names to entries, sorting by length descending to match longest phrases first
		const entries = [...startupData.entries].sort(
			(a, b) => b.name.length - a.name.length,
		);

		// Escape regex special characters
		const escapeRegExp = (string: string) => {
			return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		};

		// Create a massive regex for all names
		// We use word boundaries and lookaheads to avoid matching inside existing links or tags if possible
		// But here we'll just match and replace carefully
		const names = entries.map((e) => escapeRegExp(e.name));
		const regex = new RegExp(`\\b(${names.join("|")})\\b`, "gi");

		const parts: (string | ReactNode)[] = [];
		let lastIndex = 0;
		const MAX_MATCHES = 50; // Safety limit per text block
		const matches = Array.from(formattedText.matchAll(regex)).slice(
			0,
			MAX_MATCHES,
		);

		for (const match of matches) {
			const matchIndex = match.index || 0;
			// Add the text before the match
			if (matchIndex > lastIndex) {
				parts.push(formattedText.substring(lastIndex, matchIndex));
			}

			const matchedName = match[0];
			const entry = entries.find(
				(e) => e.name.toLowerCase() === matchedName.toLowerCase(),
			);

			if (entry) {
				const link = (
					<Link
						key={`${entry.id}-${matchIndex}`}
						to={`/compendium/${entry.type}/${entry.id}`}
						className="text-primary hover:text-primary/80 font-medium transition-colors border-b border-primary/20 hover:border-primary/50"
					>
						{matchedName}
					</Link>
				);

				if (tooltipEnabled) {
					parts.push(
						<CompendiumTooltip
							key={`tooltip-${entry.id}-${matchIndex}`}
							type={entry.type}
							id={entry.id}
						>
							{link}
						</CompendiumTooltip>,
					);
				} else {
					parts.push(link);
				}
			} else {
				parts.push(matchedName);
			}

			lastIndex = matchIndex + matchedName.length;
		}

		// Add any remaining text
		if (lastIndex < formattedText.length) {
			parts.push(formattedText.substring(lastIndex));
		}

		return parts.length > 0 ? parts : formattedText;
	}, [formattedText, startupData, enabled, tooltipEnabled]);

	return <>{processedContent}</>;
}
