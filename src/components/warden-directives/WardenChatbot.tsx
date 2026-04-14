import { Bot, Loader2, Save, Send, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { useUserToolState } from "@/hooks/useToolState";
import { AIServiceManager } from "@/lib/ai/aiService";

interface ChatMessage {
	id: string;
	role: "user" | "assistant";
	content: string;
	timestamp: number;
}

export function WardenChatbot() {
	const [isOpen, setIsOpen] = useState(false);
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [input, setInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const scrollRef = useRef<HTMLDivElement>(null);
	const { toast } = useToast();

	const { saveNow: saveNpcState } = useUserToolState<unknown>("npc_generator", {
		initialState: { npc: null },
		storageKey: "solo-compendium.Warden-tools.npc-generator.v1",
	});

	const aiManager = useRef(new AIServiceManager());

	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
		}
	}, []);

	const handleSend = async () => {
		if (!input.trim() || isLoading) return;

		const userMessage: ChatMessage = {
			id: Date.now().toString(),
			role: "user",
			content: input,
			timestamp: Date.now(),
		};

		setMessages((prev) => [...prev, userMessage]);
		setInput("");
		setIsLoading(true);

		try {
			const promptContext = messages
				.slice(-6)
				.map(
					(m) =>
						`${m.role === "user" ? "Warden" : "Warden Lattice"}: ${m.content}`,
				)
				.join("\n");

			const fullPrompt = `You are "The Warden", an omnipresent, dark-fantasy AI assistant for a Warden running a game in the "Rift Ascendant" universe.
If the Warden asks for stats, provide them as a valid JSON block enclosed in \`\`\`json ... \`\`\`. The JSON should match this interface:
{
  "name": "String",
  "rank": "E, D, C, B, A, or S",
  "role": "String",
  "personality": "String",
  "motivation": "String",
  "secret": "String",
  "quirk": "String",
  "description": "String"
}
Otherwise, answer their questions with flavorful, concise advice.
Recent history:
${promptContext}

Warden: ${userMessage.content}`;

			const response = await aiManager.current.processRequest({
				service: "gemini-proxy",
				type: "generate-content",
				input: fullPrompt,
			});

			if (response.success && typeof response.data === "string") {
				const assistantMessage: ChatMessage = {
					id: (Date.now() + 1).toString(),
					role: "assistant",
					content: response.data,
					timestamp: Date.now(),
				};
				setMessages((prev) => [...prev, assistantMessage]);
			} else if (
				response.success &&
				(response.data as { content?: string })?.content
			) {
				const assistantMessage: ChatMessage = {
					id: (Date.now() + 1).toString(),
					role: "assistant",
					content: (response.data as { content: string }).content,
					timestamp: Date.now(),
				};
				setMessages((prev) => [...prev, assistantMessage]);
			} else {
				throw new Error(response.error || "Failed to generate response.");
			}
		} catch (error) {
			toast({
				title: "Error",
				description:
					error instanceof Error
						? error.message
						: "The Warden is currently unavailable.",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const extractJsonBlock = (content: string) => {
		const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
		if (!jsonMatch) return null;
		try {
			return JSON.parse(jsonMatch[1]);
		} catch (_e) {
			return null;
		}
	};

	const handleSaveToNPC = async (content: string) => {
		const npcData = extractJsonBlock(content);
		if (!npcData) {
			toast({
				title: "Error",
				description:
					"Could not parse a valid NPC stat block from this message.",
				variant: "destructive",
			});
			return;
		}

		try {
			await saveNpcState({ npc: npcData });
			toast({
				title: "Saved",
				description: "NPC data has been saved to the NPC Generator tool.",
			});
		} catch (_err) {
			toast({
				title: "Save Failed",
				description: "Failed to write NPC data to local storage.",
				variant: "destructive",
			});
		}
	};

	return (
		<Sheet open={isOpen} onOpenChange={setIsOpen}>
			<SheetTrigger asChild>
				<Button
					variant="outline"
					size="icon"
					className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg border-primary/50 bg-background hover:bg-primary/10 transition-all z-50"
					title="Open Warden Chat"
				>
					<Bot className="w-6 h-6 text-primary" />
				</Button>
			</SheetTrigger>
			<SheetContent
				side="right"
				className="w-[95vw] sm:w-[540px] flex flex-col p-0 border-l border-primary/20 bg-background/95 backdrop-blur"
			>
				<SheetHeader className="p-4 border-b border-border bg-muted/30">
					<SheetTitle className="flex items-center gap-2">
						<Bot className="w-5 h-5 text-primary" />
						The Warden Assistant
					</SheetTitle>
				</SheetHeader>

				<ScrollArea className="flex-1 p-4" ref={scrollRef}>
					{messages.length === 0 ? (
						<div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-4 pt-20">
							<Bot className="w-12 h-12 opacity-20" />
							<p className="text-center text-sm px-8">
								I am The Warden. Ask me to generate NPC stat blocks, design
								encounters, or clarify system rules.
							</p>
						</div>
					) : (
						<div className="space-y-4">
							{messages.map((msg) => {
								const isUser = msg.role === "user";
								const hasJson =
									!isUser && extractJsonBlock(msg.content) !== null;

								return (
									<div
										key={msg.id}
										className={
											isUser ? "flex justify-end" : "flex justify-start"
										}
									>
										<div
											className={
												"flex gap-3 max-w-[85%] " +
												(isUser ? "flex-row-reverse" : "flex-row")
											}
										>
											<div
												className={
													"flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center " +
													(isUser
														? "bg-primary/20 text-primary"
														: "bg-muted text-muted-foreground")
												}
											>
												{isUser ? (
													<User className="w-4 h-4" />
												) : (
													<Bot className="w-4 h-4" />
												)}
											</div>
											<div
												className={
													"rounded-lg p-3 text-sm " +
													(isUser
														? "bg-primary text-primary-foreground"
														: "bg-muted border border-border prose prose-sm dark:prose-invert prose-p:leading-relaxed prose-pre:bg-background/50 prose-pre:border prose-pre:border-border")
												}
											>
												{isUser ? (
													<div className="whitespace-pre-wrap">
														{msg.content}
													</div>
												) : (
													<>
														<ReactMarkdown>
															{msg.content.replace(
																/```(?:json)?\s*[\s\S]*?\s*```/,
																"[JSON STAT BLOCK READY TO SAVE]",
															)}
														</ReactMarkdown>
														{hasJson && (
															<div className="mt-3 pt-3 border-t border-border">
																<Button
																	variant="outline"
																	size="sm"
																	className="w-full text-xs"
																	onClick={() => handleSaveToNPC(msg.content)}
																>
																	<Save className="w-3 h-3 mr-2" />
																	Save Stats to NPC Tracker
																</Button>
															</div>
														)}
													</>
												)}
											</div>
										</div>
									</div>
								);
							})}
							{isLoading && (
								<div className="flex justify-start">
									<div className="flex gap-3 max-w-[85%] flex-row">
										<div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
											<Bot className="w-4 h-4" />
										</div>
										<div className="rounded-lg p-3 text-sm bg-muted border border-border flex items-center gap-2">
											<Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
											<span className="text-muted-foreground">
												The Warden is thinking...
											</span>
										</div>
									</div>
								</div>
							)}
						</div>
					)}
				</ScrollArea>

				<div className="p-4 border-t border-border bg-background">
					<form
						onSubmit={(e) => {
							e.preventDefault();
							handleSend();
						}}
						className="flex gap-2"
					>
						<Input
							value={input}
							onChange={(e) => setInput(e.target.value)}
							placeholder="Ask The Warden..."
							disabled={isLoading}
							className="flex-1"
						/>
						<Button
							type="submit"
							size="icon"
							disabled={isLoading || !input.trim()}
						>
							<Send className="w-4 h-4" />
						</Button>
					</form>
				</div>
			</SheetContent>
		</Sheet>
	);
}
