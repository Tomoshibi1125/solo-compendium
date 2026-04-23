import {
	BookOpen,
	ChevronLeft,
	FileText,
	Layers,
	Loader2,
	Lock,
	Map as MapIcon,
	Send,
	ShieldAlert,
	ShieldX,
	Sparkles,
	Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { RiftHeading } from "@/components/ui/AscendantText";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCampaignHandouts } from "@/hooks/useCampaignHandouts";
import { useCampaignSandboxInjector } from "@/hooks/useCampaignSandboxInjector";
import { useCampaign, useHasWardenAccess } from "@/hooks/useCampaigns";
import { useCampaignWiki } from "@/hooks/useCampaignWiki";
import { useCampaignToolState } from "@/hooks/useToolState";
import type { VTTScene } from "@/types/vtt";
import "@/styles/source-book.css";
import ReactMarkdown from "react-markdown";

type SectionType = {
	id: string;
	title: string;
	type: "static" | "wiki" | "handout" | "scene" | "npc-roster";
	content?: string;
	meta?: Record<string, unknown>;
};

const CampaignBookView = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const { toast } = useToast();
	const { data: campaign, isLoading: loadingCampaign } = useCampaign(id || "");
	const { data: hasWardenAccess = false, isLoading: loadingAccess } =
		useHasWardenAccess(id || "");
	const { articles: wikiPages = [] } = useCampaignWiki(id || "");
	const { entries: handoutEntries = [] } = useCampaignHandouts(id || "");

	// VTT Scenes from campaign_tool_states
	const { state: vttState } = useCampaignToolState<{
		scenes: VTTScene[];
		currentSceneId?: string;
	} | null>(id || null, "vtt_scenes", {
		initialState: null,
		storageKey: `vtt-scenes-${id}`,
	});
	const vttScenes = vttState?.scenes ?? [];
	const { injectSandbox, isInjecting, progressString } =
		useCampaignSandboxInjector(id || null);

	const [activeSectionId, setActiveSectionId] = useState<string>("intro");

	// Derive NPC articles from wiki — must be before early returns per rules-of-hooks
	const npcArticles = useMemo(
		() => wikiPages.filter((p) => p.category === "npc"),
		[wikiPages],
	);
	const loreArticles = useMemo(
		() => wikiPages.filter((p) => p.category !== "npc"),
		[wikiPages],
	);

	if (loadingCampaign || loadingAccess) {
		return (
			<Layout>
				<div className="flex items-center justify-center min-h-screen text-fuchsia-500 animate-pulse gap-3">
					<Loader2 className="w-6 h-6 animate-spin" />
					Syncing Campaign Archives...
				</div>
			</Layout>
		);
	}

	if (!campaign)
		return (
			<Layout>
				<div className="p-8 text-center">Campaign Not Found</div>
			</Layout>
		);

	// --- Warden Access Gate ---
	if (!hasWardenAccess) {
		return (
			<Layout>
				<div className="container mx-auto px-4 py-16 max-w-lg text-center">
					<div className="glass-card border border-destructive/30 p-8 rounded-lg space-y-4">
						<ShieldX className="w-16 h-16 text-destructive mx-auto opacity-70" />
						<RiftHeading level={2} variant="gate" className="text-destructive">
							Access Restricted
						</RiftHeading>
						<p className="text-muted-foreground">
							The Campaign Book is restricted to the Warden of this campaign.
							Only the campaign owner can view and manage the module book.
						</p>
						<Button
							variant="outline"
							onClick={() => navigate(`/campaigns/${id}`)}
							className="mt-4"
						>
							<ChevronLeft className="w-4 h-4 mr-2" />
							Back to Campaign
						</Button>
					</div>
				</div>
			</Layout>
		);
	}

	const sections: SectionType[] = [
		{ id: "intro", title: "Campaign Preface", type: "static" },
		// Wiki lore chapters
		...loreArticles.map(
			(page: { id: string; title: string; content?: string }) => ({
				id: `wiki-${page.id}`,
				title: page.title,
				content: page.content,
				type: "wiki" as const,
			}),
		),
		// Handouts section
		...handoutEntries.map((h) => ({
			id: `handout-${h.id}`,
			title: h.title,
			content: h.content,
			type: "handout" as const,
			meta: { visibleToPlayers: h.visibleToPlayers, category: h.category },
		})),
		// NPC Roster
		...(npcArticles.length > 0
			? [{ id: "npc-roster", title: "NPC Roster", type: "npc-roster" as const }]
			: []),
		// VTT Scenes
		...vttScenes.map((scene, idx) => ({
			id: `scene-${idx}`,
			title: scene.name,
			type: "scene" as const,
			meta: {
				tokenCount: scene.tokens?.length ?? 0,
				fogOfWar: scene.fogOfWar,
				width: scene.width,
				height: scene.height,
				sceneId: scene.id,
			},
		})),
	];

	const activeSection =
		sections.find((s) => s.id === activeSectionId) || sections[0];

	const handleAutoPopulate = async () => {
		await injectSandbox();
	};

	const handleSendToVTT = (sectionTitle: string, content: string) => {
		// Store the content in sessionStorage so the VTT can pick it up
		const vttPayload = {
			type: "campaign-book-import",
			title: sectionTitle,
			content: content || "",
			timestamp: Date.now(),
			campaignId: id,
		};
		sessionStorage.setItem("vtt-book-import", JSON.stringify(vttPayload));
		toast({
			title: "Content Queued for VTT",
			description: `"${sectionTitle}" has been prepared for import. Open the VTT to use it.`,
		});
	};

	const handleOpenInVTT = () => {
		// Send the active section to VTT and navigate there
		if (activeSection) {
			handleSendToVTT(
				activeSection.title,
				activeSection.content || campaign.description || "",
			);
			navigate(`/campaigns/${id}/vtt`);
		}
	};

	return (
		<div className="source-book-container flex min-h-[100dvh] bg-void text-slate-300 font-sans">
			<aside className="w-72 bg-glass border-r border-fuchsia-500/20 flex flex-col shrink-0 relative overflow-y-auto">
				<div className="p-6 border-b border-fuchsia-500/20 relative z-10 bg-black/40 backdrop-blur-md">
					<Link
						to={`/campaigns/${id}`}
						className="text-fuchsia-400 hover:text-white flex items-center gap-2 mb-4 text-xs font-display uppercase tracking-widest transition-colors"
					>
						<ChevronLeft className="w-4 h-4" />
						Back to Dashboard
					</Link>
					<h2 className="text-lg font-bold text-white tracking-widest uppercase font-display flex items-center gap-2">
						<BookOpen className="w-5 h-5 text-fuchsia-500" />
						Module Book
					</h2>
					<div className="text-[10px] font-mono text-fuchsia-500/50 uppercase tracking-[0.2em] mt-1 break-words">
						{campaign.name}
					</div>
				</div>

				<nav className="flex-1 p-4 space-y-6 overflow-y-auto">
					{/* Lore Chapters */}
					<div className="space-y-2">
						<h3 className="px-2 text-[10px] font-bold text-fuchsia-400/60 uppercase tracking-[0.2em] mb-3 font-display flex items-center gap-1.5">
							<BookOpen className="w-3 h-3" />
							Lore Chapters (
							{
								sections.filter((s) => s.type === "static" || s.type === "wiki")
									.length
							}
							)
						</h3>
						<div className="space-y-1">
							{sections
								.filter((s) => s.type === "static" || s.type === "wiki")
								.map((section) => (
									<button
										key={section.id}
										type="button"
										onClick={() => setActiveSectionId(section.id)}
										className={`w-full text-left p-2 pl-3 rounded transition-all font-display uppercase text-[10px] tracking-widest ${
											activeSectionId === section.id
												? "bg-fuchsia-500/10 border-l-2 border-fuchsia-500 text-white shadow-inner"
												: "text-slate-500 hover:bg-fuchsia-500/5 hover:text-fuchsia-300"
										}`}
									>
										{section.title}
									</button>
								))}
						</div>
					</div>

					{/* Handouts */}
					{handoutEntries.length > 0 && (
						<div className="space-y-2">
							<h3 className="px-2 text-[10px] font-bold text-cyan-400/60 uppercase tracking-[0.2em] mb-3 font-display flex items-center gap-1.5">
								<FileText className="w-3 h-3" />
								Handouts & Documents ({handoutEntries.length})
							</h3>
							<div className="space-y-1">
								{sections
									.filter((s) => s.type === "handout")
									.map((section) => (
										<button
											key={section.id}
											type="button"
											onClick={() => setActiveSectionId(section.id)}
											className={`w-full text-left p-2 pl-3 rounded transition-all font-display uppercase text-[10px] tracking-widest flex items-center gap-1.5 ${
												activeSectionId === section.id
													? "bg-cyan-500/10 border-l-2 border-cyan-500 text-white shadow-inner"
													: "text-slate-500 hover:bg-cyan-500/5 hover:text-cyan-300"
											}`}
										>
											{!section.meta?.visibleToPlayers && (
												<Lock className="w-2.5 h-2.5 text-amber-400/60 shrink-0" />
											)}
											<span className="truncate">{section.title}</span>
										</button>
									))}
							</div>
						</div>
					)}

					{/* NPC Roster */}
					{npcArticles.length > 0 && (
						<div className="space-y-2">
							<h3 className="px-2 text-[10px] font-bold text-emerald-400/60 uppercase tracking-[0.2em] mb-3 font-display flex items-center gap-1.5">
								<Users className="w-3 h-3" />
								NPC Roster ({npcArticles.length})
							</h3>
							<div className="space-y-1">
								<button
									type="button"
									onClick={() => setActiveSectionId("npc-roster")}
									className={`w-full text-left p-2 pl-3 rounded transition-all font-display uppercase text-[10px] tracking-widest ${
										activeSectionId === "npc-roster"
											? "bg-emerald-500/10 border-l-2 border-emerald-500 text-white shadow-inner"
											: "text-slate-500 hover:bg-emerald-500/5 hover:text-emerald-300"
									}`}
								>
									View All NPCs ({npcArticles.length})
								</button>
							</div>
						</div>
					)}

					{/* VTT Maps */}
					{vttScenes.length > 0 && (
						<div className="space-y-2">
							<h3 className="px-2 text-[10px] font-bold text-amber-400/60 uppercase tracking-[0.2em] mb-3 font-display flex items-center gap-1.5">
								<MapIcon className="w-3 h-3" />
								VTT Maps ({vttScenes.length})
							</h3>
							<div className="space-y-1">
								{sections
									.filter((s) => s.type === "scene")
									.map((section) => (
										<button
											key={section.id}
											type="button"
											onClick={() => setActiveSectionId(section.id)}
											className={`w-full text-left p-2 pl-3 rounded transition-all font-display uppercase text-[10px] tracking-widest ${
												activeSectionId === section.id
													? "bg-amber-500/10 border-l-2 border-amber-500 text-white shadow-inner"
													: "text-slate-500 hover:bg-amber-500/5 hover:text-amber-300"
											}`}
										>
											{section.title}
										</button>
									))}
							</div>
						</div>
					)}

					{/* Module Generation Actions */}
					<div className="border-t border-fuchsia-500/20 pt-4 space-y-2">
						<h3 className="px-2 text-[10px] font-bold text-fuchsia-400/60 uppercase tracking-[0.2em] mb-3 font-display">
							Module Tools
						</h3>
						<Button
							variant="outline"
							size="sm"
							className="w-full gap-2 border-fuchsia-500/30 hover:border-amethyst hover:bg-amethyst/10 text-xs"
							onClick={handleAutoPopulate}
							disabled={isInjecting}
						>
							{isInjecting ? (
								<Loader2 className="w-3 h-3 animate-spin" />
							) : (
								<Sparkles className="w-3 h-3 text-amethyst" />
							)}
							{isInjecting ? "Importing Module..." : "Auto-Populate Wiki"}
						</Button>
						{isInjecting && progressString && (
							<div className="text-[9px] text-amethyst mt-1 text-center truncate italic">
								{progressString}
							</div>
						)}
					</div>

					{/* VTT Integration Actions */}
					<div className="border-t border-fuchsia-500/20 pt-4 space-y-2">
						<h3 className="px-2 text-[10px] font-bold text-fuchsia-400/60 uppercase tracking-[0.2em] mb-3 font-display">
							VTT Actions
						</h3>
						<Button
							variant="outline"
							size="sm"
							className="w-full gap-2 border-fuchsia-500/30 hover:border-fuchsia-500 hover:bg-fuchsia-500/10 text-xs"
							onClick={handleOpenInVTT}
						>
							<Layers className="w-3 h-3" />
							Open in VTT
						</Button>
						{activeSection?.content && (
							<Button
								variant="outline"
								size="sm"
								className="w-full gap-2 border-fuchsia-500/30 hover:border-fuchsia-500 hover:bg-fuchsia-500/10 text-xs"
								onClick={() =>
									handleSendToVTT(
										activeSection.title,
										activeSection.content || "",
									)
								}
							>
								<Send className="w-3 h-3" />
								Send Section to VTT
							</Button>
						)}
					</div>
				</nav>
			</aside>

			<main className="flex-1 relative flex flex-col overflow-y-auto bg-system-grid-overlay-50 text-slate-300">
				<header className="h-16 border-b border-fuchsia-500/10 bg-glass/50 flex items-center justify-between px-8 sticky top-0 z-40 backdrop-blur-md">
					<div className="flex items-center gap-2 text-xs font-heading tracking-widest text-muted-foreground uppercase">
						<span>Campaign Module</span>
						<span className="text-amethyst">/</span>
						<span className="text-cyan">{activeSection?.title}</span>
					</div>
					<div className="flex items-center gap-2">
						<Button
							variant="ghost"
							size="sm"
							className="gap-1 text-xs text-fuchsia-400 hover:text-white"
							onClick={handleOpenInVTT}
						>
							<Layers className="w-3 h-3" />
							<span className="hidden sm:inline">Open in VTT</span>
						</Button>
					</div>
				</header>

				<article className="max-w-4xl mx-auto p-8 lg:p-12 w-full animate-fade-in prose prose-invert prose-fuchsia">
					{activeSection?.type === "static" && activeSection.id === "intro" && (
						<div className="space-y-8">
							<RiftHeading
								level={1}
								variant="sovereign"
								className="text-5xl mb-4 border-b border-fuchsia-500/20 pb-4"
							>
								{campaign.name}
							</RiftHeading>
							<div className="text-xl text-slate-400 leading-relaxed font-serif">
								{campaign.description ||
									"No description provided for this campaign module."}
							</div>

							{/* Import Summary Panel */}
							<div className="bg-fuchsia-900/10 border border-fuchsia-500/20 rounded p-6 mt-8">
								<h3 className="text-lg font-display uppercase tracking-widest text-fuchsia-400 mb-2 flex items-center gap-2">
									<ShieldAlert className="w-5 h-5" />
									Warden's Note
								</h3>
								<p className="text-sm font-mono text-slate-400 mb-4">
									This digital campaign book synchronizes directly with the
									Warden's Wiki and Handouts. Updates made in the dashboard are
									automatically reflected here. Use the VTT Actions in the
									sidebar to import content directly into your session.
								</p>

								{/* Import Manifest */}
								<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 not-prose">
									<div className="bg-fuchsia-950/40 border border-fuchsia-500/20 rounded p-3 text-center">
										<div className="text-2xl font-bold text-fuchsia-400">
											{loreArticles.length}
										</div>
										<div className="text-[10px] text-slate-500 uppercase tracking-wider">
											Lore Chapters
										</div>
									</div>
									<div className="bg-cyan-950/40 border border-cyan-500/20 rounded p-3 text-center">
										<div className="text-2xl font-bold text-cyan-400">
											{handoutEntries.length}
										</div>
										<div className="text-[10px] text-slate-500 uppercase tracking-wider">
											Handouts
										</div>
									</div>
									<div className="bg-emerald-950/40 border border-emerald-500/20 rounded p-3 text-center">
										<div className="text-2xl font-bold text-emerald-400">
											{npcArticles.length}
										</div>
										<div className="text-[10px] text-slate-500 uppercase tracking-wider">
											NPCs
										</div>
									</div>
									<div className="bg-amber-950/40 border border-amber-500/20 rounded p-3 text-center">
										<div className="text-2xl font-bold text-amber-400">
											{vttScenes.length}
										</div>
										<div className="text-[10px] text-slate-500 uppercase tracking-wider">
											VTT Maps
										</div>
									</div>
								</div>

								{wikiPages.length === 0 && (
									<Button
										variant="outline"
										className="border-amethyst/50 text-amethyst hover:bg-amethyst/10 mt-4"
										onClick={handleAutoPopulate}
										disabled={isInjecting}
									>
										{isInjecting ? (
											<Loader2 className="w-4 h-4 mr-2 animate-spin" />
										) : (
											<Sparkles className="w-4 h-4 mr-2" />
										)}
										{isInjecting
											? progressString || "Importing Sandbox..."
											: "Auto-Populate Full Sandbox Module"}
									</Button>
								)}
							</div>
						</div>
					)}

					{activeSection?.type === "wiki" && (
						<div className="space-y-6">
							<div className="flex items-center justify-between">
								<h1 className="text-4xl font-display text-white uppercase tracking-wider mb-8 border-b border-fuchsia-500/20 pb-4 flex-1">
									{activeSection.title}
								</h1>
								<Button
									variant="ghost"
									size="sm"
									className="gap-1 text-xs text-fuchsia-400 hover:text-white shrink-0 ml-4"
									onClick={() =>
										handleSendToVTT(
											activeSection.title,
											activeSection.content || "",
										)
									}
								>
									<Send className="w-3 h-3" />
									Send to VTT
								</Button>
							</div>
							<div className="font-serif text-lg leading-loose">
								<ReactMarkdown>
									{activeSection.content || "*No content recorded.*"}
								</ReactMarkdown>
							</div>
						</div>
					)}

					{/* Handout Renderer */}
					{activeSection?.type === "handout" && (
						<div className="space-y-6">
							<div className="flex items-center justify-between">
								<h1 className="text-4xl font-display text-white uppercase tracking-wider pb-4 flex-1">
									{activeSection.title}
								</h1>
							</div>
							<div className="flex items-center gap-2 pb-4 border-b border-cyan-500/20 not-prose">
								<Badge
									variant="outline"
									className="text-cyan-400 border-cyan-500/30 text-[10px]"
								>
									{String(
										activeSection.meta?.category || "handout",
									).toUpperCase()}
								</Badge>
								{activeSection.meta?.visibleToPlayers ? (
									<Badge
										variant="outline"
										className="text-green-400 border-green-500/30 text-[10px]"
									>
										Shared with Players
									</Badge>
								) : (
									<Badge
										variant="outline"
										className="text-amber-400 border-amber-500/30 text-[10px]"
									>
										<Lock className="w-3 h-3 mr-1" />
										Warden Only
									</Badge>
								)}
							</div>
							<div className="font-serif text-lg leading-loose">
								<ReactMarkdown>
									{activeSection.content || "*No content recorded.*"}
								</ReactMarkdown>
							</div>
						</div>
					)}

					{/* VTT Scene Renderer */}
					{activeSection?.type === "scene" && (
						<div className="space-y-6 not-prose">
							<h1 className="text-4xl font-display text-white uppercase tracking-wider mb-4 border-b border-amber-500/20 pb-4">
								{activeSection.title}
							</h1>
							<div className="grid grid-cols-2 gap-4">
								<div className="bg-amber-950/30 border border-amber-500/20 rounded p-4">
									<div className="text-[10px] text-amber-400/60 uppercase tracking-wider mb-1">
										Tokens
									</div>
									<div className="text-2xl font-bold text-amber-400">
										{String(activeSection.meta?.tokenCount ?? 0)}
									</div>
								</div>
								<div className="bg-amber-950/30 border border-amber-500/20 rounded p-4">
									<div className="text-[10px] text-amber-400/60 uppercase tracking-wider mb-1">
										Grid Size
									</div>
									<div className="text-2xl font-bold text-amber-400">
										{String(activeSection.meta?.width ?? 0)}×
										{String(activeSection.meta?.height ?? 0)}
									</div>
								</div>
								<div className="bg-amber-950/30 border border-amber-500/20 rounded p-4">
									<div className="text-[10px] text-amber-400/60 uppercase tracking-wider mb-1">
										Fog of War
									</div>
									<div className="text-2xl font-bold text-amber-400">
										{activeSection.meta?.fogOfWar ? "Enabled" : "Disabled"}
									</div>
								</div>
								<div className="bg-amber-950/30 border border-amber-500/20 rounded p-4">
									<div className="text-[10px] text-amber-400/60 uppercase tracking-wider mb-1">
										Scene ID
									</div>
									<div className="text-sm font-mono text-amber-400 truncate">
										{String(activeSection.meta?.sceneId ?? "—")}
									</div>
								</div>
							</div>
							<Button
								className="w-full gap-2 border-amber-500/40 hover:border-amber-400 hover:bg-amber-500/10 text-amber-400"
								variant="outline"
								asChild
							>
								<Link to={`/campaigns/${id}/vtt`}>
									<Layers className="w-4 h-4" />
									Launch in VTT
								</Link>
							</Button>
						</div>
					)}

					{/* NPC Roster Renderer */}
					{activeSection?.type === "npc-roster" && (
						<div className="space-y-6 not-prose">
							<h1 className="text-4xl font-display text-white uppercase tracking-wider mb-4 border-b border-emerald-500/20 pb-4">
								NPC Roster ({npcArticles.length})
							</h1>
							<p className="text-sm text-slate-400 mb-6">
								All named NPCs imported from "The Shadow of the Regent" module.
								Click to expand.
							</p>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{npcArticles.map((npc) => (
									<details
										key={npc.id}
										className="bg-emerald-950/20 border border-emerald-500/20 rounded-lg overflow-hidden group"
									>
										<summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-emerald-500/5 transition-colors list-none">
											<div className="flex items-center gap-3">
												<Users className="w-4 h-4 text-emerald-400 shrink-0" />
												<div>
													<div className="font-display text-sm text-white uppercase tracking-wider">
														{npc.title}
													</div>
													<div className="text-[10px] text-emerald-400/60 mt-0.5">
														{npc.category.toUpperCase()}
													</div>
												</div>
											</div>
										</summary>
										<div className="p-4 pt-0 border-t border-emerald-500/10">
											<div className="font-serif text-sm leading-relaxed text-slate-400 prose prose-invert prose-sm max-w-none">
												<ReactMarkdown>
													{npc.content || "*No details available.*"}
												</ReactMarkdown>
											</div>
										</div>
									</details>
								))}
							</div>
						</div>
					)}
				</article>
			</main>
		</div>
	);
};

export default CampaignBookView;
