import {
	Crown,
	Heart,
	Package,
	Plus,
	Settings,
	Shield,
	Skull,
	Trash2,
	Upload,
	User,
	Zap,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BulkActionsBar } from "@/components/character/BulkActionsBar";
import { ImportDialog } from "@/components/character/ImportDialog";
import { Layout } from "@/components/layout/Layout";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import {
	DataStreamText,
	SystemHeading,
	SystemText,
} from "@/components/ui/SystemText";
import { SystemWindow } from "@/components/ui/SystemWindow";
import { useToast } from "@/hooks/use-toast";
import { useCharacters, useDeleteCharacter } from "@/hooks/useCharacters";
import { cn } from "@/lib/utils";
import { formatRegentVernacular } from "@/lib/vernacular";

const Characters = () => {
	const navigate = useNavigate();
	const { toast } = useToast();
	const { data: characters = [], isLoading } = useCharacters();
	const isGuestMode = useMemo(
		() => characters.some((c) => c.user_id === "guest"),
		[characters],
	);
	const deleteCharacter = useDeleteCharacter();
	const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
	const [importDialogOpen, setImportDialogOpen] = useState(false);

	const handleDelete = async () => {
		if (!deleteTarget) return;

		try {
			await deleteCharacter.mutateAsync(deleteTarget);
			toast({
				title: "Ascendant removed",
				description: "The Ascendant has been removed from your roster.",
			});
			setDeleteTarget(null);
		} catch {
			toast({
				title: "Failed to remove",
				description: "Could not remove the Ascendant.",
				variant: "destructive",
			});
		}
	};

	// Get ascendant rank based on level
	const getHunterRank = (level: number) => {
		if (level >= 17)
			return {
				rank: "S",
				color: "text-amber-400",
				bg: "bg-amber-500/20",
				border: "border-amber-500/50",
				glow: "shadow-amber-500/30",
			};
		if (level >= 13)
			return {
				rank: "A",
				color: "text-red-400",
				bg: "bg-red-500/20",
				border: "border-red-500/50",
				glow: "shadow-red-500/30",
			};
		if (level >= 9)
			return {
				rank: "B",
				color: "text-orange-400",
				bg: "bg-orange-500/20",
				border: "border-orange-500/50",
				glow: "shadow-orange-500/30",
			};
		if (level >= 5)
			return {
				rank: "C",
				color: "text-blue-400",
				bg: "bg-blue-500/20",
				border: "border-blue-500/50",
				glow: "shadow-blue-500/30",
			};
		return {
			rank: "D",
			color: "text-green-400",
			bg: "bg-green-500/20",
			border: "border-green-500/50",
			glow: "shadow-green-500/30",
		};
	};

	return (
		<Layout>
			<div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
					<div className="min-w-0 flex-1">
						<SystemHeading
							level={1}
							variant="sovereign"
							dimensional
							className="leading-tight"
						>
							Ascendant Roster
						</SystemHeading>
						<DataStreamText
							variant="system"
							speed="slow"
							className="text-sm sm:text-base mt-1"
						>
							Manage your awakened Ascendants and prepare them for the System's
							challenges.
						</DataStreamText>
					</div>
					<div className="flex gap-2">
						<Link to="/party-stash">
							<Button
								variant="outline"
								className="gap-2 font-heading min-h-[44px] border-amber-500/30 hover:border-amber-500/60 hover:bg-amber-500/5 text-amber-400"
							>
								<Package className="w-4 h-4" />
								<span className="hidden sm:inline">Party Stash</span>
							</Button>
						</Link>
						<Button
							onClick={() => setImportDialogOpen(true)}
							className="gap-2 font-heading min-h-[44px]"
							variant="outline"
						>
							<Upload className="w-4 h-4" />
							<span className="hidden sm:inline">Import</span>
							<span className="sm:hidden">Import</span>
						</Button>
						<Link to="/characters/new">
							<Button className="gap-2 font-heading bg-gradient-to-r from-resurge to-shadow-purple min-h-[44px]">
								<Plus className="w-4 h-4" />
								<span className="hidden sm:inline">Awaken Ascendant</span>
								<span className="sm:hidden">Create</span>
							</Button>
						</Link>
					</div>
				</div>

				{selectedIds.size > 0 && (
					<BulkActionsBar
						selectedIds={selectedIds}
						onClearSelection={() => setSelectedIds(new Set())}
					/>
				)}

				<ImportDialog
					open={importDialogOpen}
					onOpenChange={setImportDialogOpen}
					onImportSuccess={(id) => navigate(`/characters/${id}`)}
				/>

				{isGuestMode && (
					<SystemWindow title="GUEST MODE" variant="alert" className="mb-6">
						<SystemText className="block text-sm text-muted-foreground">
							You are playing in guest mode. Ascendants are stored locally on
							this device only. Sign in to sync across devices and enable all
							online features.
						</SystemText>
					</SystemWindow>
				)}

				{isLoading ? (
					<div className="flex flex-col items-center justify-center py-12 gap-4">
						<div className="relative">
							<div className="w-16 h-16 border-4 border-resurge/20 rounded-full" />
							<div className="absolute inset-0 w-16 h-16 border-4 border-t-resurge rounded-full animate-spin" />
						</div>
						<SystemText className="block text-muted-foreground font-heading animate-pulse">
							Scanning Ascendant Database...
						</SystemText>
					</div>
				) : characters.length === 0 ? (
					<SystemWindow
						title="NO ASCENDANTS DETECTED"
						variant="alert"
						className="max-w-lg mx-auto text-center py-12"
					>
						<div className="mb-6">
							<Skull className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-50" />
							<SystemText className="block text-muted-foreground">
								No awakened Ascendants in the System registry. Begin your
								journey in the The Absolute's domain.
							</SystemText>
						</div>
						<Link to="/characters/new">
							<Button className="gap-2 font-heading bg-gradient-to-r from-resurge to-shadow-purple">
								<Zap className="w-4 h-4" />
								Awaken Your First Ascendant
							</Button>
						</Link>
					</SystemWindow>
				) : (
					<>
						{/* Character Grid */}
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{characters.map((character) => {
								const rankInfo = getHunterRank(character.level);
								const hpPercent =
									(character.hp_current / character.hp_max) * 100;

								const isSelected = selectedIds.has(character.id);

								return (
									<div
										key={character.id}
										className={cn(
											"rounded-[2px] border-l-4 border-y border-r bg-black/60 transition-all duration-300 group relative p-6 backdrop-blur-md overflow-hidden",
											"hover:shadow-[0_0_20px_rgba(0,0,0,0.8),inset_0_0_15px_currentColor] focus:outline-none focus:ring-1 focus:ring-primary focus:ring-offset-1",
											isSelected &&
												"ring-2 ring-primary ring-offset-2 shadow-[0_0_20px_rgba(0,0,0,0.8),inset_0_0_20px_hsl(var(--primary)/0.3)]",
											rankInfo.border,
										)}
									>
										{/* Selection Checkbox */}
										<div className="absolute top-3 left-3 z-10">
											<Checkbox
												checked={isSelected}
												onCheckedChange={(checked) => {
													const newSet = new Set(selectedIds);
													if (checked) {
														newSet.add(character.id);
													} else {
														newSet.delete(character.id);
													}
													setSelectedIds(newSet);
												}}
												onClick={(e) => e.stopPropagation()}
											/>
										</div>
										{/* Rank badge */}
										<div
											className={cn(
												"absolute top-3 right-3 w-10 h-10 rounded-[2px] flex items-center justify-center font-system font-bold text-lg",
												rankInfo.bg,
												rankInfo.color,
												"ring-1 ring-offset-1 ring-offset-background shadow-[0_0_10px_currentColor]",
												rankInfo.border,
											)}
										>
											{rankInfo.rank}
										</div>

										{/* Background glow effect */}
										<div
											className={cn(
												"absolute -bottom-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500",
												rankInfo.bg,
											)}
										/>

										<div className="flex items-start justify-between mb-4">
											<div
												className={cn(
													"w-14 h-14 rounded-xl flex items-center justify-center relative",
													"bg-gradient-to-br from-resurge/20 to-shadow-purple/20",
													"border border-resurge/30",
												)}
											>
												{character.portrait_url ? (
													<OptimizedImage
														src={character.portrait_url}
														alt={character.name}
														className="w-full h-full object-cover rounded-xl"
														size="thumbnail"
													/>
												) : (
													<User className="w-7 h-7 text-resurge" />
												)}
												{/* Level indicator */}
												<div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-background border border-resurge/50 flex items-center justify-center">
													<span className="text-xs font-resurge font-bold text-resurge">
														{character.level}
													</span>
												</div>
											</div>
											<div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
												<Button
													variant="ghost"
													size="icon"
													className="hover:bg-resurge/20 hover:text-resurge"
													onClick={(e) => {
														e.preventDefault();
														navigate(`/characters/${character.id}`);
													}}
													aria-label={`Edit ${character.name}`}
												>
													<Settings className="w-4 h-4" />
												</Button>
												<Button
													variant="ghost"
													size="icon"
													onClick={(e) => {
														e.preventDefault();
														setDeleteTarget(character.id);
													}}
													className="text-destructive hover:text-destructive hover:bg-destructive/20"
													aria-label={`Delete ${character.name}`}
												>
													<Trash2 className="w-4 h-4" />
												</Button>
											</div>
										</div>

										<Link
											to={`/characters/${character.id}`}
											data-testid="character-card"
											className="block"
										>
											<h3 className="font-system text-xl font-bold uppercase tracking-widest mb-1 group-hover:text-resurge transition-colors drop-shadow-[0_0_8px_currentColor]">
												{character.name}
											</h3>
											<SystemText className="block text-xs font-mono tracking-wider text-muted-foreground mb-4 uppercase">
												{formatRegentVernacular(character.job || "Unawakened")}
												{character.path &&
													` - ${formatRegentVernacular(character.path)}`}
											</SystemText>

											{/* HP Bar */}
											<div className="mb-4">
												<div className="flex justify-between items-center mb-1">
													<span className="text-xs text-muted-foreground flex items-center gap-1 font-mono uppercase tracking-widest">
														<Heart className="w-3 h-3" /> HP
													</span>
													<span
														className={cn(
															"text-[10px] font-system font-bold tracking-widest",
															hpPercent < 25
																? "text-destructive"
																: hpPercent < 50
																	? "text-orange-400"
																	: "text-green-400",
														)}
													>
														{character.hp_current}/{character.hp_max}
													</span>
												</div>
												<div className="h-2 rounded-[2px] bg-black border border-primary/30 overflow-hidden relative shadow-[inset_0_0_8px_rgba(0,0,0,0.8)]">
													<div
														className={cn(
															"h-full transition-all duration-300 relative",
															hpPercent < 25
																? "bg-destructive"
																: hpPercent < 50
																	? "bg-orange-500"
																	: "bg-green-500",
														)}
														ref={(el) => {
															if (el) el.style.width = `${hpPercent}%`;
														}}
													>
														<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-white/10 animate-[shimmer_2s_infinite]" />
													</div>
												</div>
											</div>

											{/* Quick Stats */}
											<div className="grid grid-cols-3 gap-2">
												<div className="text-center p-2 rounded-[2px] bg-black/40 border border-primary/20 shadow-[inset_0_0_8px_rgba(0,0,0,0.5)] group/stat">
													<Shield className="w-3 h-3 mx-auto mb-1 text-blue-400 opacity-80 group-hover/stat:text-blue-300 transition-colors" />
													<span className="font-system font-bold text-lg text-white drop-shadow-[0_0_5px_currentColor]">
														{character.armor_class}
													</span>
													<span className="text-[10px] font-mono tracking-widest text-muted-foreground block uppercase mt-1">
														AC
													</span>
												</div>
												<div className="text-center p-2 rounded-[2px] bg-black/40 border border-primary/20 shadow-[inset_0_0_8px_rgba(0,0,0,0.5)] group/stat">
													<Zap className="w-3 h-3 mx-auto mb-1 text-yellow-400 opacity-80 group-hover/stat:text-yellow-300 transition-colors" />
													<span className="font-system font-bold text-lg text-white drop-shadow-[0_0_5px_currentColor]">
														+{character.initiative}
													</span>
													<span className="text-[10px] font-mono tracking-widest text-muted-foreground block uppercase mt-1">
														INIT
													</span>
												</div>
												<div className="text-center p-2 rounded-[2px] bg-black/40 border border-primary/20 shadow-[inset_0_0_8px_rgba(0,0,0,0.5)] group/stat">
													<Crown className="w-3 h-3 mx-auto mb-1 text-resurge opacity-80 group-hover/stat:text-resurge-light transition-colors" />
													<span className="font-system font-bold text-lg text-white drop-shadow-[0_0_5px_currentColor]">
														{character.proficiency_bonus}
													</span>
													<span className="text-[10px] font-mono tracking-widest text-muted-foreground block uppercase mt-1">
														PROF
													</span>
												</div>
											</div>
										</Link>
									</div>
								);
							})}

							{/* New Character Card */}
							<Link
								to="/characters/new"
								data-testid="create-character"
								className={cn(
									"rounded-[2px] border-dashed border-2 border-resurge/50 bg-black/40 shadow-[inset_0_0_20px_hsl(var(--resurge)/0.1)] p-6",
									"hover:border-resurge hover:bg-resurge/10 hover:shadow-[0_0_30px_hsl(var(--resurge)/0.2),inset_0_0_20px_hsl(var(--resurge)/0.2)] transition-all duration-300",
									"flex flex-col items-center justify-center min-h-[280px] group relative overflow-hidden backdrop-blur-md",
								)}
							>
								<div className="absolute inset-0 bg-gradient-to-b from-transparent to-resurge/5 pointer-events-none" />
								<div
									className={cn(
										"w-16 h-16 rounded-[2px] border-2 border-dashed border-resurge/40 bg-black/60",
										"flex items-center justify-center mb-4 relative",
										"group-hover:border-resurge group-hover:bg-resurge/20 group-hover:shadow-[0_0_15px_hsl(var(--resurge)/0.5)] transition-all duration-300",
									)}
								>
									<Plus className="w-8 h-8 text-resurge/60 group-hover:text-resurge transition-colors" />
								</div>
								<p className="font-system font-bold text-lg text-resurge/70 tracking-widest uppercase group-hover:text-resurge group-hover:drop-shadow-[0_0_8px_currentColor] transition-all">
									AWAKEN ASCENDANT
								</p>
								<p className="text-xs font-mono tracking-widest text-resurge/40 mt-2 uppercase">
									Begin your journey
								</p>
							</Link>
						</div>

						{/* Character Builder Preview */}
						<div className="mt-12">
							<SystemHeading level={2} variant="gate" className="mb-4">
								Awakening Protocol
							</SystemHeading>
							<SystemWindow title="STEP-BY-STEP CREATION" variant="quest">
								<div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
									{[
										"Concept",
										"Abilities",
										"Job",
										"Path",
										"Background",
										"Equipment",
										"Powers",
									].map((step, i) => (
										<div key={step} className="text-center group">
											<div
												className={cn(
													"w-10 h-10 mx-auto rounded-full flex items-center justify-center font-resurge text-sm mb-2",
													"bg-gradient-to-br from-resurge/20 to-shadow-purple/20 border border-resurge/30",
													"group-hover:from-resurge/30 group-hover:to-shadow-purple/30 transition-all",
												)}
											>
												{i + 1}
											</div>
											<span className="text-xs font-heading text-muted-foreground group-hover:text-resurge transition-colors">
												{step}
											</span>
										</div>
									))}
								</div>
								<SystemText className="block text-sm text-muted-foreground mt-6">
									The System guides you through each awakening step, validating
									your choices against the The Absolute's laws.
								</SystemText>
								<Link to="/characters/new" className="inline-block mt-4">
									<Button className="gap-2 font-heading bg-gradient-to-r from-resurge to-shadow-purple">
										<Zap className="w-4 h-4" />
										Begin Awakening
									</Button>
								</Link>
							</SystemWindow>
						</div>
					</>
				)}

				{/* Bulk Actions Bar */}
				{selectedIds.size > 0 && (
					<BulkActionsBar
						selectedIds={selectedIds}
						onClearSelection={() => setSelectedIds(new Set())}
					/>
				)}

				{/* Delete Confirmation Dialog */}
				<AlertDialog
					open={!!deleteTarget}
					onOpenChange={(open) => !open && setDeleteTarget(null)}
				>
					<AlertDialogContent className="border-destructive/50">
						<AlertDialogHeader>
							<AlertDialogTitle className="font-resurge text-destructive flex items-center gap-2">
								<Skull className="w-5 h-5" />
								DELETE ASCENDANT?
							</AlertDialogTitle>
							<AlertDialogDescription>
								This action cannot be undone. This Ascendant will be permanently
								removed from the System registry.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel className="font-heading">
								Cancel
							</AlertDialogCancel>
							<AlertDialogAction
								onClick={handleDelete}
								className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-heading"
							>
								Confirm Deletion
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</div>
		</Layout>
	);
};

export default Characters;
