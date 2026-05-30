import { Compass, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { AscendantText } from "@/components/ui/AscendantText";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useFieldRoster } from "@/hooks/useFieldRoster";

/**
 * Misty Pearl E4 — Field Roster page (public campaign discovery).
 *
 * Browse Wardens' opt-in open seats. Joining still requires the
 * Warden's approval via the existing share-code redemption flow, so
 * this page is a soft-discovery surface rather than auto-join.
 *
 * RA theming: "Field Roster" = Bureau register of active Rift parties
 * seeking Ascendants.
 */
export default function FieldRoster() {
	const { data: listings = [], isLoading, error } = useFieldRoster();

	return (
		<div className="container mx-auto max-w-5xl px-4 py-6 space-y-6">
			<header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
				<div>
					<h1 className="font-resurge text-2xl tracking-wide flex items-center gap-2">
						<Compass className="w-6 h-6 text-primary" />
						BUREAU FIELD ROSTER
					</h1>
					<AscendantText className="block mt-2 text-sm text-muted-foreground max-w-2xl">
						Active Rift parties seeking Ascendants. Wardens publish their open
						seats here; joining still requires the Warden's approval through
						their share code.
					</AscendantText>
				</div>
			</header>

			{isLoading && (
				<p className="text-sm text-muted-foreground animate-pulse">
					Querying the Bureau register…
				</p>
			)}

			{error && (
				<p className="text-sm text-destructive">
					Could not load the Field Roster. Try again in a moment.
				</p>
			)}

			{!isLoading && !error && listings.length === 0 && (
				<AscendantWindow title="NO OPEN POSTS">
					<p className="text-sm text-muted-foreground">
						No Warden has listed an open campaign right now. Check back later,
						or ask a Warden directly to enable Field Roster discovery on their
						campaign settings.
					</p>
				</AscendantWindow>
			)}

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{listings.map((listing) => (
					<AscendantWindow
						key={listing.id}
						title={listing.name.toUpperCase()}
						className="flex flex-col"
					>
						<div className="space-y-3 flex-1">
							<p className="text-sm text-foreground/90">
								{listing.description ||
									"A Rift Ascendant campaign seeking field operatives."}
							</p>
							<div className="flex flex-wrap gap-1">
								{listing.system_tags.slice(0, 6).map((tag) => (
									<Badge key={tag} variant="outline" className="text-[10px]">
										{tag}
									</Badge>
								))}
							</div>
							<div className="flex items-center gap-2 text-xs text-muted-foreground">
								<Users className="w-3.5 h-3.5" />
								<span>
									{listing.seats_open} open seat
									{listing.seats_open === 1 ? "" : "s"}
								</span>
							</div>
						</div>
						<div className="pt-3 mt-3 border-t border-border/40 flex justify-end">
							<Button asChild size="sm">
								<Link to={`/campaigns/join/${listing.share_code}`}>
									Request to join
								</Link>
							</Button>
						</div>
					</AscendantWindow>
				))}
			</div>
		</div>
	);
}
