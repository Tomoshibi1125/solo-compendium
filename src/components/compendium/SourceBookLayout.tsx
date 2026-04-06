import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "@/styles/source-book.css";

interface SourceBookLayoutProps {
	children: React.ReactNode;
	activeSection: string;
}

const BOOKS = [
	{
		title: "Ascendant's Guide",
		sections: [
			{ id: "intro", label: "Introduction", path: "/source-book/intro" },
			{
				id: "backgrounds",
				label: "Backgrounds",
				path: "/source-book/backgrounds",
			},
			{ id: "jobs", label: "Jobs", path: "/source-book/jobs" },
			{ id: "paths", label: "Paths", path: "/source-book/paths" },
			{ id: "feats", label: "Feats", path: "/source-book/feats" },
			{
				id: "techniques",
				label: "Techniques",
				path: "/source-book/techniques",
			},
			{ id: "runes", label: "Runes & Sigils", path: "/source-book/runes" },
			{ id: "spells", label: "Spells & Powers", path: "/source-book/spells" },
			{ id: "items", label: "Equipment & Relics", path: "/source-book/items" },
			{ id: "rules", label: "Rules & Mechanics", path: "/source-book/rules" },
		],
	},
	{
		title: "Warden's Directive",
		sections: [
			{ id: "world", label: "The New World Order", path: "/source-book/world" },
			{
				id: "locations",
				label: "World Directory",
				path: "/source-book/locations",
			},
			{
				id: "regents",
				label: "Regents & Sovereigns",
				path: "/source-book/regents",
			},
			{
				id: "gamerules",
				label: "Running the Game",
				path: "/source-book/gamerules",
			},
		],
	},
	{
		title: "The Anomaly Manifest",
		sections: [
			{
				id: "ecologies",
				label: "Bestiary Ecologies",
				path: "/source-book/ecologies",
			},
			{
				id: "anomalies",
				label: "The Manifest (A-Z)",
				path: "/source-book/anomalies",
			},
		],
	},
];

import { Ghost, Layers, Music, Radio, ShieldAlert } from "lucide-react";
import { getAssetSummary } from "@/lib/vtt";

// ... BOOKS definition remains the same

