import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "@/styles/source-book.css";

interface SourceBookLayoutProps {
	children: React.ReactNode;
	activeSection: string;
}

const SECTIONS = [
	{ id: "intro", label: "Intro", path: "/source-book/intro" },
	{ id: "rules", label: "Rules & Mechanics", path: "/source-book/rules" },
	{ id: "regents", label: "Regents", path: "/source-book/regents" },
	{ id: "jobs", label: "Jobs", path: "/source-book/jobs" },
	{ id: "backgrounds", label: "Backgrounds", path: "/source-book/backgrounds" },
	{ id: "feats", label: "Feats", path: "/source-book/feats" },
	{
		id: "techniques",
		label: "Specializations",
		path: "/source-book/techniques",
	},
	{ id: "runes", label: "Runes & Sigils", path: "/source-book/runes" },
	{ id: "monsters", label: "Monsters", path: "/source-book/monsters" },
	{ id: "spells", label: "Spells", path: "/source-book/spells" },
	{ id: "items", label: "Items & Relics", path: "/source-book/items" },
	{ id: "locations", label: "World Guide", path: "/source-book/locations" },
];

export const SourceBookLayout: React.FC<SourceBookLayoutProps> = ({
	children,
	activeSection,
}) => {
	const navigate = useNavigate();
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);

	return (
		<div className="source-book-container flex min-h-screen bg-void">
			{/* TOC Sidebar */}
			<aside
				className={`transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-0"} bg-glass border-r border-amethyst/30 overflow-hidden flex flex-col`}
			>
				<div className="p-4 border-b border-cyan/30">
					<h2 className="text-xl font-bold text-cyan tracking-tighter uppercase font-display">
						System Protocols
					</h2>
				</div>
				<nav className="flex-1 overflow-y-auto p-2 space-y-1">
					{SECTIONS.map((section) => (
						<button
							key={section.id}
							type="button"
							onClick={() => navigate(section.path)}
							className={`w-full text-left p-3 rounded-sm transition-all font-heading uppercase text-sm tracking-widest ${
								activeSection === section.id
									? "bg-amethyst/20 border-l-4 border-amethyst text-white"
									: "text-muted-foreground hover:bg-cyan/5 hover:text-cyan"
							}`}
						>
							{section.label}
						</button>
					))}
				</nav>
			</aside>

			{/* Main Content Area */}
			<main className="flex-1 relative flex flex-col overflow-y-auto bg-system-grid-overlay-50">
				<header className="h-16 border-b border-amethyst/20 bg-glass/50 flex items-center justify-between px-6 sticky top-0 z-40 backdrop-blur-md">
					<div className="flex items-center gap-4">
						<button
							type="button"
							onClick={() => setIsSidebarOpen(!isSidebarOpen)}
							className="text-cyan hover:text-white transition-colors"
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
						<div className="flex items-center gap-2 text-xs font-heading tracking-widest text-muted-foreground uppercase">
							<span>System</span>
							<span className="text-amethyst">/</span>
							<span>Electronic Source Book</span>
							<span className="text-amethyst">/</span>
							<span className="text-cyan">
								{SECTIONS.find((s) => s.id === activeSection)?.label ||
									activeSection}
							</span>
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
			<div className="sb-bookmarks">
				{SECTIONS.map((section) => (
					<button
						key={section.id}
						type="button"
						onClick={() => navigate(section.path)}
						className={`sb-bookmark ${activeSection === section.id ? "active" : ""}`}
					>
						{section.label}
					</button>
				))}
			</div>
		</div>
	);
};
