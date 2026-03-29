import type React from "react";
import "@/styles/source-book.css";

import { ProtocolBroadcastButton } from "./ProtocolBroadcastButton";

interface CalloutProps {
	title: string;
	children: React.ReactNode;
	type?: "sidebar" | "table";
	systemInteraction?: string;
}

export const SourceBookCallout: React.FC<CalloutProps> = ({
	title,
	children,
	type = "sidebar",
	systemInteraction,
}) => {
	return (
		<div className={`sb-sidebar ${type === "table" ? "sb-table-style" : ""}`}>
			<div className="sb-sidebar-title flex items-center justify-between gap-4">
				<span>{title}</span>
				{systemInteraction && (
					<ProtocolBroadcastButton content={systemInteraction} />
				)}
			</div>
			<div className="sb-sidebar-content">
				{systemInteraction && (
					<div className="mb-3 p-2 bg-red-900/10 border-l-2 border-red-500/50 text-[11px] font-mono text-cyan/90 break-words font-semibold">
						{systemInteraction}
					</div>
				)}
				{children}
			</div>
		</div>
	);
};