export const SourceBookLayout: React.FC<SourceBookLayoutProps> = ({
	children,
	activeSection,
}) => {
	const navigate = useNavigate();
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	const assetSummary = getAssetSummary();

	// Flatten all sections to find current active status
	let currentSectionLabel = activeSection;
	let currentBookTitle = "System Protocols";
	const allSections: { id: string; label: string; path: string }[] = [];

	BOOKS.forEach((book) => {
		book.sections.forEach((sec) => {
			allSections.push(sec);
			if (sec.id === activeSection) {
				currentSectionLabel = sec.label;
				currentBookTitle = book.title;
			}
		});
	});

	return (
		<div className="source-book-container flex min-h-screen bg-void text-slate-300">
			{/* TOC Sidebar */}
			<aside
				className={`transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-0"} bg-glass border-r border-fuchsia-500/20 overflow-hidden flex flex-col shrink-0 relative`}
			>
				<div className="absolute inset-0 bg-fuchsia-500/5 pointer-events-none" />

				<div className="p-6 border-b border-fuchsia-500/20 relative z-10">
					<h2 className="text-xl font-bold text-white tracking-widest uppercase font-display flex items-center gap-2">
						<ShieldAlert className="w-5 h-5 text-fuchsia-500 animate-pulse" />
						Warden's Compendium
					</h2>
					<div className="text-[8px] font-mono text-fuchsia-500/50 uppercase tracking-[0.3em] mt-1">
						Protocol Overseer v4.0
					</div>
				</div>

				<nav className="flex-1 overflow-y-auto p-4 space-y-8 relative z-10 custom-scrollbar">
					{BOOKS.map((book) => (
						<div key={book.title} className="space-y-2">
							<h3 className="px-2 text-[10px] font-bold text-fuchsia-400/60 uppercase tracking-[0.2em] mb-3 font-display">
								{book.title}
							</h3>
							<div className="space-y-1">
								{book.sections.map((section) => (
									<button
										key={section.id}
										type="button"
										onClick={() => navigate(section.path)}
										className={`w-full text-left p-2 pl-3 rounded transition-all font-display uppercase text-[10px] tracking-widest ${
											activeSection === section.id
												? "bg-fuchsia-500/10 border-l-2 border-fuchsia-500 text-white shadow-inner"
												: "text-slate-500 hover:bg-fuchsia-500/5 hover:text-fuchsia-300"
										}`}
									>
										{section.label}
									</button>
								))}
							</div>
						</div>
					))}
				</nav>

				{/* WIRING: Lattice Node Status (Using getAssetSummary) */}
				<div className="p-4 border-t border-fuchsia-500/20 bg-void/50 text-[9px] font-mono space-y-3 relative z-10">
					<div className="text-fuchsia-500/70 border-b border-fuchsia-500/10 pb-1 flex justify-between items-center">
						<span>Lattice Node Status</span>
						<span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
					</div>
					<div className="grid grid-cols-2 gap-2 text-slate-500">
						<div className="flex items-center gap-1.5">
							<Layers className="w-2.5 h-2.5 text-cyan-500" />
							<span>Rifts: {assetSummary.map || 0}</span>
						</div>
						<div className="flex items-center gap-1.5">
							<Ghost className="w-2.5 h-2.5 text-fuchsia-500" />
							<span>Echoes: {assetSummary.token || 0}</span>
						</div>
						<div className="flex items-center gap-1.5">
							<Music className="w-2.5 h-2.5 text-amber-500" />
							<span>
								Hymns: {assetSummary.music || assetSummary.audio || 0}
							</span>
						</div>
						<div className="flex items-center gap-1.5">
							<Radio className="w-2.5 h-2.5 text-emerald-500" />
							<span>Relics: {assetSummary.prop || 0}</span>
						</div>
					</div>
				</div>
			</aside>

			{/* Main Content Area */}
			<main className="flex-1 relative flex flex-col overflow-y-auto bg-system-grid-overlay-50">
				<header className="h-16 border-b border-fuchsia-500/10 bg-glass/50 flex items-center justify-between px-6 sticky top-0 z-40 backdrop-blur-md">
					<div className="flex items-center gap-4">
						<button
							type="button"
							onClick={() => setIsSidebarOpen(!isSidebarOpen)}
							className="text-fuchsia-400 hover:text-white transition-colors"
							title={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<title>
									{isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
								</title>
								<line x1="3" y1="12" x2="21" y2="12"></line>
								<line x1="3" y1="6" x2="21" y2="6"></line>
								<line x1="3" y1="18" x2="21" y2="18"></line>
							</svg>
						</button>
						<div className="flex items-center gap-2 text-xs font-heading tracking-widest text-muted-foreground uppercase hidden sm:flex">
							<span>System</span>
							<span className="text-amethyst">/</span>
							<span>{currentBookTitle}</span>
							<span className="text-amethyst">/</span>
							<span className="text-cyan">{currentSectionLabel}</span>
						</div>
					</div>
					<div className="flex items-center gap-4">
						<div className="text-[10px] font-mono text-cyan/50 uppercase tracking-tighter">
							Status: ARCHIVE_SYNCED {"//"} LEVEL: OVERSEER
						</div>
						<div className="w-10 h-10 rounded-full border border-cyan/30 flex items-center justify-center overflow-hidden bg-void shadow-[0_0_10px_rgba(0,212,255,0.2)]">
							<div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amethyst to-cyan animate-pulse opacity-50" />
						</div>
					</div>
				</header>

				<div className="flex-1 p-4 lg:p-8 animate-fade-in">{children}</div>
			</main>

			{/* Right-edge Bookmarks */}
			<div className="sb-bookmarks hidden xl:flex">
				{allSections.map((section) => (
					<button
						key={section.id}
						type="button"
						onClick={() => navigate(section.path)}
						className={`sb-bookmark ${activeSection === section.id ? "active" : ""}`}
						title={section.label}
					>
						{section.label}
					</button>
				))}
			</div>
		</div>
	);
};
