/**
 * Enhanced Warden Directives Page
 * Professional Warden tools with Rift Ascendant theme
 */

import {
	Calendar,
	ChevronRight,
	Grid3x3,
	HelpCircle,
	List,
	Scroll,
	Search,
	Settings,
	Sword,
	Users,
	Zap,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { AscendantSigil } from "@/components/ui/AscendantSigil";
import { ManaFlowText, RiftHeading } from "@/components/ui/AscendantText";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	type ToolCatalogItem,
	WARDEN_TOOL_CATEGORIES,
	WARDEN_TOOLS,
} from "@/data/toolCatalogs";
import { cn } from "@/lib/utils";
import "./WardenProtocols.css";

const wardenProtocols = WARDEN_TOOLS;
const categories = WARDEN_TOOL_CATEGORIES;

const WardenProtocols = () => {
	const navigate = useNavigate();
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

	// Filter tools based on search and category
	const filteredTools = useMemo(() => {
		return wardenProtocols.filter((tool) => {
			const matchesSearch =
				tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				tool.description.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesCategory =
				selectedCategory === "all" || tool.category === selectedCategory;
			return matchesSearch && matchesCategory;
		});
	}, [searchQuery, selectedCategory]);

	// Group tools by category
	const toolsByCategory = useMemo(() => {
		const grouped = categories.reduce(
			(acc, category) => {
				acc[category.id] = filteredTools.filter(
					(tool) => category.id === "all" || tool.category === category.id,
				);
				return acc;
			},
			{} as Record<string, typeof wardenProtocols>,
		);
		return grouped;
	}, [filteredTools]);

	return (
		<Layout>
			<div
				data-testid="warden-tools"
				className="warden-directives-container relative"
			>
				{/* Ascendant UI Background Effects */}
				<div className="absolute inset-0 hex-grid-overlay opacity-20 pointer-events-none" />
				<div className="absolute inset-0 bg-gradient-to-b from-amethyst-purple/5 via-transparent to-obsidian-deep pointer-events-none" />

				{/* Header */}
				<div className="warden-directives-header relative z-10">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<AscendantSigil size="lg" className="flex-shrink-0" />
							<div>
								<RiftHeading
									level={1}
									variant="gate"
									dimensional
									className="warden-protocols-title ascendant-text-glow"
								>
									Warden Protocols
								</RiftHeading>
								<ManaFlowText
									variant="rift"
									speed="slow"
									className="warden-directives-subtitle block"
								>
									Divine protocols granted to guide Ascendants through the
									Rifts. In this post-reset world, the Rift's will shapes
									reality.
								</ManaFlowText>
							</div>
						</div>

						<div className="flex items-center gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => navigate("/compendium")}
							>
								<HelpCircle className="w-4 h-4 mr-2" />
								Help
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => navigate("/warden-directives/rift-console")}
							>
								<Settings className="w-4 h-4 mr-2" />
								Settings
							</Button>
						</div>
					</div>
				</div>

				{/* Eternal Loop */}
				<div className="eternal-loop-container relative z-10">
					<AscendantWindow
						title="THE ETERNAL LOOP"
						className="border-resurge/30 hud-brackets"
					>
						<div className="flex flex-col items-center gap-6">
							<div className="flex flex-col md:flex-row items-center gap-6 w-full">
								<div className="loop-step">
									<div className="step-number step-contract">1</div>
									<div className="step-content">
										<span className="step-title">CONTRACT</span>
										<p className="step-description">Accept the mission</p>
									</div>
								</div>
								<ChevronRight className="w-6 h-6 text-resurge/50 hidden md:block" />
								<div className="loop-step">
									<div className="step-number step-rift">2</div>
									<div className="step-content">
										<span className="step-title">RIFT</span>
										<p className="step-description">Enter the rift</p>
									</div>
								</div>
								<ChevronRight className="w-6 h-6 text-resurge/50 hidden md:block" />
								<div className="loop-step">
									<div className="step-number step-aftermath">3</div>
									<div className="step-content">
										<span className="step-title">AFTERMATH</span>
										<p className="step-description">Claim rewards</p>
									</div>
								</div>
							</div>
							<p className="loop-description">
								The core session structure from the Warden's Guide. Ascendants
								navigate Contracts, Rifts, and their Aftermath under the Rift's
								watchful gaze.
							</p>
						</div>
					</AscendantWindow>
				</div>

				{/* Search and Filters */}
				<div className="warden-directives-filters relative z-10">
					<div className="search-bar">
						<Search className="w-5 h-5 text-muted-foreground" />
						<Input
							placeholder="Search warden protocols..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="border-0 focus:ring-0"
						/>
					</div>

					<div className="filter-controls">
						<Select
							value={selectedCategory}
							onValueChange={setSelectedCategory}
						>
							<SelectTrigger className="w-48">
								<SelectValue placeholder="Category" />
							</SelectTrigger>
							<SelectContent>
								{categories.map((category) => {
									const Icon = category.icon;
									return (
										<SelectItem key={category.id} value={category.id}>
											<div className="flex items-center gap-2">
												<Icon className="w-4 h-4" />
												{category.name}
											</div>
										</SelectItem>
									);
								})}
							</SelectContent>
						</Select>

						<div className="view-toggle">
							<Button
								variant={viewMode === "grid" ? "default" : "outline"}
								size="sm"
								onClick={() => setViewMode("grid")}
							>
								<Grid3x3 className="w-4 h-4" />
							</Button>
							<Button
								variant={viewMode === "list" ? "default" : "outline"}
								size="sm"
								onClick={() => setViewMode("list")}
							>
								<List className="w-4 h-4" />
							</Button>
						</div>
					</div>
				</div>

				{/* Tools Content */}
				<div className="warden-directives-content relative z-10">
					{selectedCategory === "all" ? (
						// Categorized view
						<div className="space-y-8">
							{categories
								.filter((cat) => cat.id !== "all")
								.map((category) => {
									const categoryTools = toolsByCategory[category.id];
									if (categoryTools.length === 0) return null;

									const Icon = category.icon;
									return (
										<div key={category.id} className="category-section">
											<div className="category-header">
												<div className="flex items-center gap-2">
													<Icon className="w-5 h-5" />
													<RiftHeading
														level={2}
														variant="gate"
														className="category-title"
													>
														{category.name}
													</RiftHeading>
													<Badge variant="secondary">
														{categoryTools.length}
													</Badge>
												</div>
											</div>

											<div
												className={cn(
													"tools-grid",
													viewMode === "list" ? "tools-list" : "tools-grid",
												)}
											>
												{categoryTools.map((tool) => (
													<WardenToolCard
														key={tool.id}
														tool={tool}
														viewMode={viewMode}
													/>
												))}
											</div>
										</div>
									);
								})}
						</div>
					) : (
						// Single category view
						<div
							className={cn(
								"tools-grid",
								viewMode === "list" ? "tools-list" : "tools-grid",
							)}
						>
							{filteredTools.map((tool) => (
								<WardenToolCard key={tool.id} tool={tool} viewMode={viewMode} />
							))}
						</div>
					)}
				</div>

				{/* Quick Actions */}
				<div className="warden-directives-quick-actions relative z-10">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Zap className="w-5 h-5" />
								Quick Protocols
							</CardTitle>
							<CardDescription>
								Common tasks and shortcuts for Wardens
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
								<Button
									variant="outline"
									className="justify-start"
									onClick={() =>
										navigate("/warden-directives/encounter-builder")
									}
								>
									<Sword className="w-4 h-4 mr-2" />
									Quick Combat
								</Button>
								<Button
									variant="outline"
									className="justify-start"
									onClick={() =>
										navigate("/warden-directives/directive-lattice")
									}
								>
									<Scroll className="w-4 h-4 mr-2" />
									Directive Synthesis
								</Button>
								<Button
									variant="outline"
									className="justify-start"
									onClick={() => navigate("/warden-directives/party-tracker")}
								>
									<Users className="w-4 h-4 mr-2" />
									Party Status
								</Button>
								<Button
									variant="outline"
									className="justify-start"
									onClick={() => navigate("/warden-directives/session-planner")}
								>
									<Calendar className="w-4 h-4 mr-2" />
									Session Notes
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</Layout>
	);
};

