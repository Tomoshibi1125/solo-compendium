import { Menu, Search, Volume2, VolumeX, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SyncStatusIndicator } from "@/components/shared/SyncStatusIndicator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GlobalSearch } from "@/components/ui/GlobalSearch";
import { NotificationCenter } from "@/components/ui/NotificationCenter";
import { RaLogo } from "@/components/ui/RaLogo";
import { useAppStore } from "@/hooks/useAppStore";
import { useAuth } from "@/lib/auth/authContext";

export function NavBar() {
	const { user, signOut } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const { soundEnabled, setSoundEnabled, setSidebarOpen } = useAppStore();
	const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

	const isAuthPage =
		location.pathname.startsWith("/login") ||
		location.pathname.startsWith("/auth") ||
		location.pathname.startsWith("/setup");

	if (isAuthPage) {
		return null;
	}

	const handleLogout = async () => {
		await signOut();
		navigate("/login");
	};

	return (
		<header className="sticky top-0 z-40 w-full border-b border-primary/20 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 shadow-sm transition-all duration-300">
			<div className="flex h-16 items-center justify-between px-4 lg:px-8">
				{/* Sidebar Toggle & Mobile Logo */}
				<div className="flex items-center gap-4">
					<Button
						variant="ghost"
						size="icon"
						className="lg:hidden min-h-[44px] min-w-[44px] hover:bg-primary/10 transition-colors"
						onClick={() => setSidebarOpen(true)}
						aria-label="Open sidebar"
					>
						<Menu className="h-5 w-5 text-primary" />
					</Button>

					<Link
						to="/"
						className="flex items-center gap-2 transition-opacity hover:opacity-80"
					>
						<RaLogo variant="mark" still className="h-8 w-8" />
						<span className="hidden sm:inline-block font-display font-bold tracking-widest uppercase text-sm">
							Rift Ascendant
						</span>
					</Link>
				</div>

				{/* Center Spacer / Breadcrumbs could go here in future */}
				<div className="hidden lg:flex flex-1" />

				{/* Right Actions: Search, Notifications, User Profile */}
				<div className="flex items-center gap-2 sm:gap-4">
					<Button
						variant="ghost"
						size="icon"
						className="md:hidden min-h-[44px] min-w-[44px] text-muted-foreground hover:text-primary"
						onClick={() => setMobileSearchOpen((v) => !v)}
						aria-label={mobileSearchOpen ? "Close search" : "Open search"}
						aria-expanded={mobileSearchOpen}
					>
						{mobileSearchOpen ? (
							<X className="h-5 w-5" />
						) : (
							<Search className="h-5 w-5" />
						)}
					</Button>

					<GlobalSearch className="hidden md:block w-48 lg:w-64" />

					<Button
						variant="ghost"
						size="icon"
						onClick={() => setSoundEnabled(!soundEnabled)}
						className="text-muted-foreground hover:text-primary transition-colors hidden sm:flex"
						title={soundEnabled ? "Mute Sounds" : "Enable Sounds"}
					>
						{soundEnabled ? (
							<Volume2 className="h-4 w-4" />
						) : (
							<VolumeX className="h-4 w-4" />
						)}
					</Button>

					<SyncStatusIndicator className="hidden sm:flex" />

					<NotificationCenter />

					{user ? (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									className="relative h-10 w-10 rounded-full border border-primary/20 hover:border-primary/50 transition-colors"
								>
									<Avatar className="h-9 w-9">
										<AvatarImage src={user.avatar ?? undefined} />
										<AvatarFallback className="bg-primary/20 text-primary font-bold">
											{(user.displayName || user.email || "U")
												.substring(0, 2)
												.toUpperCase()}
										</AvatarFallback>
									</Avatar>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								className="w-56 bg-obsidian-charcoal/95 backdrop-blur-xl border-primary/20"
								align="end"
								forceMount
							>
								<div className="flex flex-col space-y-1 p-2 border-b border-primary/10 mb-1">
									<p className="font-medium font-heading text-sm">
										{user.displayName || "Ascendant"}
									</p>
									<p className="text-xs text-muted-foreground truncate">
										{user.email}
									</p>
								</div>
								<DropdownMenuItem
									onClick={() => navigate("/profile")}
									className="cursor-pointer focus:bg-primary/10 transition-colors"
								>
									<span>Profile</span>
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={handleLogout}
									className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10 transition-colors"
								>
									<span>Sign Out</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					) : (
						<Button
							onClick={() => navigate("/login")}
							variant="outline"
							size="sm"
							className="hidden sm:flex font-bold tracking-wide border-primary/40 text-primary hover:bg-primary/10"
						>
							Login
						</Button>
					)}
				</div>
			</div>

			{/* Mobile search row: GlobalSearch is hidden < md, so reveal it here
			    when the search button is tapped. */}
			{mobileSearchOpen && (
				<div className="md:hidden px-4 pb-3">
					<GlobalSearch className="w-full" />
				</div>
			)}
		</header>
	);
}
