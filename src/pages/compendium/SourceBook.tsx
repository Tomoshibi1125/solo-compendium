import { useParams } from "react-router-dom";
import { SourceBookCallout } from "@/components/compendium/SourceBookCallout";
import { SourceBookLayout } from "@/components/compendium/SourceBookLayout";
import { SourceBookPage } from "@/components/compendium/SourceBookPage";
import { SourceBookStatBlock } from "@/components/compendium/SourceBookStatBlock";
import { backgrounds } from "@/data/compendium/backgrounds";
import { conditions } from "@/data/compendium/conditions";
// Import real data
import { comprehensiveFeats as feats } from "@/data/compendium/feats-comprehensive";
import { items } from "@/data/compendium/items";
import { jobs } from "@/data/compendium/jobs";
import { locations } from "@/data/compendium/locations";
import { monsters } from "@/data/compendium/monsters";
import { regents } from "@/data/compendium/regents";
import { comprehensiveRelics as relics } from "@/data/compendium/relics-comprehensive";
import { systemAscendantRunes as runes } from "@/data/compendium/runes";
import { sigils } from "@/data/compendium/sigils";
import { comprehensiveSkills as skills } from "@/data/compendium/skills-comprehensive";
import { spells } from "@/data/compendium/spells";
import { techniques } from "@/data/compendium/techniques";

