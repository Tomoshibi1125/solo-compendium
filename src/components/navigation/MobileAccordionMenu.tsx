import { ChevronDown, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Drawer } from "vaul";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { navigationConfig } from "./navigationConfig";

interface MobileMenuProps {
	isOpen: boolean;
	onClose: () => void;
	user?: unknown;
}

export function MobileAccordionMenu({
	isOpen,
	onClose,
	user,
}: MobileMenuProps) {
	const [openSection, setOpenSection] = useState<string | null>(null);
	const location = useLocation();

	if (!isOpen) return null;

	const toggleSection = (title: string) => {
		setOpenSection((prev) => (prev === title ? null : title));
	};

	const isActive = (path?: string) => {
		if (!path) return false;
		return (
			location.pathname === path || location.pathname.startsWith(`${path}/`)
		);
	};

	return (
		<Drawer.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<Drawer.Portal>
				<Drawer.Overlay className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50" />
				<Drawer.Content className="bg-background flex flex-col rounded-t-[20px] h-[85vh] mt-24 fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 shadow-2xl focus:outline-none">
					<div className="p-4 bg-background rounded-t-[20px] flex-1 overflow-y-auto w-full max-w-md mx-auto relative">
						{/* Drag Handle */}
						<div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted-foreground/30 mb-8" />

						{/* Header */}
						<div className="flex items-center justify-between pb-4 border-b border-border/50">
							<span className="font-bold tracking-wider uppercase text-sm font-heading text-primary">
								System Protocol
							</span>
							<Button
								variant="ghost"
								size="icon"
								onClick={onClose}
								className="rounded-full"
							>
								<X className="h-5 w-5" />
							</Button>
						</div>

						{/* Content */}
						<div className="flex-1 py-4 space-y-2">
							{navigationConfig.map((item) => (
								<div
									key={item.title}
									className="border-b border-border/20 pb-2"
								>
									{item.href && !item.items ? (
										<Link
											to={item.href}
											onClick={onClose}
											className={cn(
												"block px-4 py-3 font-bold tracking-wide rounded-md transition-colors",
												isActive(item.href)
													? "text-primary bg-primary/10"
													: "text-foreground hover:bg-muted/10",
											)}
										>
											{item.title}
										</Link>
									) : (
										<div>
											<button
												type="button"
												onClick={() => toggleSection(item.title)}
												className={cn(
													"w-full flex items-center justify-between px-4 py-3 font-bold tracking-wide transition-colors rounded-md",
													openSection === item.title
														? "text-primary bg-primary/5"
														: "text-foreground hover:bg-muted/10",
												)}
											>
												{item.title}
												<ChevronDown
													className={cn(
														"h-4 w-4 transition-transform",
														openSection === item.title
															? "rotate-180 text-primary"
															: "text-muted-foreground",
													)}
												/>
											</button>
											{/* Accordion Content */}
											{openSection === item.title && item.items && (
												<div className="px-4 pb-2 pt-1 animate-in slide-in-from-top-2 duration-200">
													{item.items.map((subItem) => {
														const Icon = subItem.icon as React.ComponentType<{
															className?: string;
														}>;
														return (
															<Link
																key={subItem.title}
																to={subItem.href}
																onClick={onClose}
																className="flex items-center gap-3 py-2.5 text-sm text-foreground/80 hover:text-primary transition-colors ml-4"
															>
																{Icon && (
																	<Icon className="h-4 w-4 text-primary/70" />
																)}
																{subItem.title}
															</Link>
														);
													})}
												</div>
											)}
										</div>
									)}
								</div>
							))}
						</div>

						{/* Footer (Profile/Login) */}
						{!user && (
							<div className="pt-6 pb-8 border-t border-border/50 mt-4">
								<Link
									to="/login"
									onClick={onClose}
									className="block w-full text-center py-3 px-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 shadow-lg"
								>
									Sign In
								</Link>
							</div>
						)}
					</div>
				</Drawer.Content>
			</Drawer.Portal>
		</Drawer.Root>
	);
}
