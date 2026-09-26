import { useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Loader2, Send, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PopOutButton } from "@/components/ui/PopOutButton";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { CampaignMessage } from "@/hooks/useCampaignChat";
import {
	useCampaignMessages,
	useCampaignMessagesRealtime,
	useDeleteCampaignMessage,
	useSendCampaignMessage,
} from "@/hooks/useCampaignChat";
import { supabase } from "@/integrations/supabase/client";
import { getLocalUserId } from "@/lib/guestStore";
import { cn } from "@/lib/utils";

interface CampaignChatProps {
	campaignId: string;
}

export function CampaignChat({ campaignId }: CampaignChatProps) {
	const [message, setMessage] = useState("");
	const [currentUserId, setCurrentUserId] = useState<string | null>(null);
	const guestEnabled = import.meta.env.VITE_GUEST_ENABLED !== "false";
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const queryClient = useQueryClient();

	const { data: messages = [], isLoading } = useCampaignMessages(campaignId);
	const sendMessage = useSendCampaignMessage();
	const deleteMessage = useDeleteCampaignMessage();

	useEffect(() => {
		supabase.auth.getUser().then(({ data: { user } }) => {
			if (user?.id) {
				setCurrentUserId(user.id);
			} else if (guestEnabled) {
				setCurrentUserId(getLocalUserId());
			} else {
				setCurrentUserId(null);
			}
		});
	}, [guestEnabled]);

	const handleNewMessage = useRef<(message: CampaignMessage) => void>(() => {});
	useEffect(() => {
		handleNewMessage.current = (newMessage: CampaignMessage) => {
			queryClient.setQueryData(
				["campaigns", campaignId, "messages"],
				(old: CampaignMessage[] | undefined) => {
					if (!old) return [newMessage];
					if (old.some((candidate) => candidate.id === newMessage.id)) return old;
					return [...old, newMessage];
				},
			);
		};
	}, [campaignId, queryClient]);

	useCampaignMessagesRealtime(campaignId, (msg) =>
		handleNewMessage.current(msg),
	);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages.length]);

	const handleSend = async (event: React.FormEvent) => {
		event.preventDefault();
		if (!message.trim() || sendMessage.isPending) return;
		await sendMessage.mutateAsync({ campaignId, content: message });
		setMessage("");
	};

	const handleDelete = async (messageId: string) => {
		if (confirm("Delete this message?")) {
			await deleteMessage.mutateAsync({ messageId, campaignId });
		}
	};

	return (
		<AscendantWindow title="CAMPAIGN CHAT" className="h-[500px] flex flex-col">
			<div className="flex items-center justify-end p-2 border-b bg-muted/50 mb-2">
				<PopOutButton
					name={`campaign-chat-${campaignId}`}
					path={`/campaigns/${campaignId}?tab=chat`}
					label="Pop out campaign chat"
					data-testid="campaign-chat-popout"
				/>
			</div>
			<ScrollArea className="flex-1 pr-4">
				<div className="space-y-2">
					{isLoading ? (
						<div className="flex items-center justify-center py-8">
							<Loader2 className="w-6 h-6 animate-spin text-primary" />
						</div>
					) : messages.length === 0 ? (
						<p className="text-center text-muted-foreground py-8">
							No messages yet. Start the conversation!
						</p>
					) : (
						messages.map((msg) => {
							const isOwn = msg.user_id === currentUserId;
							return (
								<div
									key={msg.id}
									className={cn(
										"flex gap-2 group",
										isOwn ? "justify-end" : "justify-start",
									)}
								>
									<div
										className={cn(
											"max-w-[80%] rounded-lg p-3",
											isOwn ? "bg-primary text-primary-foreground" : "bg-muted",
										)}
									>
										<p className="text-sm whitespace-pre-wrap break-words">
											{msg.content}
										</p>
										<div className="flex items-center justify-between mt-1 gap-2">
											<span
												className={cn(
													"text-xs",
													isOwn
														? "text-primary-foreground/70"
														: "text-muted-foreground",
												)}
											>
												{formatDistanceToNow(new Date(msg.created_at), {
													addSuffix: true,
												})}
											</span>
											{isOwn && (
												<Button
													variant="ghost"
													size="icon"
													className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
													onClick={() => handleDelete(msg.id)}
													title="Delete Message"
												>
													<Trash2 className="w-3 h-3" />
												</Button>
											)}
										</div>
									</div>
								</div>
							);
						})
					)}
					<div ref={messagesEndRef} />
				</div>
			</ScrollArea>
			<form onSubmit={handleSend} className="mt-4 flex gap-2">
				<Input
					value={message}
					onChange={(event) => setMessage(event.target.value)}
					placeholder="Type a message..."
					disabled={sendMessage.isPending}
					className="flex-1"
				/>
				<Button
					type="submit"
					disabled={!message.trim() || sendMessage.isPending}
				>
					{sendMessage.isPending ? (
						<Loader2 className="w-4 h-4 animate-spin" />
					) : (
						<Send className="w-4 h-4" />
					)}
				</Button>
			</form>
		</AscendantWindow>
	);
}
