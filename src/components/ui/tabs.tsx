import * as TabsPrimitive from "@radix-ui/react-tabs";
import * as React from "react";

import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
	React.ElementRef<typeof TabsPrimitive.List>,
	React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
	<TabsPrimitive.List
		ref={ref}
		className={cn(
			"inline-flex h-12 items-center justify-center rounded-lg bg-obsidian-charcoal/40 p-1 text-muted-foreground border border-amethyst-purple/20 backdrop-blur-md hud-brackets relative overflow-hidden",
			className,
		)}
		{...props}
	>
		<div className="absolute inset-0 bg-gradient-to-b from-amethyst-purple/5 to-transparent pointer-events-none" />
		{props.children}
	</TabsPrimitive.List>
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
	React.ElementRef<typeof TabsPrimitive.Trigger>,
	React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
	<TabsPrimitive.Trigger
		ref={ref}
		style={{ color: "red", backgroundColor: "green", opacity: 1 }}
		className={cn(
			"inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-xs font-mono tracking-widest uppercase transition-all duration-300 relative group",
			"hover:text-white hover:bg-amethyst-purple/10",
			"data-[state=active]:!text-amethyst-purple data-[state=active]:bg-amethyst-purple/20 data-[state=active]:shadow-[0_0_15px_rgba(155,109,255,0.3)]",
			"focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amethyst-purple/50",
			"disabled:pointer-events-none disabled:opacity-50",
			className,
		)}
		{...props}
	>
		<span className="relative z-10 flex items-center justify-center gap-2 w-full h-full pointer-events-none">
			{props.children}
		</span>
		<div className="absolute bottom-0 left-0 right-0 h-[2px] bg-amethyst-purple scale-x-0 group-data-[state=active]:scale-x-100 transition-transform duration-500 origin-center shadow-[0_0_10px_rgba(155,109,255,0.8)]" />
	</TabsPrimitive.Trigger>
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
	React.ElementRef<typeof TabsPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
	<TabsPrimitive.Content
		ref={ref}
		className={cn(
			"mt-4 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ascendant-materialize",
			className,
		)}
		{...props}
	/>
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
