import { Scale } from "lucide-react";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { PageHeader } from "@/components/ui/PageHeader";

/**
 * Licenses & Attribution.
 *
 * The app's 5e-compatible mechanics derive from the System Reference
 * Document 5.1, which is licensed CC-BY-4.0 — attribution is a license
 * requirement, not a courtesy. Everything Rift Ascendant (setting, jobs,
 * regents, anomalies, prose) is original content.
 */
export default function Legal() {
	return (
		<div className="container mx-auto max-w-3xl px-4 py-6 space-y-6">
			<PageHeader
				leading={<Scale className="w-8 h-8 text-primary" />}
				title="LICENSES & ATTRIBUTION"
				description="What Rift Ascendant is built on, and the terms it honors."
			/>

			<AscendantWindow title="SYSTEM REFERENCE DOCUMENT 5.1">
				<div className="space-y-3 text-sm text-foreground/90">
					<p>
						This work includes material taken from the System Reference Document
						5.1 ("SRD 5.1") by Wizards of the Coast LLC, available at{" "}
						<a
							href="https://media.wizards.com/2023/downloads/dnd/SRD_CC_v5.1.pdf"
							target="_blank"
							rel="noreferrer"
							className="text-primary underline underline-offset-2"
						>
							media.wizards.com/2023/downloads/dnd/SRD_CC_v5.1.pdf
						</a>
						. The SRD 5.1 is licensed under the Creative Commons Attribution 4.0
						International License, available at{" "}
						<a
							href="https://creativecommons.org/licenses/by/4.0/legalcode"
							target="_blank"
							rel="noreferrer"
							className="text-primary underline underline-offset-2"
						>
							creativecommons.org/licenses/by/4.0/legalcode
						</a>
						.
					</p>
					<p className="text-muted-foreground">
						Rift Ascendant is an independent work and is not affiliated with,
						endorsed, or sponsored by Wizards of the Coast LLC.
					</p>
				</div>
			</AscendantWindow>

			<AscendantWindow title="RIFT ASCENDANT ORIGINAL CONTENT">
				<p className="text-sm text-foreground/90">
					The Rift Ascendant setting — including the Rift Age world, the
					Ascendant jobs and paths, Regents and Sovereign fusion, anomalies,
					Rifts and Thresholds, the Bureau, all narrative prose, and the Rift
					Ascendant source books — is original content of the Rift Ascendant
					Canon. It is not open game content.
				</p>
			</AscendantWindow>

			<AscendantWindow title="OPEN-SOURCE SOFTWARE">
				<p className="text-sm text-foreground/90">
					This application is built entirely on free, open-source software —
					including React, Vite, Supabase, Radix UI, Tailwind CSS, and three.js
					— each used under its respective license. Full license texts ship with
					the application's source dependencies.
				</p>
			</AscendantWindow>
		</div>
	);
}
