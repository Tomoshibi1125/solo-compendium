import { useState, useEffect, useRef } from 'react';
import { Send, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCampaignMessages, useSendCampaignMessage, useDeleteCampaignMessage, useCampaignMessagesRealtime } from '@/hooks/useCampaignChat';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import type { CampaignMessage } from '@/hooks/useCampaignChat';

interface CampaignChatProps {
  campaignId: string;
}

export function CampaignChat({ campaignId }: CampaignChatProps) {
  const [message, setMessage] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data: messages = [], isLoading } = useCampaignMessages(campaignId);
  const sendMessage = useSendCampaignMessage();
  const deleteMessage = useDeleteCampaignMessage();

  // Get current user ID
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentUserId(user?.id || null);
    });
  }, []);

  // Real-time updates handler
  const handleNewMessage = useRef<(message: CampaignMessage) => void>(() => {});

  useEffect(() => {
    handleNewMessage.current = (newMessage: CampaignMessage) => {
      queryClient.setQueryData(['campaigns', campaignId, 'messages'], (old: CampaignMessage[] | undefined) => {
        if (!old) return [newMessage];
        // Check if message already exists
        if (old.some(m => m.id === newMessage.id)) return old;
        return [...old, newMessage];
      });
    };
  }, [campaignId, queryClient]);

  useCampaignMessagesRealtime(campaignId, (msg) => handleNewMessage.current(msg));

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || sendMessage.isPending) return;

    await sendMessage.mutateAsync({ campaignId, message });
    setMessage('');
  };

  const handleDelete = async (messageId: string) => {
    if (confirm('Delete this message?')) {
      await deleteMessage.mutateAsync({ messageId, campaignId });
    }
  };

  return (
    <SystemWindow title="CAMPAIGN CHAT" className="h-[500px] flex flex-col">
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
                    isOwn ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg p-3",
                      isOwn
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">{msg.message}</p>
                    <div className="flex items-center justify-between mt-1 gap-2">
                      <span className={cn(
                        "text-xs",
                        isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
                      )}>
                        {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                      </span>
                      {isOwn && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleDelete(msg.id)}
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
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          disabled={sendMessage.isPending}
          className="flex-1"
        />
        <Button type="submit" disabled={!message.trim() || sendMessage.isPending}>
          {sendMessage.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </form>
    </SystemWindow>
  );
}

