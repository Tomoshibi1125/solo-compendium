import * as SliderPrimitive from "@radix-ui/react-slider";
import * as React from "react";

import { cn } from "@/lib/utils";

const Slider = React.forwardRef<
	React.ElementRef<typeof SliderPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
	<SliderPrimitive.Root
		ref={ref}
		className={cn(
			"relative flex w-full touch-none select-none items-center",
			className,
		)}
		{...props}
	>
		<SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-[2px] bg-black/60 border border-primary/20 shadow-[inset_0_0_4px_rgba(0,0,0,0.5)]">
			<SliderPrimitive.Range className="absolute h-full bg-primary/80 shadow-[0_0_8px_hsl(var(--primary)/0.6)]" />
		</SliderPrimitive.Track>
		<SliderPrimitive.Thumb className="block h-4 w-3 rounded-[2px] border border-primary bg-primary/20 shadow-[0_0_8px_hsl(var(--primary)/0.5),inset_0_0_4px_hsl(var(--primary)/0.5)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-40" />
	</SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
