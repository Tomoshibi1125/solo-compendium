import type { LucideIcon } from "lucide-react";
import {
	ChevronLeft,
	ChevronRight,
	LogOut,
	Shield,
	Sparkles,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useAppStore } from "@/hooks/useAppStore";
import { useAuth } from "@/lib/auth/authContext";
import { cn } from "@/lib/utils";
import { navigationConfig } from "./navigationConfig";

export function AppSidebar() {
	const location = useLocation();
	const { user, signOut } = useAuth();
	const {
		sidebarOpen,
		setSidebarOpen,
		sidebarCollapsed,
		toggleSidebarCollapsed,
	} = useAppStore();

	const activePath = location.pathname;

	const renderNavItems = (collapsed: boolean) => (
		<div className="flex flex-col gap-4 py-4">
			{navigationConfig.map((section) => (
				<div key={section.title} className="px-3">
					{!collapsed && (
						<h2 className="mb-2 px-4 text-xs font-mono font-bold tracking-[0.2em] text-primary/40 uppercase">
							{section.title}
						</h2>
					)}
					<div className="space-y-1">
						{section.items?.map((item) => {
							const Icon = (item.icon as LucideIcon) || Sparkles;
							const isActive =
								item.href === "/"
									? activePath === "/"
									: activePath.startsWith(item.href);

							return (
								<Link key={item.title} to={item.href}>
									<Button
										variant="ghost"
										className={cn(
											"w-full justify-start gap-4 transition-all duration-300 relative group overflow-hidden",
											collapsed ? "px-2 justify-center" : "px-4",
											isActive
												? "bg-primary/10 text-primary border-r-2 border-primary"
												: "text-foreground/70 hover:text-foreground hover:bg-primary/5",
										)}
										title={collapsed ? item.title : undefined}
									>
										<Icon
											className={cn(
												"h-5 w-5 transition-transform group-hover:scale-110",
												isActive ? "text-primary shadow-glow" : "",
											)}
										/>
										{!collapsed && (
											<span className="font-heading font-medium truncate">
												{item.title}
											</span>
										)}
										{isActive && (
											<div className="absolute inset-0 bg-primary/5 animate-pulse-glow pointer-events-none" />
										)}
									</Button>
								</Link>
							);
						})}
					</div>
					{!collapsed && <Separator className="my-4 bg-primary/10" />}
				</div>
			))}
		</div>
	);

	return (
		<>
			{/* Mobile Drawer */}
			<Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
				<SheetContent side="left" className="p-0 border-r-primary/20 w-72">
					<div className="flex flex-col h-full bg-black/40 backdrop-blur-xl">
						<div className="p-6 border-b border-primary/10">
							<div className="flex items-center gap-3">
								<div className="w-8 h-8 rounded-[2px] bg-primary/20 border border-primary/40 flex items-center justify-center">
									<Shield className="w-5 h-5 text-primary" />
								</div>
								<span className="font-display font-bold tracking-widest text-sm uppercase">
									System Protocol
								</span>
							</div>
						</div>
						<ScrollArea className="flex-1">{renderNavItems(false)}</ScrollArea>
						<div className="p-4 border-t border-primary/10 space-y-2">
							{user && (
								<div className="flex items-center gap-3 p-2 bg-primary/5 rounded-[2px] border border-primary/10 mb-4">
									<Avatar className="h-8 w-8 border border-primary/20">
										<AvatarImage src={user.avatar || undefined} />
										<AvatarFallback>
											{user.email?.substring(0, 2).toUpperCase()}
										</AvatarFallback>
									</Avatar>
									<div className="flex-1 overflow-hidden">
										<p className="text-xs font-bold truncate">
											{user.displayName || "Ascendant"}
										</p>
										<p className="text-[10px] text-muted-foreground truncate">
											{user.email}
										</p>
									</div>
								</div>
							)}
							<Button
								variant="ghost"
								className="w-full justify-start gap-4 text-destructive hover:text-destructive hover:bg-destructive/10"
								onClick={() => signOut()}
							>
								<LogOut className="h-5 w-5" />
								<span>Terminate Session</span>
							</Button>
						</div>
					</div>
				</SheetContent>
			</Sheet>

			{/* Desktop Sidebar Rail */}
			<aside
				className={cn(
					"hidden lg:flex flex-col h-screen sticky top-0 border-r border-primary/20 bg-black/20 backdrop-blur-md transition-all duration-500 z-30 group/sidebar",
					sidebarCollapsed ? "w-16" : "w-64",
				)}
			>
				{/* Sidebar Toggle Button */}
				<button
					type="button"
					onClick={toggleSidebarCollapsed}
					className="absolute -right-3 top-8 w-6 h-6 rounded-full bg-black border border-primary/40 text-primary flex items-center justify-center hover:bg-primary hover:text-black transition-all z-40 opacity-0 group-hover/sidebar:opacity-100"
				>
					{sidebarCollapsed ? (
						<ChevronRight className="w-4 h-4" />
					) : (
						<ChevronLeft className="w-4 h-4" />
					)}
				</button>

				<div className="p-4 border-b border-primary/10 h-16 flex items-center">
					<div className="flex items-center gap-3 overflow-hidden">
						<div className="min-w-[32px] w-8 h-8 rounded-[2px] bg-primary/20 border border-primary/40 flex items-center justify-center">
							<Shield className="w-5 h-5 text-primary" />
						</div>
						{!sidebarCollapsed && (
							<span className="font-display font-bold tracking-widest text-sm uppercase truncate animate-in fade-in slide-in-from-left-2 duration-500">
								Warden
							</span>
						)}
					</div>
				</div>

				<ScrollArea className="flex-1">
					{renderNavItems(sidebarCollapsed)}
				</ScrollArea>

				<div className="p-4 border-t border-primary/10">
					{user && (
						<div className="flex items-center gap-3 mb-2 overflow-hidden px-1">
							<Avatar className="h-8 w-8 border border-primary/20 shrink-0">
								<AvatarImage src={user.avatar || undefined} />
								<AvatarFallback>
									{user.email?.substring(0, 2).toUpperCase()}
								</AvatarFallback>
							</Avatar>
							{!sidebarCollapsed && (
								<div className="flex-1 overflow-hidden animate-in fade-in duration-500">
									<p className="text-xs font-bold truncate">
										{user.displayName || "Ascendant"}
									</p>
									<p className="text-[10px] text-muted-foreground truncate">
										{user.email}
									</p>
								</div>
							)}
						</div>
					)}
					<Button
						variant="ghost"
						className={cn(
							"w-full justify-start gap-4 text-foreground/70 hover:text-destructive hover:bg-destructive/10 transition-colors",
							sidebarCollapsed && "px-0 justify-center",
						)}
						onClick={() => signOut()}
						title={sidebarCollapsed ? "Sign Out" : undefined}
					>
						<LogOut className="h-5 w-5" />
						{!sidebarCollapsed && <span>Sign Out</span>}
					</Button>
				</div>

				{/* Scanner Line Overlay */}
				<div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-transparent via-primary/20 to-transparent" />
			</aside>
		</>
	);
}
