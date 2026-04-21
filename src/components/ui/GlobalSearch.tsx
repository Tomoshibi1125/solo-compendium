import { useQuery } from "@tanstack/react-query";
import { Clock, Loader2, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AutoLinkText } from "@/components/compendium/AutoLinkText";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { useRecentItems } from "@/hooks/useRecentItems";
import { supabase } from "@/integrations/supabase/client";
import { listCanonicalEntries } from "@/lib/canonicalCompendium";
import { error as logError } from "@/lib/logger";
import { filterRowsBySourcebookAccess } from "@/lib/sourcebookAccess";
import { cn } from "@/lib/utils";
import { formatRegentVernacular } from "@/lib/vernacular";

interface SearchResult {
	id: string;
	name: string;
	type: string;
	description?: string;
	href: string;
}

const canonicalSearchTypes = [
	"jobs",
	"paths",
	"powers",
	"runes",
	"relics",
	"anomalies",
	"backgrounds",
	"conditions",
	"regents",
	"feats",
	"skills",
	"equipment",
	"shadow-soldiers",
	"items",
	"spells",
	"techniques",
	"artifacts",
	"locations",
	"sigils",
	"tattoos",
	"pantheon",
] as const;

export function GlobalSearch({ className }: { className?: string }) {
	const navigate = useNavigate();
	const [query, setQuery] = useState("");
	const debouncedQuery = useDebounce(query, 300);
	const [isOpen, setIsOpen] = useState(false);
	const { recentItems, addRecentItem } = useRecentItems();
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key === "k") {
				e.preventDefault();
				inputRef.current?.focus();
				setIsOpen(true);
			}
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, []);

	const { data: results = [], isLoading } = useQuery({
		queryKey: ["global-search", debouncedQuery],
		queryFn: async () => {
			if (!debouncedQuery.trim()) return [];

			const allResults: SearchResult[] = [];

			const canonicalResults = await Promise.all(
				canonicalSearchTypes.map(async (type) => {
					const entries = await listCanonicalEntries(type, debouncedQuery);
					return entries.slice(0, 5).map((entry) => ({
						id: entry.id,
						name: entry.display_name || entry.name,
						type,
						description: entry.description || undefined,
						href: `/compendium/${type}/${entry.id}`,
					}));
				}),
			);

			allResults.push(...canonicalResults.flat());

			try {
				const { data: sovereignData, error: sovereignError } = await supabase
					.from("compendium_sovereigns")
					.select("id, name, display_name, description, source_book")
					.or(
						`name.ilike.%${debouncedQuery}%,display_name.ilike.%${debouncedQuery}%,description.ilike.%${debouncedQuery}%`,
					)
					.limit(5);

				if (sovereignError) {
					logError("Error searching compendium_sovereigns:", sovereignError);
				} else if (Array.isArray(sovereignData)) {
					const filteredSovereigns = await filterRowsBySourcebookAccess(
						sovereignData,
						(item) => item.source_book,
					);
					allResults.push(
						...filteredSovereigns.map((item) => ({
							id: item.id,
							name: item.display_name || item.name,
							type: "sovereigns",
							description: item.description || undefined,
							href: `/compendium/sovereigns/${item.id}`,
						})),
					);
				}
			} catch (error) {
				logError("Error searching sovereigns:", error);
			}

			// Search characters
			try {
				const { data } = await supabase
					.from("characters")
					.select("id, name")
					.ilike("name", `%${debouncedQuery}%`)
					.limit(5);

				if (data) {
					allResults.push(
						...data.map((char: { id: string; name: string }) => ({
							id: char.id,
							name: char.name,
							type: "characters",
							href: `/characters/${char.id}`,
						})),
					);
				}
			} catch (error) {
				logError("Error searching characters:", error);
			}

			const dedupedResults = new Map<string, SearchResult>();
			for (const result of allResults) {
				const key = `${result.type}:${result.id}`;
				if (!dedupedResults.has(key)) {
					dedupedResults.set(key, result);
				}
			}

			return Array.from(dedupedResults.values()).slice(0, 10);
		},
		enabled: debouncedQuery.length > 0,
	});

	const handleResultClick = (result: SearchResult) => {
		addRecentItem(result);
		navigate(result.href);
		setIsOpen(false);
		setQuery("");
	};

	return (
		<div className={cn("relative", className)}>
			<div className="relative">
				<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
				<Input
					ref={inputRef}
					type="search"
					placeholder="Search everything... (Ctrl+K)"
					value={query}
					onChange={(e) => {
						setQuery(e.target.value);
						setIsOpen(true);
					}}
					onFocus={() => setIsOpen(true)}
					className="pl-10"
				/>
				{query && (
					<Button
						variant="ghost"
						size="icon"
						className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
						onClick={() => {
							setQuery("");
							setIsOpen(false);
						}}
						aria-label="Clear search"
					>
						<X className="w-3 h-3" />
					</Button>
				)}
			</div>

			{isOpen && (
				<div className="absolute top-full left-0 right-0 mt-2 z-50">
					<AscendantWindow
						title="SEARCH RESULTS"
						className="max-h-[400px] overflow-y-auto"
					>
						{isLoading ? (
							<div className="flex items-center justify-center py-8">
								<Loader2 className="w-5 h-5 animate-spin text-primary" />
							</div>
						) : query.trim() === "" ? (
							<div>
								{recentItems.length > 0 && (
									<div className="mb-4">
										<div className="flex items-center gap-2 mb-2">
											<Clock className="w-4 h-4 text-muted-foreground" />
											<span className="text-xs font-heading text-muted-foreground">
												RECENT ITEMS
											</span>
										</div>
										<div className="space-y-1">
											{recentItems.slice(0, 5).map((item) => (
												<button
													type="button"
													key={`${item.type}-${item.id}`}
													onClick={() => handleResultClick(item)}
													className="w-full text-left p-2 rounded hover:bg-muted/50 transition-colors text-sm"
												>
													<div className="flex items-center justify-between">
														<span>{formatRegentVernacular(item.name)}</span>
														<Badge variant="outline" className="text-xs">
															{formatRegentVernacular(item.type)}
														</Badge>
													</div>
												</button>
											))}
										</div>
									</div>
								)}
								<p className="text-sm text-muted-foreground text-center py-4">
									Start typing to search...
								</p>
							</div>
						) : results.length === 0 ? (
							<p className="text-sm text-muted-foreground text-center py-8">
								No results found for "{query}"
							</p>
						) : (
							<div className="space-y-1">
								{results.map((result) => (
									<button
										type="button"
										key={`${result.type}-${result.id}`}
										onClick={() => handleResultClick(result)}
										className="w-full text-left p-2 rounded hover:bg-muted/50 transition-colors"
									>
										<div className="flex items-center justify-between mb-1">
											<span className="font-heading text-sm">
												{formatRegentVernacular(result.name)}
											</span>
											<Badge variant="outline" className="text-xs">
												{formatRegentVernacular(result.type)}
											</Badge>
										</div>
										{result.description && (
											<p className="text-xs text-muted-foreground line-clamp-1">
												<AutoLinkText text={result.description} />
											</p>
										)}
									</button>
								))}
							</div>
						)}
					</AscendantWindow>
				</div>
			)}
		</div>
	);
}