// Warden Tool Card Component
const WardenToolCard = ({
	tool,
	viewMode,
}: {
	tool: ToolCatalogItem;
	viewMode: "grid" | "list";
}) => {
	const Icon = tool.icon;

	if (viewMode === "list") {
		return (
			<div
				className={cn(
					"warden-tool-card-list",
					"rounded-[2px] p-4 transition-all duration-300 group relative overflow-hidden backdrop-blur-md",
					"border-l-4 border-y border-r bg-black/60",
					"hover:shadow-[0_0_20px_rgba(0,0,0,0.8),inset_0_0_15px_currentColor] focus:outline-none",
					tool.color,
					tool.glow,
				)}
			>
				<div className="flex items-center justify-between relative z-10">
					<div className="flex items-center gap-4">
						<div
							className={cn(
								"warden-tool-icon-list",
								"w-10 h-10 rounded-[2px] flex items-center justify-center shrink-0",
								"bg-black/40 border border-current shadow-[inset_0_0_8px_rgba(0,0,0,0.5)]",
								tool.iconColor,
							)}
						>
							<Icon className="w-5 h-5" />
						</div>
						<div className="flex-1">
							<RiftHeading
								level={3}
								variant="sovereign"
								className="warden-tool-title-list font-heading text-base font-bold uppercase tracking-widest mb-1 group-hover:text-white transition-colors drop-shadow-[0_0_8px_currentColor]"
							>
								{tool.name}
							</RiftHeading>
							<ManaFlowText
								variant="rift"
								className="warden-tool-description-list text-[10px] font-mono tracking-wider text-foreground/80 uppercase"
							>
								{tool.description}
							</ManaFlowText>
						</div>
					</div>
					<div className="flex items-center gap-3">
						<Badge
							variant="secondary"
							className="font-mono text-[10px] tracking-widest uppercase bg-black/50 border-primary/20 hidden sm:inline-flex"
						>
							Available
						</Badge>
						<Button
							size="sm"
							className="font-heading tracking-widest uppercase"
							variant="outline"
							asChild
						>
							<Link
								to={
									(tool as { path?: string; buttonText?: string }).path ||
									`/warden-directives/${tool.id}`
								}
							>
								{(tool as { path?: string; buttonText?: string }).buttonText ||
									"Launch"}
							</Link>
						</Button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div
			className={cn(
				"warden-tool-card",
				"rounded-[2px] p-5 transition-all duration-300 group relative overflow-hidden backdrop-blur-md flex flex-col",
				"border-l-4 border-y border-r bg-black/60",
				"hover:shadow-[0_0_20px_rgba(0,0,0,0.8),inset_0_0_15px_currentColor] focus:outline-none",
				tool.color,
				tool.glow,
			)}
		>
			{/* Background glow */}
			<div
				className={cn(
					"absolute -bottom-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity",
					tool.color.split(" ")[0], // Uses the 'from-X' gradient class for the glow
				)}
			/>

			<div className="flex-1 relative z-10">
				<div
					className={cn(
						"warden-tool-icon",
						"w-12 h-12 rounded-[2px] flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110",
						"bg-black/40 border border-current shadow-[inset_0_0_8px_rgba(0,0,0,0.5)]",
						tool.iconColor,
					)}
				>
					<Icon className="w-6 h-6" />
				</div>
				<RiftHeading
					level={3}
					variant="sovereign"
					className="warden-tool-title font-heading text-xl font-bold uppercase tracking-widest mb-2 group-hover:text-white transition-colors drop-shadow-[0_0_8px_currentColor]"
				>
					{tool.name}
				</RiftHeading>
				<ManaFlowText
					variant="rift"
					className="warden-tool-description text-xs font-mono tracking-wider text-foreground/80 mb-6 uppercase leading-relaxed"
				>
					{tool.description}
				</ManaFlowText>
			</div>
			<div className="flex items-center justify-between mt-auto relative z-10">
				<Badge
					variant="secondary"
					className="font-mono text-[10px] tracking-widest uppercase bg-black/50 border-primary/20"
				>
					Available
				</Badge>
				<Button
					size="sm"
					className={cn(
						"font-heading tracking-widest uppercase gap-1",
						tool.color.includes("amber")
							? "bg-amber-500/20 text-amber-400 hover:bg-amber-500/40 border border-amber-500/50"
							: tool.color.includes("red")
								? "bg-red-500/20 text-red-400 hover:bg-red-500/40 border border-red-500/50"
								: "bg-primary/20 text-primary hover:bg-primary/40 border border-primary/50",
					)}
					asChild
				>
					<Link
						to={
							(tool as { path?: string; buttonText?: string }).path ||
							`/warden-directives/${tool.id}`
						}
					>
						{(tool as { path?: string; buttonText?: string }).buttonText ||
							"Launch"}
						<ChevronRight className="w-3 h-3" />
					</Link>
				</Button>
			</div>
		</div>
	);
};

export default WardenProtocols;
