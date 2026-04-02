import { useState } from "react";
import { useParams } from "react-router-dom";
import { SourceBookCallout } from "@/components/compendium/SourceBookCallout";
import { SourceBookLayout } from "@/components/compendium/SourceBookLayout";
import { SourceBookPage } from "@/components/compendium/SourceBookPage";
import { SourceBookStatBlock } from "@/components/compendium/SourceBookStatBlock";
import { Button } from "@/components/ui/button";
import { allBackgrounds as dataBackgrounds } from "@/data/compendium/backgrounds-index";
import { conditions as dataConditions } from "@/data/compendium/conditions";
import { comprehensiveFeats as dataFeats } from "@/data/compendium/feats-comprehensive";
import { allItems as dataItems } from "@/data/compendium/items-index";
import { jobs as dataJobs } from "@/data/compendium/jobs";
import { locations as dataLocations } from "@/data/compendium/locations";
import { monsters as dataMonsters } from "@/data/compendium/monsters";
import { regents as dataRegents } from "@/data/compendium/regents";
import { comprehensiveRelics as dataRelics } from "@/data/compendium/relics-comprehensive";
import { allRunes as dataRunes } from "@/data/compendium/runes/index";
import { sigils as dataSigils } from "@/data/compendium/sigils";
import { comprehensiveSkills as dataSkills } from "@/data/compendium/skills-comprehensive";
import { spells as dataSpells } from "@/data/compendium/spells";
import { tattoos as dataTattoos } from "@/data/compendium/tattoos";
import { techniques as dataTechniques } from "@/data/compendium/techniques";
import type {
	CompendiumBackground,
	CompendiumCondition,
	CompendiumFeat,
	CompendiumItem,
	CompendiumJob,
	CompendiumLocation,
	CompendiumMonster,
	CompendiumRegent,
	CompendiumRelic,
	CompendiumRune,
	CompendiumSkill,
	CompendiumSpell,
	CompendiumTattoo,
	CompendiumTechnique,
} from "@/types/compendium";

// Typed constants for use in the component
const spells: CompendiumSpell[] = dataSpells;
const techniques: CompendiumTechnique[] = dataTechniques;
const runes: CompendiumRune[] = dataRunes;
const sigils: CompendiumRune[] = dataSigils;
const monsters: CompendiumMonster[] = dataMonsters;
const locations: CompendiumLocation[] = dataLocations;
const regents: CompendiumRegent[] = dataRegents;
const relics: CompendiumRelic[] = dataRelics;
const feats: CompendiumFeat[] = dataFeats;
const items: CompendiumItem[] = dataItems;
const backgrounds: CompendiumBackground[] = dataBackgrounds;
const jobs: CompendiumJob[] = dataJobs;
const conditions: CompendiumCondition[] = dataConditions;
const skills: CompendiumSkill[] = dataSkills;
const tattoos: CompendiumTattoo[] = dataTattoos;

const renderLore = (
	content: string | Record<string, unknown> | null | undefined,
): React.ReactNode => {
	if (!content) return null;
	if (typeof content === "string") return content;
	return (
		<div className="space-y-1">
			{Object.entries(content).map(([key, value]) => (
				<div key={key}>
					<span className="font-semibold uppercase text-[10px] text-cyan">
						{key.replace(/_/g, " ")}:
					</span>{" "}
					<span className="text-sm">{String(value)}</span>
				</div>
			))}
		</div>
	);
};

