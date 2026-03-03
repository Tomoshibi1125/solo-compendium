import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef<
	React.ElementRef<typeof CheckboxPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
	<CheckboxPrimitive.Root
		ref={ref}
		className={cn(
			"peer h-4 w-4 shrink-0 rounded-[2px] border border-primary/50 bg-black/40 backdrop-blur-md shadow-[inset_0_0_4px_rgba(0,0,0,0.5)] transition-all",
			"data-[state=checked]:bg-primary/20 data-[state=checked]:border-primary data-[state=checked]:text-primary data-[state=checked]:shadow-[0_0_8px_hsl(var(--primary)/0.4),inset_0_0_4px_hsl(var(--primary)/0.4)]",
			"focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/80 focus-visible:ring-offset-1 focus-visible:ring-offset-background",
			"disabled:cursor-not-allowed disabled:opacity-40",
			className,
		)}
		{...props}
	>
		<CheckboxPrimitive.Indicator
			className={cn(
				"flex items-center justify-center text-current drop-shadow-[0_0_2px_currentColor]",
			)}
		>
			<Check className="h-3.5 w-3.5 stroke-[3]" />
		</CheckboxPrimitive.Indicator>
	</CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
