import { ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { navigationConfig } from "./navigationConfig";

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    user?: any;
}

export function MobileAccordionMenu({ isOpen, onClose, user }: MobileMenuProps) {
    const [openSection, setOpenSection] = useState<string | null>(null);
    const location = useLocation();

    if (!isOpen) return null;

    const toggleSection = (title: string) => {
        setOpenSection((prev) => (prev === title ? null : title));
    };

    const isActive = (path?: string) => {
        if (!path) return false;
        return location.pathname === path || location.pathname.startsWith(`${path}/`);
    };

    return (
        <div
            className="fixed inset-0 z-50 lg:hidden"
            role="dialog"
            aria-modal="true"
        >
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-background/80 backdrop-blur-sm"
                onClick={onClose}
                aria-hidden="true"
            />
            {/* Drawer */}
            <div className="fixed top-0 left-0 bottom-0 w-[85%] max-w-sm bg-background border-r border-border/50 shadow-2xl overflow-y-auto animate-in slide-in-from-left duration-300 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border/50 bg-muted/20">
                    <span className="font-bold tracking-wider uppercase text-sm font-system text-primary">System Protocol</span>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Content */}
                <div className="flex-1 py-2">
                    {navigationConfig.map((item) => (
                        <div key={item.title} className="border-b border-border/30">
                            {item.href && !item.items ? (
                                <Link
                                    to={item.href}
                                    onClick={onClose}
                                    className={cn(
                                        "block px-6 py-4 font-bold tracking-wide",
                                        isActive(item.href) ? "text-primary bg-primary/10" : "text-foreground"
                                    )}
                                >
                                    {item.title}
                                </Link>
                            ) : (
                                <div>
                                    <button
                                        onClick={() => toggleSection(item.title)}
                                        className={cn(
                                            "w-full flex items-center justify-between px-6 py-4 font-bold tracking-wide transition-colors",
                                            openSection === item.title ? "text-primary" : "text-foreground"
                                        )}
                                    >
                                        {item.title}
                                        <ChevronDown className={cn("h-4 w-4 transition-transform", openSection === item.title ? "rotate-180 text-primary" : "text-muted-foreground")} />
                                    </button>
                                    {/* Accordion Content */}
                                    {openSection === item.title && item.items && (
                                        <div className="bg-muted/10 px-6 pb-3 pt-1 animate-in zoom-in-95 duration-200">
                                            {item.items.map((subItem) => {
                                                const Icon = subItem.icon;
                                                return (
                                                    <Link
                                                        key={subItem.title}
                                                        to={subItem.href}
                                                        onClick={onClose}
                                                        className="flex items-center gap-3 py-3 text-sm text-foreground/80 hover:text-primary transition-colors"
                                                    >
                                                        {Icon && <Icon className="h-4 w-4 text-primary/70" />}
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
                    <div className="p-6 border-t border-border/50">
                        <Link to="/login" onClick={onClose} className="block w-full text-center py-2 px-4 rounded-md bg-primary text-primary-foreground font-semibold hover:bg-primary/90">
                            Sign In
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
