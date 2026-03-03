import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Circle } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const RadioGroup = React.forwardRef<
	React.ElementRef<typeof RadioGroupPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
	return (
		<RadioGroupPrimitive.Root
			className={cn("grid gap-2", className)}
			{...props}
			ref={ref}
		/>
	);
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
	React.ElementRef<typeof RadioGroupPrimitive.Item>,
	React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
	return (
		<RadioGroupPrimitive.Item
			ref={ref}
			className={cn(
				"aspect-square h-4 w-4 rounded-[2px] border border-primary/50 bg-black/40 text-primary shadow-[inset_0_0_4px_rgba(0,0,0,0.5)] transition-all",
				"data-[state=checked]:bg-primary/20 data-[state=checked]:border-primary data-[state=checked]:shadow-[0_0_8px_hsl(var(--primary)/0.4),inset_0_0_4px_hsl(var(--primary)/0.4)]",
				"focus:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-1 focus-visible:ring-offset-background",
				"disabled:cursor-not-allowed disabled:opacity-40",
				className,
			)}
			{...props}
		>
			<RadioGroupPrimitive.Indicator className="flex items-center justify-center drop-shadow-[0_0_2px_currentColor]">
				<div className="h-2 w-2 bg-current shadow-[0_0_4px_currentColor]" />
			</RadioGroupPrimitive.Indicator>
		</RadioGroupPrimitive.Item>
	);
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
