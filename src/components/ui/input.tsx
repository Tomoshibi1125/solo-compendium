import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
	({ className, type, ...props }, ref) => {
		return (
			<input
				type={type}
				className={cn(
					"flex h-10 w-full rounded-[2px] border border-primary/30 bg-black/40 backdrop-blur-md px-3 py-2 text-sm text-foreground shadow-[inset_0_0_8px_rgba(0,0,0,0.5)] transition-all duration-200",
					"file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
					"placeholder:text-muted-foreground/60 placeholder:font-heading tracking-wide",
					"focus-visible:outline-none focus-visible:border-primary/80 focus-visible:shadow-[0_0_10px_hsl(var(--primary)/0.3),inset_0_0_10px_hsl(var(--primary)/0.1)] focus-visible:bg-black/60",
					"disabled:cursor-not-allowed disabled:opacity-40 disabled:border-muted",
					"hover:border-primary/50 hover:bg-black/50",
					className,
				)}
				ref={ref}
				{...props}
			/>
		);
	},
);
Input.displayName = "Input";

export { Input };
