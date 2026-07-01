import { ExportMenu } from "@/components/shared/ExportMenu";
import { useToast } from "@/hooks/use-toast";
import { useCampaignNotes } from "@/hooks/useCampaignNotes";
import { useCampaignRollFeed } from "@/hooks/useCampaignRollFeed";
import { useCampaignRules } from "@/hooks/useCampaignRules";
import { useCampaignSessions } from "@/hooks/useCampaignSessions";
import { useCampaignMembers } from "@/hooks/useCampaigns";
import { useCampaignWiki } from "@/hooks/useCampaignWiki";
import {
	buildCampaignContentJson,
	buildCampaignMarkdown,
	buildSessionLogModel,
	type CampaignExportInput,
} from "@/lib/campaignExport";
import {
	buildIcsForCampaignSessions,
	downloadIcsBlob,
	type IcalSessionInput,
} from "@/lib/sessionIcalExport";

interface CampaignExportMenuProps {
	campaignId: string;
	campaignName: string;
}

/**
 * Shared-ExportMenu wrapper for a campaign — Markdown (notes + wiki + rules),
 * a portable content JSON, a pdf-lib **session-log** PDF, and an `.ics`
 * calendar. Reuses the same guest-aware hooks the campaign tabs read, so it
 * works signed-out (localStorage) as well as against Supabase.
 */
export function CampaignExportMenu({
	campaignId,
	campaignName,
}: CampaignExportMenuProps) {
	const { toast } = useToast();
	const { data: notes = [] } = useCampaignNotes(campaignId);
	const { articles: wiki } = useCampaignWiki(campaignId);
	const { data: rulesRow } = useCampaignRules(campaignId);
	const { events: rolls } = useCampaignRollFeed(campaignId);
	const { data: sessions = [] } = useCampaignSessions(campaignId);
	const { data: members = [] } = useCampaignMembers(campaignId);

	const buildInput = (): CampaignExportInput => ({
		campaignName,
		rules: rulesRow?.rules ?? null,
		members: members.map((m) => ({
			name: m.characters?.name ?? "Unlinked Ascendant",
			role: m.role,
			level: m.characters?.level ?? null,
			job: m.characters?.job ?? null,
		})),
		notes: notes.map((n) => ({
			title: n.title,
			content: n.content,
			category: n.category,
			is_shared: n.is_shared,
		})),
		wiki: wiki.map((a) => ({
			title: a.title,
			content: a.content,
			category: a.category,
		})),
		rolls: rolls.map((r) => ({
			character_name: r.character_name,
			dice_formula: r.dice_formula,
			result: r.result,
			roll_type: r.roll_type,
			context: r.context,
			created_at: r.created_at,
		})),
	});

	const exportPdf = async () => {
		try {
			const { downloadCampaignSessionLogPdf } = await import(
				"@/lib/campaignPdf"
			);
			await downloadCampaignSessionLogPdf(
				buildSessionLogModel(buildInput()),
				campaignName,
			);
		} catch (error) {
			toast({
				title: "PDF export failed",
				description: error instanceof Error ? error.message : "Unknown error",
				variant: "destructive",
			});
		}
	};

	const exportIcs = () => {
		try {
			const inputs: IcalSessionInput[] = sessions.map((s) => ({
				id: s.id,
				title: s.title,
				description: s.description,
				scheduled_for: s.scheduled_for,
				location: s.location,
				recurrence_rule: s.recurrence_rule ?? null,
				recurrence_parent_id: s.recurrence_parent_id ?? null,
			}));
			downloadIcsBlob(
				buildIcsForCampaignSessions(inputs, { campaignName }),
				campaignName,
			);
		} catch (error) {
			toast({
				title: "Calendar export failed",
				description: error instanceof Error ? error.message : "Unknown error",
				variant: "destructive",
			});
		}
	};

	return (
		<ExportMenu
			baseName={campaignName || "campaign"}
			label="Export"
			markdown={() => buildCampaignMarkdown(buildInput())}
			json={() => buildCampaignContentJson(buildInput())}
			pdf={exportPdf}
			ics={exportIcs}
		/>
	);
}
