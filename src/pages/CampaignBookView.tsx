import { BookOpen, ChevronLeft, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { RiftHeading } from "@/components/ui/AscendantText";
import { useCampaign } from "@/hooks/useCampaigns";
import { useCampaignWiki } from "@/hooks/useCampaignWiki";
import "@/styles/source-book.css";
import ReactMarkdown from "react-markdown";

type SectionType = {
	id: string;
	title: string;
	type: "static" | "wiki";
	content?: string;
};

const CampaignBookView = () => {
	const { id } = useParams<{ id: string }>();
	const { data: campaign, isLoading: loadingCampaign } = useCampaign(id || "");
	const { articles: wikiPages = [] } = useCampaignWiki(id || "");

	const [activeSectionId, setActiveSectionId] = useState<string>("intro");

	if (loadingCampaign) {
		return (
			<Layout>
				<div className="flex items-center justify-center min-h-screen text-fuchsia-500 animate-pulse">
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

	const sections: SectionType[] = [
		{ id: "intro", title: "Campaign Preface", type: "static" },
		...wikiPages.map(
			(page: { id: string; title: string; content?: string }) => ({
				id: `wiki-${page.id}`,
				title: page.title,
				content: page.content,
				type: "wiki" as const,
			}),
		),
	];

	const activeSection =
		sections.find((s) => s.id === activeSectionId) || sections[0];

	return (
		<div className="source-book-container flex min-h-screen bg-void text-slate-300 font-sans">
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

				<nav className="flex-1 p-4 space-y-6">
					<div className="space-y-2">
						<h3 className="px-2 text-[10px] font-bold text-fuchsia-400/60 uppercase tracking-[0.2em] mb-3 font-display">
							Table of Contents
						</h3>
						<div className="space-y-1">
							{sections.map((section) => (
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
				</nav>
			</aside>

			<main className="flex-1 relative flex flex-col overflow-y-auto bg-system-grid-overlay-50 text-slate-300">
				<header className="h-16 border-b border-fuchsia-500/10 bg-glass/50 flex items-center justify-between px-8 sticky top-0 z-40 backdrop-blur-md">
					<div className="flex items-center gap-2 text-xs font-heading tracking-widest text-muted-foreground uppercase">
						<span>Campaign Module</span>
						<span className="text-amethyst">/</span>
						<span className="text-cyan">{activeSection?.title}</span>
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

							<div className="bg-fuchsia-900/10 border border-fuchsia-500/20 rounded p-6 mt-8">
								<h3 className="text-lg font-display uppercase tracking-widest text-fuchsia-400 mb-2 flex items-center gap-2">
									<ShieldAlert className="w-5 h-5" />
									Warden's Note
								</h3>
								<p className="text-sm font-mono text-slate-400">
									This digital campaign book synchronizes directly with the
									Warden's Wiki and Handouts. Updates made in the dashboard are
									automatically reflected here.
								</p>
							</div>
						</div>
					)}

					{activeSection?.type === "wiki" && (
						<div className="space-y-6">
							<h1 className="text-4xl font-display text-white uppercase tracking-wider mb-8 border-b border-fuchsia-500/20 pb-4">
								{activeSection.title}
							</h1>
							<div className="font-serif text-lg leading-loose">
								<ReactMarkdown>
									{activeSection.content || "*No content recorded.*"}
								</ReactMarkdown>
							</div>
						</div>
					)}
				</article>
			</main>
		</div>
	);
};

export default CampaignBookView;
