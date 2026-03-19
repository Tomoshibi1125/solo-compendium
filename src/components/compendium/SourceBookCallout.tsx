import type React from "react";
import "@/styles/source-book.css";

interface CalloutProps {
	title: string;
	children: React.ReactNode;
	type?: "sidebar" | "table";
}

export const SourceBookCallout: React.FC<CalloutProps> = ({
	title,
	children,
	type = "sidebar",
}) => {
	return (
		<div className={`sb-sidebar ${type === "table" ? "sb-table-style" : ""}`}>
			<div className="sb-sidebar-title">{title}</div>
			<div className="sb-sidebar-content">{children}</div>
		</div>
	);
};
