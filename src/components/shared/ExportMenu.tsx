import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	downloadCsv,
	downloadJson,
	downloadMarkdown,
	printViaBookBrand,
} from "@/lib/toolExport";
// Importing the print stylesheet here means any page that renders an
// <ExportMenu> with a Print option automatically gets the book-brand rules.
import "@/styles/book-print.css";

type Resolvable<T> = T | (() => T);
const resolve = <T,>(value: Resolvable<T>): T =>
	typeof value === "function" ? (value as () => T)() : value;

interface CsvInput {
	rows: ReadonlyArray<Record<string, unknown>>;
	columns?: ReadonlyArray<string>;
}

type ButtonVariant = "default" | "outline" | "ghost" | "secondary";
type ButtonSize = "default" | "sm" | "lg" | "icon";

interface ExportMenuProps {
	/** Base filename (slugified) for every download. */
	baseName: string;
	/** Markdown string (or factory) → `.md`. */
	markdown?: Resolvable<string>;
	/** Any JSON-serializable value (or factory) → `.json`. */
	json?: Resolvable<unknown>;
	/** Row objects (or factory) → `.csv`. */
	csv?: Resolvable<CsvInput>;
	/**
	 * Print / Save-as-PDF. Pass `{ selector }` to apply the book-brand print
	 * stylesheet to that element, or a function for fully custom print logic.
	 */
	print?: { selector?: string } | (() => void);
	/**
	 * Real downloadable `.pdf` file (e.g. a pdf-lib render). Action callback —
	 * the caller owns the download. Distinct from `print` (browser dialog).
	 */
	pdf?: () => void | Promise<void>;
	/** Calendar `.ics` export. Action callback — the caller owns the download. */
	ics?: () => void | Promise<void>;
	label?: string;
	disabled?: boolean;
	align?: "start" | "center" | "end";
	variant?: ButtonVariant;
	size?: ButtonSize;
	className?: string;
}

/**
 * Shared export affordance — the same md / json / csv / print menu used across
 * every system so they all expose identical, best-in-class export options.
 * Renders nothing if no formats are provided.
 */
export function ExportMenu({
	baseName,
	markdown,
	json,
	csv,
	print,
	pdf,
	ics,
	label = "Export",
	disabled,
	align = "end",
	variant = "outline",
	size = "sm",
	className,
}: ExportMenuProps) {
	const hasMd = markdown !== undefined;
	const hasJson = json !== undefined;
	const hasCsv = csv !== undefined;
	const hasPrint = print !== undefined;
	const hasPdf = pdf !== undefined;
	const hasIcs = ics !== undefined;
	if (!hasMd && !hasJson && !hasCsv && !hasPrint && !hasPdf && !hasIcs)
		return null;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					type="button"
					variant={variant}
					size={size}
					disabled={disabled}
					className={className}
				>
					<Download className="w-4 h-4 mr-2" />
					{label}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align={align}>
				<DropdownMenuLabel>Export</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{hasMd && (
					<DropdownMenuItem
						onClick={() => downloadMarkdown(baseName, resolve(markdown))}
					>
						Markdown (.md)
					</DropdownMenuItem>
				)}
				{hasJson && (
					<DropdownMenuItem
						onClick={() => downloadJson(baseName, resolve(json))}
					>
						JSON (.json)
					</DropdownMenuItem>
				)}
				{hasCsv && (
					<DropdownMenuItem
						onClick={() => {
							const data = resolve(csv);
							downloadCsv(baseName, data.rows, data.columns);
						}}
					>
						CSV (.csv)
					</DropdownMenuItem>
				)}
				{hasPdf && (
					<DropdownMenuItem onClick={() => void pdf?.()}>
						PDF (.pdf)
					</DropdownMenuItem>
				)}
				{hasIcs && (
					<DropdownMenuItem onClick={() => void ics?.()}>
						Calendar (.ics)
					</DropdownMenuItem>
				)}
				{hasPrint && (
					<DropdownMenuItem
						onClick={() => {
							if (typeof print === "function") print();
							else printViaBookBrand(print?.selector);
						}}
					>
						Print / PDF
					</DropdownMenuItem>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
