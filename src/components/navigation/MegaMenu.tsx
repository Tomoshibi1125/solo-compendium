import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { navigationConfig } from "./navigationConfig";

export function MegaMenu() {
    const [activeItem, setActiveItem] = useState<string | null>(null);
    const location = useLocation();

    const handleMouseEnter = (title: string) => {
        setActiveItem(title);
    };

    const handleMouseLeave = () => {
        setActiveItem(null);
    };

    const isActive = (path?: string) => {
        if (!path) return false;
        return location.pathname === path || location.pathname.startsWith(`${path}/`);
    };

    return (
        <nav className="hidden lg:flex items-center space-x-1 h-full" onMouseLeave={handleMouseLeave}>
            {navigationConfig.map((item) => (
                <div key={item.title} className="relative h-full flex items-center" onMouseEnter={() => handleMouseEnter(item.title)}>
                    {item.href && !item.items ? (
                        <Link
                            to={item.href}
                            className={cn(
                                "px-4 h-full flex items-center font-bold tracking-wide transition-colors text-sm",
                                isActive(item.href)
                                    ? "text-primary border-b-2 border-primary"
                                    : "text-foreground hover:text-primary"
                            )}
                        >
                            {item.title}
                        </Link>
                    ) : (
                        <button
                            className={cn(
                                "px-4 h-full flex items-center gap-1 font-bold tracking-wide transition-colors text-sm",
                                activeItem === item.title ? "text-primary" : "text-foreground hover:text-primary"
                            )}
                        >
                            {item.title}
                            <ChevronDown className={cn("h-4 w-4 transition-transform", activeItem === item.title ? "rotate-180" : "")} />
                        </button>
                    )}

                    {/* Mega Menu Dropdown Content */}
                    {item.items && activeItem === item.title && (
                        <div
                            className="absolute top-full left-0 w-[450px] bg-background border border-border/50 shadow-2xl rounded-b-xl overflow-hidden animate-in slide-in-from-top-2 duration-200 z-50"
                        >
                            <div className="grid grid-cols-2 gap-2 p-4">
                                {item.items.map((subItem) => {
                                    const Icon = subItem.icon;
                                    return (
                                        <Link
                                            key={subItem.title}
                                            to={subItem.href}
                                            onClick={() => setActiveItem(null)}
                                            className="group flex flex-col gap-1 rounded-lg p-3 hover:bg-muted/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-2 font-semibold text-sm text-foreground group-hover:text-primary">
                                                {Icon && <Icon className="h-4 w-4" />}
                                                {subItem.title}
                                            </div>
                                            {subItem.description && (
                                                <p className="text-xs text-muted-foreground ml-6 line-clamp-2">
                                                    {subItem.description}
                                                </p>
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </nav>
    );
}