const SourceBook: React.FC = () => {
	const { section = "intro" } = useParams<{ section: string }>();
	const [currentPage, setCurrentPage] = useState(1);
	const [prevSection, setPrevSection] = useState(section);
	const itemsPerPage = 60;

	if (section !== prevSection) {
		setPrevSection(section);
		setCurrentPage(1);
	}

	const renderPagination = (totalItems: number) => {
		if (totalItems <= itemsPerPage) return null;
		const totalPages = Math.ceil(totalItems / itemsPerPage);
		return (
			<div className="flex justify-between items-center mt-12 mb-8 pt-8 border-t border-cyan/20">
				<Button
					variant="outline"
					disabled={currentPage <= 1}
					onClick={() => {
						setCurrentPage((p) => Math.max(1, p - 1));
						window.scrollTo({ top: 0, behavior: "smooth" });
					}}
				>
					Previous Page
				</Button>
				<span className="text-cyan font-mono text-sm">
					PAGE {currentPage} OF {totalPages}
				</span>
				<Button
					variant="outline"
					disabled={currentPage >= totalPages}
					onClick={() => {
						setCurrentPage((p) => Math.min(totalPages, p + 1));
						window.scrollTo({ top: 0, behavior: "smooth" });
					}}
				>
					Next Page
				</Button>
			</div>
		);
	};

	const renderSection = () => {
		switch (section) {
			case "intro":
				return (
					<SourceBookPage
						title="System Initialization"
						subtitle="Protocol Alpha-01"
						showDropCap
					>
						Welcome to the System Ascendant Digital Source Book. This
						holographic archive contains the complete protocols, biological
						data, and arcane signatures required to navigate the Void. Within
						these encrypted pages, you will find the keys to survival in a world
						of neon and shadow.
						<p className="mt-4">
							The following sections detail the core mechanics of the System,
							the biographies of the Great Regents, and the threat profiles of
							the entities that inhabit the rifts.
						</p>
						<SourceBookCallout title="SYSTEM ALERT">
							Ensure your internal mana-regulator is properly calibrated before
							attempting to access high-level spell protocols. Unauthorized
							access may result in dimensional destabilization.
						</SourceBookCallout>
					</SourceBookPage>
				);

			case "regents":
				return (
					<div className="space-y-12">
						<SourceBookPage
							title="The Great Regents"
							subtitle="Sovereigns of the Void"
						>
							The Regents are the ultimate authorities within the System. Each
							governs a domain of the Void, wielding powers that transcend
							mortal comprehension.
						</SourceBookPage>

						<div className="grid grid-cols-1 gap-12">
							{regents.map((regent) => (
								<SourceBookPage
									key={regent.id}
									title={regent.name}
									subtitle={regent.title}
								>
									<p className="mb-4">{regent.description}</p>

									{regent.flavor && (
										<div className="text-sm italic text-cyan/70 mb-4 border-l-2 border-cyan/30 pl-3 py-1 bg-cyan/5">
											{renderLore(regent.flavor)}
										</div>
									)}

									{regent.lore && (
										<div className="mb-6 space-y-2">
											<h4 className="text-amethyst font-bold text-[10px] uppercase tracking-wider">
												Historical Record
											</h4>
											<div className="text-sm text-muted-foreground leading-relaxed">
												{renderLore(regent.lore)}
											</div>
										</div>
									)}

									<SourceBookCallout title="REGENT OVERLAY PROTOCOLS">
										<div className="space-y-4">
											<div>
												<h4 className="text-cyan font-bold uppercase text-xs">
													Requirements
												</h4>
												<p className="text-sm">
													Power Level:{" "}
													{regent.regent_requirements?.level || "N/A"}
												</p>
												<p className="text-sm">
													Quest:{" "}
													{regent.regent_requirements?.quest_completion ||
														"Access Restricted"}
												</p>
											</div>

											<div>
												<h4 className="text-amethyst font-bold uppercase text-xs">
													Core Features
												</h4>
												<ul className="list-disc list-inside text-sm space-y-1">
													{(regent.class_features || regent.features)
														?.slice(0, 5)
														.map((feature) => (
															<li key={feature.name}>
																<span className="text-cyan">
																	{feature.name}:
																</span>{" "}
																{feature.description.substring(0, 100)}...
															</li>
														))}
												</ul>
											</div>
										</div>
									</SourceBookCallout>
								</SourceBookPage>
							))}
						</div>
					</div>
				);

			case "jobs":
				return (
					<div className="space-y-12">
						<SourceBookPage
							title="Job Protocols"
							subtitle="Operational Specializations"
						>
							Jobs define your function within the System. From the spectral
							blades of the Reaper to the dimensional manipulation of the Rift
							Walker, each Job offers a unique path to ascension.
						</SourceBookPage>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
							{jobs.map((job) => (
								<div
									key={job.id}
									className="p-6 border border-cyan/20 bg-black/40 rounded-lg hover:border-cyan/50 transition-colors"
								>
									<div className="flex justify-between items-start mb-4">
										<h3 className="text-xl font-bold text-cyan">{job.name}</h3>
										<span className="text-[10px] px-2 py-0.5 border border-amethyst/50 text-amethyst uppercase tracking-widest">
											Rank {job.rank}
										</span>
									</div>
									<p className="text-sm text-muted-foreground mb-4 line-clamp-3">
										{job.description}
									</p>

									<SourceBookCallout
										title="JOB CORE DATA"
										type="sidebar"
										systemInteraction={
											job.system_interaction ||
											JSON.stringify(
												job.primary_abilities || job.primaryAbility,
											)
										}
									>
										<p className="text-xs mb-1">
											<span className="text-cyan">HIT DIE:</span>{" "}
											{job.hit_dice || job.hitDie}
										</p>
										{job.flavor && (
											<div className="text-[10px] italic text-cyan/60 mt-2 border-t border-cyan/10 pt-2">
												{renderLore(job.flavor)}
											</div>
										)}
										{job.lore && (
											<div className="text-[10px] text-muted-foreground mt-1">
												{renderLore(job.lore)}
											</div>
										)}
									</SourceBookCallout>
								</div>
							))}
						</div>
					</div>
				);

			case "spells":
				return (
					<div className="space-y-12">
						<SourceBookPage
							title="Mana Protocols"
							subtitle="Dimensional Disruptions"
						>
							Spells are active exploitations of System vulnerabilities. They
							require precise calculation and significant mana expenditure.
						</SourceBookPage>

						<div className="grid grid-cols-1 gap-12">
							{spells
								.slice(
									(currentPage - 1) * itemsPerPage,
									currentPage * itemsPerPage,
								)
								.map((spell) => (
									<SourceBookPage
										key={spell.id}
										title={spell.name}
										subtitle={`Rank ${spell.rank || "Unknown"}`}
									>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
											<div className="space-y-4">
												<p className="text-sm leading-relaxed">
													{spell.description}
												</p>
												{spell.flavor && (
													<div className="text-xs italic text-cyan/70 border-l border-cyan/30 pl-3">
														{renderLore(spell.flavor)}
													</div>
												)}
											</div>

											<SourceBookCallout
												title="SPELL METRICS"
												systemInteraction={spell.system_interaction}
											>
												<div className="grid grid-cols-2 gap-2 text-[10px]">
													<div>
														<span className="text-cyan font-bold uppercase">
															Cast Time:
														</span>{" "}
														{spell.castingTime}
													</div>
													<div>
														<span className="text-cyan font-bold uppercase">
															Range:
														</span>{" "}
														{typeof spell.range === "string"
															? spell.range
															: spell.range?.value
																? `${spell.range.value} ${spell.range.unit}`
																: spell.range?.type || "Self"}
													</div>
													<div>
														<span className="text-cyan font-bold uppercase">
															Duration:
														</span>{" "}
														{typeof spell.duration === "string"
															? spell.duration
															: spell.duration?.value
																? `${spell.duration.value} ${spell.duration.unit}`
																: spell.duration?.type || "Instant"}
													</div>
													<div>
														<span className="text-cyan font-bold uppercase">
															Mana:
														</span>{" "}
														{(spell.limitations as { mana_cost?: number })
															?.mana_cost || "Standard"}
													</div>
												</div>
											</SourceBookCallout>
										</div>

										{spell.lore && (
											<div className="mt-4 p-4 bg-muted/20 border border-muted/30 rounded">
												<h4 className="text-[10px] font-bold text-amethyst uppercase mb-2">
													Historical Signature
												</h4>
												<div className="text-xs text-muted-foreground leading-relaxed">
													{renderLore(spell.lore)}
												</div>
											</div>
										)}
									</SourceBookPage>
								))}
						</div>
						{renderPagination(spells.length)}
					</div>
				);

			case "items":
				return (
					<div className="space-y-12">
						<SourceBookPage title="Gear & Tech" subtitle="Tools of the Trade">
							Hardware and consumables designed to integrate with System
							protocols. From cybernetic enhancements to specialized med-kits.
						</SourceBookPage>

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{items
								.slice(
									(currentPage - 1) * itemsPerPage,
									currentPage * itemsPerPage,
								)
								.map((item) => (
									<div
										key={item.id}
										className="p-4 border border-muted/30 bg-muted/10 rounded-lg hover:border-cyan/30 transition-colors"
									>
										<div className="flex justify-between items-center mb-2">
											<h4 className="font-bold text-cyan">{item.name}</h4>
											<span className="text-[9px] text-muted-foreground uppercase">
												{item.type}
											</span>
										</div>
										<p className="text-xs text-muted-foreground mb-4 line-clamp-2">
											{item.description}
										</p>

										<SourceBookCallout
											title="HARDWARE SPECS"
											type="sidebar"
											systemInteraction={item.system_interaction}
										>
											<div className="text-[10px] space-y-1">
												<div>
													<span className="text-cyan">RARITY:</span>{" "}
													{item.rarity}
												</div>
												{item.flavor && (
													<div className="text-[9px] italic text-cyan/60 mt-1 border-t border-cyan/10 pt-1">
														{renderLore(item.flavor)}
													</div>
												)}
												{item.lore && (
													<div className="text-[9px] text-muted-foreground mt-1">
														{renderLore(item.lore)}
													</div>
												)}
											</div>
										</SourceBookCallout>
									</div>
								))}
						</div>
						{renderPagination(items.length)}
					</div>
				);

			case "relics":
				return (
					<div className="space-y-12">
						<SourceBookPage
							title="Relics of the Old World"
							subtitle="Ancient Protocols"
						>
							Artifacts that pre-date the System or were forged in its highest
							tiers. These items possess consciousness and scaling power.
						</SourceBookPage>

						<div className="grid grid-cols-1 gap-12">
							{relics
								.slice(
									(currentPage - 1) * itemsPerPage,
									currentPage * itemsPerPage,
								)
								.map((relic) => (
									<SourceBookPage
										key={relic.id}
										title={relic.name}
										subtitle={relic.type}
									>
										<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
											<div className="lg:col-span-2 space-y-6">
												<p className="text-sm leading-relaxed">
													{relic.description}
												</p>

												{relic.flavor && (
													<div className="p-4 bg-cyan/5 border-l-2 border-cyan/40 italic text-cyan/80 text-sm">
														{renderLore(relic.flavor)}
													</div>
												)}

												{relic.lore && (
													<div className="space-y-2">
														<h4 className="text-[10px] font-bold text-amethyst uppercase">
															Ancient Lineage
														</h4>
														<div className="text-sm text-muted-foreground leading-relaxed">
															{renderLore(relic.lore)}
														</div>
													</div>
												)}
											</div>

											<div className="space-y-6">
												<SourceBookCallout
													title="RELIC PROPERTIES"
													systemInteraction={relic.system_interaction}
												>
													<ul className="text-xs space-y-1">
														{relic.properties &&
														Array.isArray(relic.properties) ? (
															relic.properties.map((p) => (
																<li key={p} className="text-cyan">
																	• {p}
																</li>
															))
														) : relic.properties ? (
															Object.entries(
																relic.properties as Record<string, boolean>,
															).map(([k, v]) =>
																v ? (
																	<li key={k} className="text-cyan">
																		• {k.replace(/_/g, " ")}
																	</li>
																) : null,
															)
														) : (
															<li className="text-muted-foreground">
																Standard
															</li>
														)}
													</ul>
												</SourceBookCallout>

												<div className="p-4 border border-amethyst/30 bg-amethyst/5 rounded-lg">
													<h4 className="text-[10px] font-bold text-amethyst uppercase mb-3">
														Abilities
													</h4>
													<div className="space-y-3">
														{relic.abilities?.map((ability) => (
															<div key={ability.name}>
																<div className="text-xs font-bold text-cyan">
																	{ability.name}
																</div>
																<div className="text-[10px] text-muted-foreground">
																	{ability.description}
																</div>
															</div>
														))}
													</div>
												</div>
											</div>
										</div>
									</SourceBookPage>
								))}
						</div>
					</div>
				);

			case "feats":
				return (
					<div className="space-y-12">
						<SourceBookPage
							title="Evolutionary Feats"
							subtitle="System Optimization"
						>
							Permanent modifications to your core architecture. Feats represent
							significant breakthroughs in your understanding of the System.
						</SourceBookPage>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
							{feats
								.slice(
									(currentPage - 1) * itemsPerPage,
									currentPage * itemsPerPage,
								)
								.map((feat) => (
									<div
										key={feat.id}
										className="p-6 border border-muted/30 bg-muted/5 rounded-lg flex flex-col"
									>
										<h3 className="text-lg font-bold text-cyan mb-2">
											{feat.name}
										</h3>
										<p className="text-sm text-muted-foreground mb-4 flex-grow">
											{feat.description}
										</p>

										<SourceBookCallout
											title="PARAMETRIC BENEFITS"
											type="sidebar"
											systemInteraction={
												feat.system_interaction ||
												JSON.stringify(feat.mechanics)
											}
										>
											<ul className="text-[10px] space-y-1">
												{Array.isArray(feat.benefits)
													? feat.benefits.map((benefit: string) => (
															<li key={benefit} className="text-cyan">
																• {benefit}
															</li>
														))
													: Object.entries(feat.benefits || {}).map(
															([k, v]) => (
																<li key={k} className="text-cyan">
																	• {k}:{" "}
																	{Array.isArray(v) ? v.join(", ") : String(v)}
																</li>
															),
														)}
											</ul>
											{feat.lore && (
												<div className="mt-3 text-[9px] text-muted-foreground border-t border-muted/20 pt-2">
													{renderLore(feat.lore)}
												</div>
											)}
										</SourceBookCallout>
									</div>
								))}
						</div>
					</div>
				);

			case "backgrounds":
				return (
					<div className="space-y-12">
						<SourceBookPage
							title="Origin Protocols"
							subtitle="Pre-Ascension Bio-Data"
						>
							Your history before the System initialization. Backgrounds provide
							the foundation for your skills and social integration.
						</SourceBookPage>

						<div className="grid grid-cols-1 gap-12">
							{backgrounds
								.slice(
									(currentPage - 1) * itemsPerPage,
									currentPage * itemsPerPage,
								)
								.map((bg) => (
									<SourceBookPage
										key={bg.id}
										title={bg.name}
										subtitle={bg.type}
									>
										<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
											<div className="md:col-span-2 space-y-4">
												<p className="text-sm">{bg.description}</p>
												{bg.flavor && (
													<div className="text-sm italic text-cyan/70 bg-cyan/5 p-3 border-l border-cyan/30">
														{renderLore(bg.flavor)}
													</div>
												)}
												{bg.lore && (
													<div className="space-y-1">
														<h4 className="text-[10px] font-bold text-amethyst uppercase">
															Deep Archive
														</h4>
														<div className="text-sm text-muted-foreground">
															{renderLore(bg.lore)}
														</div>
													</div>
												)}
											</div>

											<SourceBookCallout
												title="SKILL PROFICIENCIES"
												systemInteraction={bg.system_interaction}
											>
												<div className="space-y-4">
													<div>
														<h5 className="text-[10px] font-bold text-cyan uppercase mb-1">
															Skills
														</h5>
														<div className="flex flex-wrap gap-2">
															{bg.skill_proficiencies?.map((skill) => (
																<span
																	key={skill}
																	className="text-[9px] bg-cyan/10 text-cyan px-2 py-0.5 rounded border border-cyan/20"
																>
																	{skill}
																</span>
															))}
														</div>
													</div>
													<div>
														<h5 className="text-[10px] font-bold text-amethyst uppercase mb-1">
															Equipment
														</h5>
														<ul className="text-[10px] text-muted-foreground list-disc list-inside">
															{bg.equipment.map((item) => (
																<li key={item}>{item}</li>
															))}
														</ul>
													</div>
												</div>
											</SourceBookCallout>
										</div>
									</SourceBookPage>
								))}
						</div>
					</div>
				);

			case "monsters":
				return (
					<div className="space-y-12">
						<SourceBookPage
							title="Threat Profiles"
							subtitle="Biological & Synthetic Hostiles"
						>
							Entities that inhabit the rifts and the dark corners of the
							System. Do not engage without proper protocols.
						</SourceBookPage>

						<div className="grid grid-cols-1 gap-16">
							{monsters
								.slice(
									(currentPage - 1) * itemsPerPage,
									currentPage * itemsPerPage,
								)
								.map((monster) => (
									<div key={monster.id} className="space-y-6">
										<div className="flex flex-col md:flex-row justify-between items-end border-b border-cyan/30 pb-4">
											<div>
												<h2 className="text-3xl font-black text-cyan tracking-tighter uppercase italic">
													{monster.name}
												</h2>
												<p className="text-amethyst font-bold text-xs">
													{monster.type} / Rank {monster.rank} / CR{" "}
													{monster.stats?.challenge_rating}
												</p>
											</div>
											<div className="text-right text-[10px] text-muted-foreground uppercase tracking-widest">
												Threat Intelligence Source:{" "}
												{monster.source || "System Core"}
											</div>
										</div>

										<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
											<div className="lg:col-span-2 space-y-6">
												<p className="text-sm leading-relaxed text-muted-foreground">
													{monster.description}
												</p>

												{monster.flavor && (
													<div className="p-4 bg-muted/10 border-l border-muted/30 italic text-cyan/70 text-sm">
														{renderLore(monster.flavor)}
													</div>
												)}

												{monster.lore && (
													<div className="space-y-2">
														<h4 className="text-[10px] font-bold text-amethyst uppercase">
															Behavioral Analysis
														</h4>
														<div className="text-sm text-muted-foreground leading-relaxed italic">
															{renderLore(monster.lore)}
														</div>
													</div>
												)}

												<div className="space-y-6">
													<h3 className="sb-h2 border-b border-cyan/20 pb-2">
														Protocols & Tactics
													</h3>
													{monster.traits?.map((trait) => (
														<div key={trait.name} className="space-y-1">
															<div className="flex items-center gap-2">
																<span className="text-cyan font-bold uppercase text-xs">
																	{trait.name}
																</span>
															</div>
															<p className="text-sm text-muted-foreground">
																{trait.description}
															</p>
														</div>
													))}
												</div>

												<div className="space-y-6">
													<h3 className="sb-h2 border-b border-red-500/30 pb-2">
														Offensive Signatures
													</h3>
													{monster.actions?.map((action) => (
														<SourceBookCallout
															key={action.name}
															title={action.name}
															type="table"
															systemInteraction={
																monster.system_interaction ||
																JSON.stringify(action)
															}
														>
															<p className="text-sm">{action.description}</p>
															{action.hit && (
																<p className="text-xs text-cyan mt-2 font-bold font-mono">
																	HIT: {action.hit}
																</p>
															)}
														</SourceBookCallout>
													))}
												</div>
											</div>

											<div className="space-y-8">
												<SourceBookStatBlock monster={monster} />

												<SourceBookCallout title="SYSTEM VULNERABILITIES">
													<div className="text-[10px] space-y-3">
														<div>
															<p className="text-red-400 font-bold uppercase mb-1">
																Damage Resistances
															</p>
															<p className="text-muted-foreground">
																{monster.damage_resistances?.join(", ") ||
																	"None"}
															</p>
														</div>
														<div>
															<p className="text-red-500 font-bold uppercase mb-1">
																Damage Immunities
															</p>
															<p className="text-muted-foreground">
																{monster.damage_immunities?.join(", ") ||
																	"None"}
															</p>
														</div>
														<div>
															<p className="text-cyan font-bold uppercase mb-1">
																Senses
															</p>
															<p className="text-muted-foreground">
																{monster.senses || "Standard Sensory Array"}
															</p>
														</div>
													</div>
												</SourceBookCallout>
											</div>
										</div>
									</div>
								))}
						</div>
					</div>
				);

			case "techniques":
				return (
					<div className="space-y-12">
						<SourceBookPage
							title="Martial Overlays"
							subtitle="Kinetic Protocols"
						>
							Techniques are physical manipulations of the System. They leverage
							momentum, gravity, and bio-electric feedback.
						</SourceBookPage>

						<div className="grid grid-cols-1 gap-12">
							{techniques
								.slice(
									(currentPage - 1) * itemsPerPage,
									currentPage * itemsPerPage,
								)
								.map((tech) => (
									<SourceBookPage
										key={tech.id}
										title={tech.name}
										subtitle={`${tech.style || "Generic"} Style`}
									>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
											<div className="space-y-4">
												<p className="text-sm">{tech.description}</p>
												{tech.flavor && (
													<div className="text-xs italic text-cyan/70 bg-cyan/5 p-3 border-l border-cyan/30">
														{renderLore(tech.flavor)}
													</div>
												)}
												{tech.lore && (
													<div className="text-xs text-muted-foreground leading-relaxed">
														{renderLore(tech.lore)}
													</div>
												)}
											</div>

											<SourceBookCallout
												title="KINETIC DATA"
												systemInteraction={tech.system_interaction}
											>
												<div className="text-[10px] space-y-2">
													<div>
														<span className="text-cyan font-bold uppercase">
															Activation:
														</span>{" "}
														{tech.activation?.type || "Standard Action"}
														{tech.activation?.cost &&
															` (${tech.activation.cost})`}
													</div>
													<div>
														<span className="text-cyan font-bold uppercase">
															Range:
														</span>{" "}
														{typeof tech.range === "object"
															? tech.range.type
															: tech.range || "Melee"}
														{typeof tech.range === "object" &&
															tech.range.distance &&
															` (${tech.range.distance})`}
													</div>
													<div>
														<span className="text-cyan font-bold uppercase">
															Primary:
														</span>{" "}
														{tech.primary_effect}
													</div>
													<div className="mt-4 pt-2 border-t border-cyan/10">
														<div className="text-amethyst font-bold uppercase mb-1">
															Protocol Effects
														</div>
														<ul className="list-disc list-inside space-y-1">
															{tech.effects &&
																Object.entries(tech.effects).map(([k, v]) => (
																	<li key={k}>
																		<span className="text-cyan">{k}:</span>{" "}
																		{String(v)}
																	</li>
																))}
														</ul>
													</div>
												</div>
											</SourceBookCallout>
										</div>
									</SourceBookPage>
								))}
						</div>
					</div>
				);

			case "runes":
				return (
					<div className="space-y-12">
						<SourceBookPage
							title="Runic Overlays"
							subtitle="Signatures of Power"
						>
							Runes and Sigils are semi-permanent mana-constructs that can be
							inscribed onto gear or the soul itself. They provide consistent
							scaling bonuses and unique reactive protocols.
						</SourceBookPage>

						<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
							<section>
								<h2 className="sb-h2 mb-6">Primal Runes</h2>
								<div className="space-y-6">
									{runes.map((rune) => (
										<SourceBookCallout
											key={rune.id}
											title={rune.name}
											type="sidebar"
											systemInteraction={
												rune.system_interaction ||
												JSON.stringify(rune.mechanics)
											}
										>
											<p className="text-[10px] uppercase text-cyan mb-1">
												Rank {rune.rune_level} {rune.rune_type}
											</p>
											<p className="text-sm mb-2">{rune.description}</p>
											<p className="text-xs text-amethyst font-semibold">
												EFFECT: {rune.effect_description}
											</p>
											{rune.flavor && (
												<div className="text-[9px] italic text-cyan/60 mt-2">
													{renderLore(rune.flavor)}
												</div>
											)}
										</SourceBookCallout>
									))}
								</div>
							</section>

							<section>
								<h2 className="sb-h2 mb-6">Command Sigils</h2>
								<div className="space-y-6">
									{sigils.map((sigil) => (
										<SourceBookCallout
											key={sigil.id}
											title={sigil.name}
											type="sidebar"
											systemInteraction={
												sigil.system_interaction ||
												JSON.stringify(sigil.mechanics)
											}
										>
											<p className="text-[10px] uppercase text-cyan mb-1">
												Rank {sigil.rune_level} {sigil.rune_type}
											</p>
											<p className="text-sm mb-2">{sigil.description}</p>
											<p className="text-xs text-amethyst font-semibold">
												EFFECT: {sigil.effect_description}
											</p>
											{sigil.flavor && (
												<div className="text-[9px] italic text-cyan/60 mt-2">
													{renderLore(sigil.flavor)}
												</div>
											)}
										</SourceBookCallout>
									))}
								</div>
							</section>
						</div>
					</div>
				);

			case "locations":
				return (
					<div className="space-y-12">
						<SourceBookPage
							title="Sector Archives"
							subtitle="Dimensional Topography"
						>
							Geographical data on the sectors and rifts within the System. Some
							areas are heavily irradiated or dimensionaly unstable.
						</SourceBookPage>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-12">
							{locations.map((loc) => (
								<SourceBookPage
									key={loc.id}
									title={loc.name}
									subtitle={`Rank ${loc.rank}`}
								>
									<div className="space-y-4">
										<p className="text-sm leading-relaxed">{loc.description}</p>

										{loc.flavor && (
											<div className="p-4 bg-cyan/5 border-l-2 border-cyan/40 italic text-cyan/80 text-sm">
												{renderLore(loc.flavor)}
											</div>
										)}

										<SourceBookCallout
											title="SECTOR ENTITIES"
											systemInteraction={loc.system_interaction}
										>
											<div className="space-y-4 text-[10px]">
												<div>
													<span className="text-cyan font-bold uppercase block mb-1">
														Hostiles Detected
													</span>
													<div className="flex flex-wrap gap-2">
														{loc.encounters.map((e: string) => (
															<span
																key={e}
																className="bg-red-900/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded"
															>
																{e}
															</span>
														))}
													</div>
												</div>
												<div>
													<span className="text-amethyst font-bold uppercase block mb-1">
														Treasure Signals
													</span>
													<div className="flex flex-wrap gap-2">
														{loc.treasures.map((t: string) => (
															<span
																key={t}
																className="bg-cyan/10 text-cyan border border-cyan/30 px-2 py-0.5 rounded"
															>
																{t}
															</span>
														))}
													</div>
												</div>
											</div>
										</SourceBookCallout>
									</div>
								</SourceBookPage>
							))}
						</div>
					</div>
				);

			case "conditions":
				return (
					<div className="space-y-12">
						<SourceBookPage
							title="Status Degradations"
							subtitle="System Errors"
						>
							Environmental hazards, binary plagues, and mental disruptions that
							can affect your operational capacity.
						</SourceBookPage>

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{conditions.map((condition) => (
								<div
									key={condition.id}
									className="p-4 border border-red-500/20 bg-red-900/5 rounded-lg hover:border-red-500/50 transition-colors"
								>
									<h4 className="font-bold text-red-500 mb-2">
										{condition.name}
									</h4>
									<p className="text-xs text-muted-foreground mb-4 line-clamp-2">
										{condition.description}
									</p>

									<SourceBookCallout
										title="ERROR IMPACT"
										type="sidebar"
										systemInteraction={condition.system_interaction}
									>
										<ul className="text-[10px] space-y-1">
											{condition.effects?.map((effect) => (
												<li key={effect} className="text-red-400">
													! {effect}
												</li>
											))}
										</ul>
									</SourceBookCallout>
								</div>
							))}
						</div>
					</div>
				);

			case "skills":
				return (
					<div className="space-y-12">
						<SourceBookPage
							title="Skill Protocols"
							subtitle="Biological Optimization"
						>
							Skill packages represent your proficiency in interpreting and
							manipulating various aspects of the System.
						</SourceBookPage>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
							{skills.map((skill) => (
								<div
									key={skill.id}
									className="p-6 border border-cyan/20 bg-black/40 rounded-lg"
								>
									<div className="flex justify-between items-start mb-4">
										<div>
											<h3 className="text-xl font-bold text-cyan">
												{skill.name}
											</h3>
											<p className="text-[10px] text-amethyst uppercase tracking-widest">
												Base: {skill.ability} / {skill.type}
											</p>
										</div>
									</div>
									<p className="text-sm text-muted-foreground mb-4">
										{skill.description}
									</p>

									<div className="space-y-4">
										<div className="p-3 bg-cyan/5 border border-cyan/10 rounded">
											<h4 className="text-[10px] font-bold text-cyan uppercase mb-2">
												Basic Protocol
											</h4>
											<ul className="text-[10px] space-y-1 text-muted-foreground">
												{skill.benefits?.basic?.map((benefit) => (
													<li key={benefit}>• {benefit}</li>
												))}
											</ul>
										</div>

										<div className="p-3 bg-amethyst/5 border border-amethyst/10 rounded">
											<h4 className="text-[10px] font-bold text-amethyst uppercase mb-2">
												Expert Augmentation
											</h4>
											<ul className="text-[10px] space-y-1 text-muted-foreground">
												{skill.benefits?.expert?.map((benefit) => (
													<li key={benefit}>• {benefit}</li>
												)) || <li className="italic">Standard Issue Only</li>}
											</ul>
										</div>

										{skill.benefits?.master &&
											skill.benefits.master.length > 0 && (
												<div className="p-3 bg-orange-500/5 border border-orange-500/10 rounded">
													<h4 className="text-[10px] font-bold text-orange-500 uppercase mb-2">
														Master Integration
													</h4>
													<ul className="text-[10px] space-y-1 text-muted-foreground">
														{skill.benefits.master.map((benefit) => (
															<li key={benefit}>• {benefit}</li>
														))}
													</ul>
												</div>
											)}
									</div>
								</div>
							))}
						</div>
						{renderPagination(skills.length)}
					</div>
				);

			case "tattoos":
				return (
					<div className="space-y-12">
						<SourceBookPage
							title="Magical Tattoos"
							subtitle="System Circuit Ink"
						>
							Dimensional ink, sovereign stigmas, and mana circuit grafts that
							directly merge with a Hunter's base parameters.
						</SourceBookPage>

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{tattoos
								.slice(
									(currentPage - 1) * itemsPerPage,
									currentPage * itemsPerPage,
								)
								.map((tattoo) => (
									<div
										key={tattoo.id}
										className="p-6 border border-cyan/20 bg-black/40 rounded-lg hover:border-cyan/50 transition-colors flex flex-col"
									>
										<div className="flex justify-between items-start mb-4">
											<h3 className="text-xl font-bold text-cyan">
												{tattoo.name}
											</h3>
											<span className="text-[10px] px-2 py-0.5 border border-amethyst/50 text-amethyst uppercase tracking-widest">
												{tattoo.rarity}
											</span>
										</div>
										<p className="text-sm text-muted-foreground mb-4 flex-grow">
											{tattoo.description}
										</p>

										<SourceBookCallout
											title="INK DIAGNOSTICS"
											type="sidebar"
											systemInteraction={
												tattoo.system_interaction ||
												JSON.stringify(tattoo.effects)
											}
										>
											<div className="text-[10px] space-y-2">
												<p>
													<span className="text-cyan">PLACEMENT:</span>{" "}
													{tattoo.body_part || "Any"}
												</p>
												{tattoo.attunement && (
													<p className="text-red-400 font-bold uppercase">
														Requires Attunement
													</p>
												)}
												{tattoo.effects && (
													<div className="mt-2 pt-2 border-t border-cyan/10">
														{tattoo.effects.primary && (
															<p className="mb-1">
																<span className="text-cyan">PRIMARY:</span>{" "}
																{tattoo.effects.primary}
															</p>
														)}
														{tattoo.effects.secondary && (
															<p>
																<span className="text-amethyst">
																	SECONDARY:
																</span>{" "}
																{tattoo.effects.secondary}
															</p>
														)}
													</div>
												)}
											</div>
										</SourceBookCallout>
									</div>
								))}
						</div>
						{renderPagination(tattoos.length)}
					</div>
				);

			default:
				return (
					<SourceBookPage title="Null Sector" subtitle="Undefined Protocol">
						The requested terminal does not exist or has been wiped from the
						System archives. Redirecting to initialization...
					</SourceBookPage>
				);
		}
	};

	return (
		<SourceBookLayout activeSection={section || "intro"}>
			{renderSection()}
		</SourceBookLayout>
	);
};

export default SourceBook;
