import type React from "react";
import "@/styles/source-book.css";

interface SourceBookPageProps {
	title: string;
	subtitle?: string;
	children: React.ReactNode;
	showDropCap?: boolean;
}

export const SourceBookPage: React.FC<SourceBookPageProps> = ({
	title,
	subtitle,
	children,
	showDropCap = false,
}) => {
	// Extract the first character for the drop cap if enabled
	let content = children;
	let firstChar = "";

	if (showDropCap && typeof children === "string") {
		firstChar = children.charAt(0);
		content = children.substring(1);
	} else if (
		showDropCap &&
		Array.isArray(children) &&
		typeof children[0] === "string"
	) {
		firstChar = children[0].charAt(0);
		const firstString = children[0].substring(1);
		content = [firstString, ...children.slice(1)];
	}

	return (
		<div className="digital-parchment p-8 lg:p-12 min-h-[80vh] mb-12 shadow-2xl">
			<div className="max-w-5xl mx-auto">
				<header className="mb-8">
					<h1 className="sb-h1">{title}</h1>
					{subtitle && (
						<p className="text-xl text-cyan/70 -mt-6 mb-8 uppercase tracking-widest font-heading">
							{subtitle}
						</p>
					)}
				</header>

				<div className="sb-columns text-lg leading-relaxed text-foreground/90 font-body">
					{showDropCap && firstChar && (
						<span className="sb-drop-cap">{firstChar}</span>
					)}
					{content}
				</div>
			</div>
		</div>
	);
};
