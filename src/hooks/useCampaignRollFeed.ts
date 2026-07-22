import type { RealtimeChannel } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth/authContext";
import {
	type CampaignRollEventRow,
	listLocalCampaignRollEvents,
} from "@/lib/campaignRollEvents";
import { clientChannelName } from "@/lib/realtimeChannel";

/**
 * Subscribe to the campaign's shared roll feed ("Game Log").
 * Cloud mode reads `campaign_roll_events` + a Realtime INSERT subscription;
 * guest/local mode polls the shared localStorage store that
 * `publishCampaignRollEvent` writes.
 */
export function useCampaignRollFeed(campaignId: string) {
	const [events, setEvents] = useState<CampaignRollEventRow[]>([]);
	const [isConnected, setIsConnected] = useState(false);
	const { user } = useAuth();

	// Load initial events
	useEffect(() => {
		if (!campaignId) return;

		const loadInitial = async () => {
			if (!isSupabaseConfigured || !user) {
				setEvents(listLocalCampaignRollEvents(campaignId));
				return;
			}

			const { data, error } = await supabase
				.from("campaign_roll_events")
				.select("*")
				.eq("campaign_id", campaignId)
				.order("created_at", { ascending: false })
				.limit(50);

			if (!error && data) {
				setEvents(data);
			} else {
				setEvents(listLocalCampaignRollEvents(campaignId));
			}
		};

		loadInitial();
	}, [campaignId, user]);

	// Subscribe to real-time inserts
	useEffect(() => {
		if (!campaignId || !isSupabaseConfigured || !user) return;

		let channel: RealtimeChannel | null = null;

		const subscribe = () => {
			channel = supabase
				.channel(clientChannelName(`campaign-rolls:${campaignId}`))
				.on(
					"postgres_changes",
					{
						event: "INSERT",
						schema: "public",
						table: "campaign_roll_events",
						filter: `campaign_id=eq.${campaignId}`,
					},
					(payload) => {
						const newEvent = payload.new as CampaignRollEventRow;
						setEvents((prev) => [newEvent, ...prev].slice(0, 50));
					},
				)
				.subscribe((status) => {
					setIsConnected(status === "SUBSCRIBED");
				});
		};

		subscribe();

		return () => {
			if (channel) {
				supabase.removeChannel(channel);
			}
		};
	}, [campaignId, user]);

	// Local mode: poll localStorage
	useEffect(() => {
		if (!campaignId || (isSupabaseConfigured && user)) return;

		const interval = setInterval(() => {
			setEvents(listLocalCampaignRollEvents(campaignId));
		}, 2000);

		return () => clearInterval(interval);
	}, [campaignId, user]);

	return { events, isConnected };
}
