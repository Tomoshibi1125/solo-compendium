/**
 * Integrated Player Tools Panel for VTT
 * Provides all essential player tools without leaving the VTT interface
 */

import {
	BookOpen,
	Dice1,
	Eye,
	EyeOff,
	Footprints,
	MessageSquare,
	Plus,
	Shield,
	Sword,
	Target,
	Zap,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SystemWindow } from "@/components/ui/SystemWindow";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useGlobalDDBeyondIntegration } from "@/hooks/useGlobalDDBeyondIntegration";
import { cn } from "@/lib/utils";

interface PlayerToolsPanelProps {
	characterId?: string;
	onRollDice?: (formula: string) => void;
	onSendMessage?: (message: string, type?: string) => void;
	onUseAbility?: (ability: string) => void;
	onCastSpell?: (spellId: string) => void;
	onTakeAction?: (action: string) => void;
	className?: string;
}

export const PlayerToolsPanel: React.FC<PlayerToolsPanelProps> = ({
	characterId,
	onRollDice,
	onSendMessage,
	onUseAbility,
	onCastSpell,
	onTakeAction,
	className,
}) => {
	const { toast } = useToast();
	const { usePlayerToolsEnhancements } = useGlobalDDBeyondIntegration();
	const { trackCustomFeatureUsage } = usePlayerToolsEnhancements();

	const [activeTool, setActiveTool] = useState<string>("actions");
	const [quickRollValue, setQuickRollValue] = useState("1d20");
	const [quickRollResult, setQuickRollResult] = useState<number | null>(null);
	const [customMessage, setCustomMessage] = useState("");
	const [selectedSpell, setSelectedSpell] = useState("");
	const [selectedAbility, setSelectedAbility] = useState("");

	// Quick roll — routes through VTT realtime engine if wired, else local fallback
	const handleQuickRoll = () => {
		try {
			if (onRollDice) {
				onRollDice(quickRollValue);
				setQuickRollResult(null);
			} else {
				// Offline fallback
				const match = quickRollValue.match(/(\d+)d(\d+)(?:\s*([+-]\s*\d+))?/);
				if (match) {
					const numDice = parseInt(match[1], 10);
					const dieSize = parseInt(match[2], 10);
					const modifier = match[3]
						? parseInt(match[3].replace(/\s/g, ""), 10)
						: 0;
					let total = modifier;
					for (let i = 0; i < numDice; i++) {
						total += Math.floor(Math.random() * dieSize) + 1;
					}
					setQuickRollResult(total);
					toast({
						title: "Dice Roll",
						description: `${quickRollValue} = ${total}`,
					});
				}
			}
		} catch (_error) {
			toast({
				title: "Invalid Roll",
				description: "Please use format like '1d20', '2d6+3', etc.",
				variant: "destructive",
			});
		}
	};

	// Common dice rolls
	const commonRolls = [
		{ formula: "1d20", name: "Attack/Check", icon: "🎯" },
		{ formula: "1d20+5", name: "Advantage", icon: "⬆️" },
		{ formula: "1d20-5", name: "Disadvantage", icon: "⬇️" },
		{ formula: "2d6", name: "Damage", icon: "⚔️" },
		{ formula: "1d8", name: "Healing", icon: "💚" },
		{ formula: "1d4", name: "Bonus", icon: "✨" },
	];

	// Quick actions
	const quickActions = [
		{
			id: "attack",
			name: "Attack",
			icon: "⚔️",
			description: "Make an attack roll",
		},
		{
			id: "dodge",
			name: "Dodge",
			icon: "🛡️",
			description: "Dodge incoming attack",
		},
		{
			id: "cast",
			name: "Cast Spell",
			icon: "🔮",
			description: "Cast a prepared spell",
		},
		{
			id: "use-item",
			name: "Use Item",
			icon: "📿",
			description: "Use an item from inventory",
		},
		{
			id: "help",
			name: "Help Ally",
			icon: "🤝",
			description: "Help an adjacent ally",
		},
		{ id: "hide", name: "Hide", icon: "👁️", description: "Attempt to hide" },
	];

	// Quick spells
	const quickSpells = [
		{
			id: "fireball",
			name: "Fireball",
			icon: "🔥",
			level: 3,
			description: "Area damage spell",
		},
		{
			id: "heal",
			name: "Cure Wounds",
			icon: "💚",
			level: 1,
			description: "Heal a creature",
		},
		{
			id: "shield",
			name: "Shield",
			icon: "🛡️",
			level: 1,
			description: "Protective barrier",
		},
		{
			id: "lightning",
			name: "Lightning Bolt",
			icon: "⚡",
			level: 3,
			description: "Line damage spell",
		},
		{
			id: "invisibility",
			name: "Invisibility",
			icon: "👻",
			level: 2,
			description: "Become invisible",
		},
		{
			id: "teleport",
			name: "Teleport",
			icon: "🌀",
			level: 7,
			description: "Instant transportation",
		},
	];

	// Quick abilities — System Ascendant names (STR, AGI, VIT, INT, SENSE, PRE)
	const quickAbilities = [
		{ id: "strength-save", name: "STR Save", icon: "💪", ability: "STR" },
		{ id: "agility-save", name: "AGI Save", icon: "🏃", ability: "AGI" },
		{ id: "vitality-save", name: "VIT Save", icon: "❤️", ability: "VIT" },
		{ id: "intelligence-save", name: "INT Save", icon: "🧠", ability: "INT" },
		{ id: "sense-save", name: "SENSE Save", icon: "👁️", ability: "SENSE" },
		{ id: "presence-save", name: "PRE Save", icon: "✨", ability: "PRE" },
	];

	// Quick messages
	const quickMessages = [
		{ text: "I attack the nearest enemy!", type: "emote" },
		{ text: "I cast a spell!", type: "emote" },
		{ text: "I use my special ability!", type: "emote" },
		{ text: "I help my ally!", type: "emote" },
		{ text: "I examine the area carefully.", type: "emote" },
		{ text: "I search for hidden clues.", type: "emote" },
	];

	return (
		<div className={cn("space-y-4", className)}>
			{/* Quick Actions Bar */}
			<SystemWindow title="QUICK ACTIONS" compact>
				<div className="grid grid-cols-2 gap-2">
					{/* Quick Dice Roll */}
					<div className="space-y-2">
						<Label className="text-xs">Quick Roll</Label>
						<div className="flex gap-1">
							<Input
								value={quickRollValue}
								onChange={(e) => setQuickRollValue(e.target.value)}
								placeholder="1d20+5"
								className="h-8 text-xs"
							/>
							<Button size="sm" onClick={handleQuickRoll} className="h-8">
								<Dice1 className="w-3 h-3" />
							</Button>
						</div>
						{quickRollResult !== null && (
							<div className="text-center text-xs font-bold text-primary">
								Result: {quickRollResult}
							</div>
						)}
					</div>

					{/* Quick Messages */}
					<div className="space-y-2">
						<Label className="text-xs">Quick Message</Label>
						<div className="flex gap-1">
							<Input
								value={customMessage}
								onChange={(e) => setCustomMessage(e.target.value)}
								placeholder="Type message..."
								className="h-8 text-xs"
							/>
							<Button
								size="sm"
								onClick={() => {
									if (customMessage.trim()) {
										onSendMessage?.(customMessage);
										setCustomMessage("");
										toast({
											title: "Message Sent",
											description: customMessage,
										});
									}
								}}
								className="h-8"
							>
								<MessageSquare className="w-3 h-3" />
							</Button>
						</div>
					</div>
				</div>

				{/* Quick Roll Buttons */}
				<div className="space-y-2 pt-2 border-t border-border/50">
					<Label className="text-xs">Common Rolls</Label>
					<div className="grid grid-cols-3 gap-1">
						{commonRolls.map((roll) => (
							<Button
								key={roll.formula}
								size="sm"
								variant="outline"
								onClick={() => {
									setQuickRollValue(roll.formula);
									handleQuickRoll();
								}}
								className="h-8 text-xs"
								title={roll.name}
							>
								{roll.icon} {roll.formula}
							</Button>
						))}
					</div>
				</div>
			</SystemWindow>

			{/* Full Player Tools */}
			<SystemWindow title="PLAYER TOOLS">
				<Tabs
					value={activeTool}
					onValueChange={setActiveTool}
					className="w-full"
				>
					<TabsList className="grid w-full grid-cols-4 h-auto">
						<TabsTrigger value="actions" className="flex-col gap-1 p-2">
							<Sword className="w-4 h-4" />
							<span className="text-xs">Actions</span>
						</TabsTrigger>
						<TabsTrigger value="spells" className="flex-col gap-1 p-2">
							<Zap className="w-4 h-4" />
							<span className="text-xs">Spells</span>
						</TabsTrigger>
						<TabsTrigger value="abilities" className="flex-col gap-1 p-2">
							<Shield className="w-4 h-4" />
							<span className="text-xs">Saves</span>
						</TabsTrigger>
						<TabsTrigger value="chat" className="flex-col gap-1 p-2">
							<MessageSquare className="w-4 h-4" />
							<span className="text-xs">Chat</span>
						</TabsTrigger>
					</TabsList>

					<TabsContent value="actions" className="space-y-4">
						<SystemWindow title="COMBAT ACTIONS" compact>
							<div className="grid grid-cols-2 gap-2">
								{quickActions.map((action) => (
									<Button
										key={action.id}
										size="sm"
										variant="outline"
										onClick={() => {
											onTakeAction?.(action.id);
											if (characterId) {
												trackCustomFeatureUsage(
													characterId,
													action.name,
													"used",
													"SA",
												).catch(console.error);
											}
											toast({
												title: "Action Taken",
												description: action.description,
											});
										}}
										className="h-12 flex-col gap-1 text-xs"
									>
										<div className="text-lg">{action.icon}</div>
										<div>{action.name}</div>
									</Button>
								))}
							</div>
						</SystemWindow>

						<SystemWindow title="MOVEMENT" compact>
							<div className="space-y-3">
								<div className="grid grid-cols-2 gap-2">
									<Button
										size="sm"
										variant="outline"
										onClick={() => {
											onTakeAction?.("move");
											toast({
												title: "Move Action",
												description: "Moving to new position",
											});
										}}
										className="h-12 flex-col gap-1 text-xs"
									>
										<Footprints className="w-4 h-4" />
										Move
									</Button>
									<Button
										size="sm"
										variant="outline"
										onClick={() => {
											onTakeAction?.("dash");
											toast({
												title: "Dash Action",
												description: "Taking dash action for extra movement",
											});
										}}
										className="h-12 flex-col gap-1 text-xs"
									>
										<Target className="w-4 h-4" />
										Dash
									</Button>
								</div>
								<div className="grid grid-cols-2 gap-2">
									<Button
										size="sm"
										variant="outline"
										onClick={() => {
											onTakeAction?.("disengage");
											toast({
												title: "Disengage",
												description: "Disengaging from combat",
											});
										}}
										className="h-12 flex-col gap-1 text-xs"
									>
										<EyeOff className="w-4 h-4" />
										Disengage
									</Button>
									<Button
										size="sm"
										variant="outline"
										onClick={() => {
											onTakeAction?.("ready");
											toast({
												title: "Ready Action",
												description: "Preparing a ready action",
											});
										}}
										className="h-12 flex-col gap-1 text-xs"
									>
										<Eye className="w-4 h-4" />
										Ready
									</Button>
								</div>
							</div>
						</SystemWindow>
					</TabsContent>

					<TabsContent value="spells" className="space-y-4">
						<SystemWindow title="QUICK SPELLS" compact>
							<div className="grid grid-cols-2 gap-2">
								{quickSpells.map((spell) => (
									<Button
										key={spell.id}
										size="sm"
										variant="outline"
										onClick={() => {
											onCastSpell?.(spell.id);
											if (characterId) {
												trackCustomFeatureUsage(
													characterId,
													spell.name,
													"cast",
													"SA",
												).catch(console.error);
											}
											toast({
												title: "Spell Cast",
												description: `${spell.name} cast successfully`,
											});
										}}
										className="h-12 flex-col gap-1 text-xs"
									>
										<div className="text-lg">{spell.icon}</div>
										<div>{spell.name}</div>
										<Badge variant="outline" className="text-xs">
											Level {spell.level}
										</Badge>
									</Button>
								))}
							</div>
						</SystemWindow>

						<SystemWindow title="SPELL MANAGEMENT" compact>
							<div className="space-y-3">
								<div>
									<Label className="text-xs">Cast Custom Spell</Label>
									<div className="flex gap-2">
										<Select
											value={selectedSpell}
											onValueChange={setSelectedSpell}
										>
											<SelectTrigger className="h-8 text-xs">
												<SelectValue placeholder="Select spell" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="custom-fireball">
													Custom Fireball
												</SelectItem>
												<SelectItem value="custom-heal">
													Custom Healing
												</SelectItem>
												<SelectItem value="custom-shield">
													Custom Shield
												</SelectItem>
											</SelectContent>
										</Select>
										<Button
											size="sm"
											onClick={() => {
												if (selectedSpell) {
													onCastSpell?.(selectedSpell);
													if (characterId) {
														trackCustomFeatureUsage(
															characterId,
															selectedSpell,
															"cast",
															"SA",
														).catch(console.error);
													}
													toast({
														title: "Spell Cast",
														description: `${selectedSpell} cast successfully`,
													});
												}
											}}
											className="h-8"
										>
											Cast
										</Button>
									</div>
								</div>
								<div className="grid grid-cols-2 gap-2">
									<Button
										size="sm"
										variant="outline"
										onClick={() => {
											if (characterId)
												window.open(
													`/characters/${characterId}#spells`,
													"_blank",
												);
										}}
									>
										<BookOpen className="w-3 h-3 mr-1" />
										Spellbook
									</Button>
									<Button
										size="sm"
										variant="outline"
										onClick={() => {
											if (characterId)
												window.open(
													`/characters/${characterId}#spells`,
													"_blank",
												);
										}}
									>
										<Plus className="w-3 h-3 mr-1" />
										Prepare Spell
									</Button>
								</div>
							</div>
						</SystemWindow>
					</TabsContent>

					<TabsContent value="abilities" className="space-y-4">
						<SystemWindow title="SAVING THROWS" compact>
							<div className="grid grid-cols-2 gap-2">
								{quickAbilities.map((ability) => (
									<Button
										key={ability.id}
										size="sm"
										variant="outline"
										onClick={() => {
											onUseAbility?.(ability.ability);
											toast({
												title: "Saving Throw",
												description: `${ability.name} roll initiated`,
											});
										}}
										className="h-12 flex-col gap-1 text-xs"
									>
										<div className="text-lg">{ability.icon}</div>
										<div>{ability.name}</div>
									</Button>
								))}
							</div>
						</SystemWindow>

						<SystemWindow title="ABILITY CHECKS" compact>
							<div className="space-y-3">
								<div>
									<Label className="text-xs">Custom Ability Check</Label>
									<div className="flex gap-2">
										<Select
											value={selectedAbility}
											onValueChange={setSelectedAbility}
										>
											<SelectTrigger className="h-8 text-xs">
												<SelectValue placeholder="Select ability" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="STR">Strength (STR)</SelectItem>
												<SelectItem value="AGI">Agility (AGI)</SelectItem>
												<SelectItem value="VIT">Vitality (VIT)</SelectItem>
												<SelectItem value="INT">Intelligence (INT)</SelectItem>
												<SelectItem value="SENSE">Sense (SENSE)</SelectItem>
												<SelectItem value="PRE">Presence (PRE)</SelectItem>
											</SelectContent>
										</Select>
										<Button
											size="sm"
											onClick={() => {
												if (selectedAbility) {
													onRollDice?.(`1d20+${selectedAbility}`);
													toast({
														title: "Ability Check",
														description: `${selectedAbility} check rolled`,
													});
												}
											}}
											className="h-8"
										>
											Roll
										</Button>
									</div>
								</div>
							</div>
						</SystemWindow>
					</TabsContent>

					<TabsContent value="chat" className="space-y-4">
						<SystemWindow title="QUICK MESSAGES" compact>
							<div className="grid grid-cols-2 gap-2">
								{quickMessages.map((message, _index) => (
									<Button
										key={JSON.stringify(message)}
										size="sm"
										variant="outline"
										onClick={() => {
											onSendMessage?.(message.text, message.type);
											toast({
												title: "Message Sent",
												description: message.text,
											});
										}}
										className="h-10 text-xs text-left"
									>
										{message.text}
									</Button>
								))}
							</div>
						</SystemWindow>

						<SystemWindow title="CUSTOM MESSAGE" compact>
							<div className="space-y-3">
								<div>
									<Label className="text-xs">Message Type</Label>
									<Select defaultValue="say">
										<SelectTrigger className="h-8 text-xs">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="say">Say</SelectItem>
											<SelectItem value="emote">Emote</SelectItem>
											<SelectItem value="whisper">Whisper</SelectItem>
											<SelectItem value="ooc">Out of Character</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div>
									<Label className="text-xs">Message</Label>
									<textarea
										value={customMessage}
										onChange={(e) => setCustomMessage(e.target.value)}
										placeholder="Type your message..."
										className="w-full h-20 p-2 text-xs bg-background border border-border rounded resize-none"
									/>
								</div>
								<Button
									onClick={() => {
										if (customMessage.trim()) {
											onSendMessage?.(customMessage);
											setCustomMessage("");
											toast({
												title: "Message Sent",
												description: customMessage,
											});
										}
									}}
									className="w-full"
								>
									Send Message
								</Button>
							</div>
						</SystemWindow>
					</TabsContent>
				</Tabs>
			</SystemWindow>
		</div>
	);
};
