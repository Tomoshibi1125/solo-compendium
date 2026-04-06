import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	itemsPerPage?: number;
	totalItems?: number;
}

export function Pagination({
	currentPage,
	totalPages,
	onPageChange,
	itemsPerPage,
	totalItems,
}: PaginationProps) {
	const getPageNumbers = () => {
		const pages: (number | string)[] = [];
		const maxVisible = 7;

		if (totalPages <= maxVisible) {
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			if (currentPage <= 3) {
				for (let i = 1; i <= 5; i++) {
					pages.push(i);
				}
				pages.push("...");
				pages.push(totalPages);
			} else if (currentPage >= totalPages - 2) {
				pages.push(1);
				pages.push("...");
				for (let i = totalPages - 4; i <= totalPages; i++) {
					pages.push(i);
				}
			} else {
				pages.push(1);
				pages.push("...");
				for (let i = currentPage - 1; i <= currentPage + 1; i++) {
					pages.push(i);
				}
				pages.push("...");
				pages.push(totalPages);
			}
		}

		return pages;
	};

	const startItem =
		itemsPerPage && totalItems
			? (currentPage - 1) * itemsPerPage + 1
			: undefined;
	const endItem =
		itemsPerPage && totalItems
			? Math.min(currentPage * itemsPerPage, totalItems)
			: undefined;

	return (
		<div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
			{itemsPerPage && totalItems && (
				<div className="text-sm text-primary/70 font-heading tracking-wide">
					DATA{" "}
					<span className="text-primary">
						[{startItem} - {endItem}]
					</span>{" "}
					OF <span className="text-primary">{totalItems}</span>
				</div>
			)}
			<div className="flex items-center gap-2">
				<Button
					variant="outline"
					size="icon"
					className="border-primary/40 hover:border-primary hover:bg-primary/20 text-primary data-[disabled]:opacity-40 rounded-[2px]"
					onClick={() => onPageChange(currentPage - 1)}
					disabled={currentPage === 1}
					aria-label="Previous page"
				>
					<ChevronLeft className="w-4 h-4" />
				</Button>
				<div className="flex items-center gap-1">
					{getPageNumbers().map((page, _index) => {
						if (page === "...") {
							return (
								<span
									key={(page as { id?: string }).id || JSON.stringify(page)}
									className="px-2 text-primary/50 tracking-widest font-mono"
								>
									...
								</span>
							);
						}
						return (
							<Button
								key={page}
								variant={currentPage === page ? "default" : "outline"}
								size="icon"
								onClick={() => onPageChange(page as number)}
								className={cn(
									"min-w-[2.5rem] font-mono rounded-[2px]",
									currentPage === page
										? "bg-primary text-primary-foreground shadow-[0_0_10px_hsl(var(--primary)/0.6)]"
										: "border-primary/40 hover:border-primary hover:bg-primary/20 text-foreground",
								)}
								aria-label={`Go to page ${page}`}
								aria-current={currentPage === page ? "page" : undefined}
							>
								{page}
							</Button>
						);
					})}
				</div>
				<Button
					variant="outline"
					size="icon"
					className="border-primary/40 hover:border-primary hover:bg-primary/20 text-primary data-[disabled]:opacity-40 rounded-[2px]"
					onClick={() => onPageChange(currentPage + 1)}
					disabled={currentPage === totalPages}
					aria-label="Next page"
				>
					<ChevronRight className="w-4 h-4" />
				</Button>
			</div>
		</div>
	);
}