const SourceBook: React.FC = () => {
	const { section = "intro" } = useParams<{ section: string }>();

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
													{regent.class_features?.slice(0, 5).map((feature) => (
														<li key={feature.name}>
															<span className="text-cyan">{feature.name}:</span>{" "}
															{feature.description.substring(0, 100)}...
														</li>
													)) ||
														regent.features?.slice(0, 5).map((feature) => (
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
							title="System Roles"
							subtitle="The Path of Awakening"
						>
							Your Job defines your role within the System. It determines your
							combat capabilities, mana capacity, and potential for evolution.
						</SourceBookPage>

						<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
							{jobs.map((job) => (
								<SourceBookCallout key={job.id} title={job.name} type="sidebar">
									<p className="text-xs italic mb-2 text-cyan/70">
										{job.rank} Rank | {job.primary_abilities?.join(", ")}
									</p>
									<p className="text-sm line-clamp-6">{job.description}</p>
								</SourceBookCallout>
							))}
						</div>
					</div>
				);

			case "monsters":
				return (
					<div className="space-y-12">
						<SourceBookPage
							title="Threat Profiles"
							subtitle="Entities of the Rifts"
						>
							The rifts are home to countless entities, categorized by their
							Mana Signature (Rank). From the lowly E-Rank scavengers to the
							cataclysmic S-Rank threats, understanding your enemy is the first
							step to survival.
						</SourceBookPage>

						{["S", "A", "B", "C", "D"].map((rank) => {
							const filteredMonsters = monsters.filter((m) => m.rank === rank);
							if (filteredMonsters.length === 0) return null;

							return (
								<div key={rank} className="mt-12">
									<h2 className="sb-h2">{rank}-Rank Threats</h2>
									<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
										{filteredMonsters.map((monster) => (
											<SourceBookStatBlock
												key={monster.id}
												name={monster.name}
												type={`${monster.type}, ${monster.rank} Rank`}
												ac={monster.stats?.armorClass || monster.ac || 10}
												hp={monster.stats?.hitPoints || monster.hp || 10}
												speed={
													monster.stats?.speed
														? `${monster.stats.speed} ft.`
														: "30 ft."
												}
												stats={{
													str: monster.stats?.abilityScores?.strength || 10,
													dex: monster.stats?.abilityScores?.dexterity || 10,
													con: monster.stats?.abilityScores?.constitution || 10,
													int: monster.stats?.abilityScores?.intelligence || 10,
													wis: monster.stats?.abilityScores?.wisdom || 10,
													cha: monster.stats?.abilityScores?.charisma || 10,
												}}
												traits={
													monster.traits as {
														name: string;
														description: string;
													}[]
												}
												actions={
													monster.actions as {
														name: string;
														description: string;
													}[]
												}
											/>
										))}
									</div>
								</div>
							);
						})}
					</div>
				);

			case "spells":
				return (
					<div className="space-y-12">
						<SourceBookPage
							title="Arcane Protocols"
							subtitle="Mana Manipulation Theory"
						>
							Spells are structured sequences of mana manipulation, categorized
							by their complexity and required level of authorization (Rank).
						</SourceBookPage>

						{["S", "A", "B", "C", "D"].map((rank) => {
							const filteredSpells = spells.filter((s) => s.rank === rank);
							if (filteredSpells.length === 0) return null;

							return (
								<div key={rank} className="mt-12">
									<h2 className="sb-h2">{rank}-Rank Protocols</h2>
									<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
										{filteredSpells.map((spell) => (
											<SourceBookCallout
												key={spell.id}
												title={spell.name}
												type="sidebar"
											>
												<p className="text-xs italic mb-2 text-cyan/70">
													{spell.school || "Void"} | {spell.rank} Rank
												</p>
												<p className="text-sm line-clamp-4">
													{spell.description}
												</p>
											</SourceBookCallout>
										))}
									</div>
								</div>
							);
						})}
					</div>
				);

			case "items":
				return (
					<div className="space-y-12">
						<SourceBookPage
							title="Tactical Assets"
							subtitle="Gear and Equipment"
						>
							From standard-issue HUDs to legendary void-forged blades, your
							equipment is what keeps you ahead of the system glitches. This
							archive includes all standard items and unique Relics of power.
						</SourceBookPage>

						{["mythic", "legendary", "epic", "very_rare", "rare", "uncommon", "common"].map(
							(rarity) => {
								const filteredItems = items.filter((i) => i.rarity === rarity);
								const filteredRelics = relics.filter(
									(r) => r.rarity === rarity,
								);
								if (filteredItems.length === 0 && filteredRelics.length === 0)
									return null;

								return (
									<div key={rarity} className="mt-12">
										<h2 className="sb-h2">{rarity.toUpperCase()} Assets</h2>
										<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
											{filteredItems.map((item) => (
												<SourceBookCallout
													key={item.id}
													title={item.name}
													type="sidebar"
												>
													<p className="text-xs italic mb-2 text-amethyst/70">
														{item.type} | {item.rarity}
													</p>
													<p className="text-sm line-clamp-4">
														{item.description}
													</p>
													{item.stats && (
														<div className="mt-2 pt-2 border-t border-cyan/20 text-[10px] grid grid-cols-2">
															{(
																item.stats as {
																	attack?: number;
																	defense?: number;
																}
															).attack && (
																<span>
																	ATK: +
																	{
																		(
																			item.stats as {
																				attack?: number;
																				defense?: number;
																			}
																		).attack
																	}
																</span>
															)}
															{(
																item.stats as {
																	attack?: number;
																	defense?: number;
																}
															).defense && (
																<span>
																	DEF: +
																	{
																		(
																			item.stats as {
																				attack?: number;
																				defense?: number;
																			}
																		).defense
																	}
																</span>
															)}
														</div>
													)}
												</SourceBookCallout>
											))}
											{filteredRelics.map((relic) => (
												<SourceBookCallout
													key={relic.id}
													title={relic.name}
													type="sidebar"
												>
													<p className="text-xs italic mb-2 text-cyan/70">
														Relic | {relic.type} | {relic.rarity}
													</p>
													<p className="text-sm mb-2">{relic.description}</p>
													<div className="space-y-1 mt-2 border-t border-cyan/10 pt-2">
														{relic.abilities.map((ability) => (
															<div key={ability.name} className="text-[10px]">
																<span className="text-cyan font-bold">
																	{ability.name}:
																</span>{" "}
																<span className="text-muted-foreground">
																	{ability.description}
																</span>
															</div>
														))}
													</div>
												</SourceBookCallout>
											))}
										</div>
									</div>
								);
							},
						)}
					</div>
				);

			case "feats":
				return (
					<div className="space-y-12">
						<SourceBookPage
							title="System Overclocking"
							subtitle="Specialization and Feats"
						>
							Feats represent deep-level optimizations of your System interface,
							granting unique capabilities and resonant powers.
						</SourceBookPage>

						<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
							{feats.map((feat) => (
								<SourceBookCallout
									key={feat.id}
									title={feat.name}
									type="sidebar"
								>
									<p className="text-xs italic mb-2 text-cyan/70">
										Source: {feat.source}
									</p>
									<p className="text-sm mb-2">{feat.description}</p>
									<ul className="list-disc list-inside text-[11px] space-y-1 text-muted-foreground">
										{feat.benefits.map((benefit) => (
											<li key={benefit.substring(0, 20)}>{benefit}</li>
										))}
									</ul>
								</SourceBookCallout>
							))}
						</div>
					</div>
				);

			case "backgrounds":
				return (
					<div className="space-y-12">
						<SourceBookPage
							title="Mortal Origins"
							subtitle="The Path Before the System"
						>
							Beyond your Job and Rank, your Background defines who you were
							before the System initiated. It provides your starting skills,
							languages, and unique features that ground you in the reality of
							the Void.
						</SourceBookPage>

						<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
							{backgrounds.map((bg) => (
								<SourceBookPage key={bg.id} title={bg.name} subtitle={bg.type}>
									<div className="flex flex-col md:flex-row gap-6 mb-4">
										{bg.image && (
											<div className="w-full md:w-1/3 aspect-square relative overflow-hidden rounded border border-cyan/30">
												<img
													src={bg.image}
													alt={bg.name}
													className="object-cover w-full h-full grayscale hover:grayscale-0 transition-all duration-500"
												/>
												<div className="absolute inset-0 bg-cyan/10 pointer-events-none" />
											</div>
										)}
										<div className="flex-1">
											<p className="text-sm mb-4 leading-relaxed italic text-muted-foreground">
												{bg.description}
											</p>
											<div className="grid grid-cols-2 gap-4 text-xs">
												<div>
													<h4 className="text-cyan font-bold uppercase mb-1">
														Skills
													</h4>
													<p>{bg.skillProficiencies.join(", ")}</p>
												</div>
												{bg.languages && (
													<div>
														<h4 className="text-cyan font-bold uppercase mb-1">
															Languages
														</h4>
														<p>{bg.languages.join(", ")}</p>
													</div>
												)}
											</div>
										</div>
									</div>

									<div className="space-y-4">
										{bg.features.map((feature) => (
											<SourceBookCallout
												key={feature.name}
												title={feature.name}
												type="sidebar"
											>
												<p className="text-sm">{feature.description}</p>
											</SourceBookCallout>
										))}
									</div>
								</SourceBookPage>
							))}
						</div>
					</div>
				);

			case "techniques":
				return (
					<div className="space-y-12">
						<SourceBookPage
							title="Combat Specializations"
							subtitle="Maneuvers and Martial Excellence"
						>
							Specializations are advanced combat techniques that go beyond
							basic weapon proficiency. They represent the peak of martial
							evolution within the System, allowing for reality-warping feats of
							strength and agility.
						</SourceBookPage>

						<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
							{techniques.map((tech) => (
								<SourceBookCallout
									key={tech.id}
									title={tech.name}
									type="sidebar"
								>
									<p className="text-[10px] uppercase tracking-widest text-amethyst mb-2">
										{tech.type} | {tech.style} Protocol
									</p>
									<p className="text-sm mb-4">{tech.description}</p>

									<div className="space-y-3 text-xs border-t border-cyan/10 pt-3">
										<div className="grid grid-cols-2 gap-2">
											<div>
												<span className="text-cyan font-bold">Activation:</span>{" "}
												{tech.activation.type}
											</div>
											{tech.activation.cost && (
												<div>
													<span className="text-cyan font-bold">Cost:</span>{" "}
													{tech.activation.cost}
												</div>
											)}
										</div>

										<div>
											<h4 className="text-amethyst font-bold uppercase text-[10px] mb-1">
												Manifestation
											</h4>
											<p className="text-muted-foreground italic">
												{tech.effects.primary}
											</p>
											{tech.effects.secondary && (
												<p className="text-muted-foreground mt-1">
													{tech.effects.secondary}
												</p>
											)}
										</div>

										{tech.flavor && (
											<p className="text-[10px] italic text-cyan/50 mt-2">
												"{tech.flavor}"
											</p>
										)}
									</div>
								</SourceBookCallout>
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
										>
											<p className="text-[10px] uppercase text-cyan mb-1">
												Rank {rune.rune_level} {rune.rune_type}
											</p>
											<p className="text-sm mb-2">{rune.description}</p>
											<p className="text-xs text-amethyst font-semibold">
												EFFECT: {rune.effect_description}
											</p>
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
										>
											<p className="text-[10px] uppercase text-cyan mb-1">
												Rank {sigil.rune_level} | {sigil.rarity}
											</p>
											<p className="text-sm mb-2">{sigil.description}</p>
											<p className="text-xs text-amethyst font-semibold">
												EFFECT: {sigil.effect_description}
											</p>
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
							title="The Void Atlas"
							subtitle="Geography of the System"
						>
							The System consists of layered dimensions, from the stable Core
							Sectors to the chaotic Abyssal Realms. Each location has its own
							mana-density, physical laws, and resident threats.
						</SourceBookPage>

						<div className="grid grid-cols-1 gap-12">
							{locations.map((loc) => (
								<div
									key={loc.id}
									className="grid grid-cols-1 lg:grid-cols-3 gap-8"
								>
									<div className="lg:col-span-1">
										<div className="aspect-video lg:aspect-square relative overflow-hidden rounded border border-amethyst/30 mb-4">
											<img
												src={loc.image}
												alt={loc.name}
												className="object-cover w-full h-full"
											/>
											<div className="absolute top-2 left-2 px-2 py-1 bg-void/80 border border-cyan/50 text-[10px] font-mono text-cyan">
												RANK: {loc.rank}
											</div>
										</div>
										<SourceBookCallout title="INTEL REPORT">
											<div className="text-[11px] space-y-2">
												<div>
													<span className="text-cyan font-bold uppercase">
														Residents:
													</span>
													<p>{loc.encounters.join(", ")}</p>
												</div>
												<div>
													<span className="text-amethyst font-bold uppercase">
														Assets:
													</span>
													<p>{loc.treasures.join(", ")}</p>
												</div>
											</div>
										</SourceBookCallout>
									</div>
									<div className="lg:col-span-2">
										<SourceBookPage title={loc.name} subtitle={loc.type}>
											<p className="text-sm leading-relaxed">
												{loc.description}
											</p>
										</SourceBookPage>
									</div>
								</div>
							))}
						</div>
					</div>
				);

			case "rules":
				return (
					<SourceBookPage
						title="System Protocols"
						subtitle="Core Gameplay Mechanics"
					>
						<h2 className="sb-h2">The Core Loop</h2>
						<p>
							Every interaction within the System is governed by the Protocol
							Check. Roll a d20 and add your relevant Attribute Modifier.
						</p>

						<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-8">
							<SourceBookCallout title="DC THRESHOLDS">
								<table className="w-full text-sm">
									<thead>
										<tr className="text-cyan border-b border-cyan/30">
											<th className="text-left py-1">Difficulty</th>
											<th className="text-right py-1">Target DC</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td>Very Easy</td>
											<td className="text-right">5</td>
										</tr>
										<tr className="bg-cyan/5">
											<td>Easy</td>
											<td className="text-right">10</td>
										</tr>
										<tr>
											<td>Medium</td>
											<td className="text-right">15</td>
										</tr>
										<tr className="bg-cyan/5">
											<td>Hard</td>
											<td className="text-right">20</td>
										</tr>
										<tr>
											<td>Very Hard</td>
											<td className="text-right">25</td>
										</tr>
										<tr className="bg-cyan/5">
											<td>Nearly Impossible</td>
											<td className="text-right">30</td>
										</tr>
									</tbody>
								</table>
							</SourceBookCallout>

							<SourceBookCallout title="CRITICAL FAILURE">
								A natural 1 on the d20 signifies a System Glitch. The DM may
								impose a temporary mana-leak or structural instability.
							</SourceBookCallout>
						</div>

						<h2 className="sb-h2">Mana Management</h2>
						<p>
							Spells and abilities consume Mana Points (MP). Your maximum MP is
							determined by your Level and Intellect Protocol.
						</p>

						<h2 className="sb-h2 mt-12">Protocol Conditions</h2>
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-8">
							{conditions.map((condition) => (
								<SourceBookCallout
									key={condition.id}
									title={condition.name}
									type="sidebar"
								>
									<p className="text-[10px] uppercase text-amethyst mb-1">
										Type: {condition.type}
									</p>
									<p className="text-sm mb-2">{condition.description}</p>
									<ul className="list-disc list-inside text-xs space-y-1 text-muted-foreground">
										{condition.effects.map((effect) => (
											<li key={effect}>{effect}</li>
										))}
									</ul>
								</SourceBookCallout>
							))}
						</div>

						<h2 className="sb-h2 mt-12">System Skills</h2>
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-8">
							{skills.map((skill) => (
								<SourceBookCallout
									key={skill.id}
									title={skill.name}
									type="sidebar"
								>
									<p className="text-[10px] uppercase text-cyan mb-1">
										Ability: {skill.ability} | {skill.type}
									</p>
									<p className="text-sm mb-2">{skill.description}</p>
									<div className="grid grid-cols-1 gap-2 mt-2 pt-2 border-t border-cyan/10">
										<div className="text-[10px]">
											<span className="text-cyan font-bold uppercase">
												Basic:
											</span>{" "}
											{skill.benefits.basic.join(", ")}
										</div>
										<div className="text-[10px]">
											<span className="text-amethyst font-bold uppercase">
												Expert:
											</span>{" "}
											{skill.benefits.expert.join(", ")}
										</div>
									</div>
								</SourceBookCallout>
							))}
						</div>
					</SourceBookPage>
				);

			default:
				return (
					<SourceBookPage
						title="UNAUTHORIZED ACCESS"
						subtitle="Error 404: Protocol Not Found"
					>
						The requested protocol is currently encrypted or does not exist
						within the System Archive.
					</SourceBookPage>
				);
		}
	};

	return (
		<SourceBookLayout activeSection={section}>
			{renderSection()}
		</SourceBookLayout>
	);
};

export default SourceBook;
