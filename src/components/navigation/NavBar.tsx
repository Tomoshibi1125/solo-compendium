import { LogOut, Menu, Settings, User } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
import { SystemSigilLogo } from "@/components/ui/SystemSigilLogo";
import { useAuth } from "@/lib/auth/authContext";
import { logger } from "@/lib/logger";
import { MegaMenu } from "./MegaMenu";
import { MobileAccordionMenu } from "./MobileAccordionMenu";

export function NavBar() {
	const { user, signOut } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	// Don't show the global nav on login or setup pages if desired,
	// but usually it's better to show it or keep it simple. We'll show it everywhere except Auth pages where it might be distracting.
	const isAuthPage =
		location.pathname.startsWith("/login") ||
		location.pathname.startsWith("/auth") ||
		location.pathname.startsWith("/setup");

	if (isAuthPage) {
		return null;
	}

	const handleLogout = async () => {
		try {
			await signOut();
			navigate("/login");
		} catch (error) {
			logger.error("Error logging out", error);
		}
	};

	const closeMobileMenu = () => setMobileMenuOpen(false);

	return (
		<>
			<header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
				<div className="flex h-16 items-center justify-between px-4 lg:px-8">
					{/* Logo & Mobile Menu Toggle */}
					<div className="flex items-center gap-4">
						<Button
							variant="ghost"
							size="icon"
							className="lg:hidden min-h-[44px] min-w-[44px]"
							onClick={() => setMobileMenuOpen(true)}
							aria-label="Open menu"
						>
							<Menu className="h-5 w-5" />
						</Button>

						<Link
							to="/"
							className="flex items-center gap-2 transition-opacity hover:opacity-80"
						>
							<SystemSigilLogo className="h-8 w-8 text-primary shadow-primary/20 drop-shadow-md" />
							<span className="hidden sm:inline-block font-system font-bold tracking-widest uppercase text-sm">
								System Ascendant
							</span>
						</Link>
					</div>

					{/* Desktop Mega Menu */}
					<div className="hidden lg:flex flex-1 justify-center h-full">
						<MegaMenu />
					</div>

					{/* Right Actions: Search, Notifications, User Profile */}
					<div className="flex items-center gap-2 sm:gap-4">
						<GlobalSearch className="hidden md:block w-48 lg:w-64" />
						<NotificationCenter />

						{user ? (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="ghost"
										className="relative h-10 w-10 rounded-full border border-border/50 hover:border-primary/50 transition-colors"
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
								<DropdownMenuContent className="w-56" align="end" forceMount>
									<div className="flex flex-col space-y-1 p-2 border-b border-border/50 mb-1">
										<p className="font-medium font-system text-sm">
											{user.displayName || "Ascendant"}
										</p>
										<p className="text-xs text-muted-foreground truncate">
											{user.email}
										</p>
									</div>
									<DropdownMenuItem
										onClick={() => navigate("/profile")}
										className="cursor-pointer"
									>
										<User className="mr-2 h-4 w-4" />
										<span>Profile</span>
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() => navigate("/profile")}
										className="cursor-pointer"
									>
										<Settings className="mr-2 h-4 w-4" />
										<span>Settings</span>
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={handleLogout}
										className="cursor-pointer text-destructive focus:text-destructive"
									>
										<LogOut className="mr-2 h-4 w-4" />
										<span>Sign Out</span>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						) : (
							<Button
								onClick={() => navigate("/login")}
								variant="arise"
								size="sm"
								className="hidden sm:flex font-bold tracking-wide"
							>
								Login
							</Button>
						)}
					</div>
				</div>
			</header>

			{/* Mobile Accordion Menu Drawer */}
			<MobileAccordionMenu
				isOpen={mobileMenuOpen}
				onClose={closeMobileMenu}
				user={user}
			/>
		</>
	);
}
