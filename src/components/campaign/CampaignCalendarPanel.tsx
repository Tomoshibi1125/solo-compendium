import { Clock, RotateCcw, Sun } from "lucide-react";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Button } from "@/components/ui/button";
import { useCampaignCalendar } from "@/hooks/useCampaignCalendar";
import { formatClock, formatRiftCyclePip } from "@/lib/campaignCalendar";

/**
 * Misty Pearl H5 — Bureau Field Calendar panel.
 *
 * Tracks the campaign's in-world date/time + Rift Cycle pip.
 * Embeddable in CampaignDetail and the Warden Tools sheet. State
 * persists via `useCampaignCalendar` → `useCampaignToolState`
 * (always-on local mirror invariant preserved).
 */
export interface CampaignCalendarPanelProps {
	campaignId: string;
	canManage: boolean;
}

export function CampaignCalendarPanel({
	campaignId,
	canManage,
}: CampaignCalendarPanelProps) {
	const { clock, advanceHours, advanceMinutes, takeRest, resetCycle } =
		useCampaignCalendar(campaignId);

	return (
		<AscendantWindow title="BUREAU FIELD CALENDAR">
			<section
				className="space-y-3"
				data-testid="campaign-calendar-panel"
				aria-label="Bureau Field Calendar"
			>
				<div>
					<p
						className="font-resurge text-[11px] uppercase tracking-[0.4em] text-primary/80"
						id="campaign-calendar-time-label"
					>
						Standard Bureau Time
					</p>
					<p
						className="font-heading text-xl tracking-wide"
						data-testid="campaign-calendar-clock"
						aria-live="polite"
					>
						{formatClock(clock)}
					</p>
				</div>
				<div>
					<p
						className="font-resurge text-[11px] uppercase tracking-[0.4em] text-primary/80"
						id="campaign-calendar-pip-label"
					>
						Rift Cycle
					</p>
					<p
						className="font-mono text-base text-amber-300"
						data-testid="campaign-calendar-pip"
						aria-live="polite"
					>
						{formatRiftCyclePip(clock)}
					</p>
				</div>
				{canManage && (
					<div className="space-y-2 pt-2 border-t border-border/40">
						<div className="flex flex-wrap gap-1.5">
							<Button
								size="sm"
								variant="outline"
								onClick={() => advanceMinutes(10)}
								data-testid="campaign-calendar-advance-10m"
							>
								<Clock className="w-3.5 h-3.5 mr-1" />
								+10 min
							</Button>
							<Button
								size="sm"
								variant="outline"
								onClick={() => advanceHours(1)}
								data-testid="campaign-calendar-advance-1h"
							>
								<Clock className="w-3.5 h-3.5 mr-1" />
								+1 h
							</Button>
							<Button
								size="sm"
								variant="outline"
								onClick={() => takeRest("short")}
								title="Short rest (1 hour)"
								data-testid="campaign-calendar-short-rest"
							>
								Short rest
							</Button>
							<Button
								size="sm"
								variant="outline"
								onClick={() => takeRest("watch")}
								title="Watch (2 hours)"
								data-testid="campaign-calendar-watch"
							>
								Watch
							</Button>
							<Button
								size="sm"
								variant="outline"
								onClick={() => takeRest("long")}
								title="Long rest (8 hours, +1 Rift cycle pip)"
								data-testid="campaign-calendar-long-rest"
							>
								<Sun className="w-3.5 h-3.5 mr-1" />
								Long rest
							</Button>
							<Button
								size="sm"
								variant="ghost"
								onClick={resetCycle}
								title="Resolve a Rift surge — pip resets to 0"
								data-testid="campaign-calendar-reset-cycle"
							>
								<RotateCcw className="w-3.5 h-3.5 mr-1" />
								Resolve surge
							</Button>
						</div>
					</div>
				)}
			</section>
		</AscendantWindow>
	);
}
