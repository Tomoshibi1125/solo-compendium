import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
	"inline-flex items-center justify-center rounded-[2px] border px-2.5 py-0.5 text-xs font-system tracking-widest font-bold uppercase transition-colors focus:outline-none focus:ring-1 focus:ring-primary focus:ring-offset-1 relative overflow-hidden group",
	{
		variants: {
			variant: {
				default:
					"border-primary/50 bg-primary/10 text-primary hover:bg-primary/20 hover:shadow-[0_0_10px_hsl(var(--primary)/0.5)] before:content-['['] after:content-[']'] before:text-primary/50 after:text-primary/50 before:mr-1 after:ml-1",
				secondary:
					"border-secondary/50 bg-secondary/10 text-secondary hover:bg-secondary/20 hover:shadow-[0_0_10px_hsl(var(--secondary)/0.5)] before:content-['['] after:content-[']'] before:text-secondary/50 after:text-secondary/50 before:mr-1 after:ml-1",
				destructive:
					"border-destructive/50 bg-destructive/10 text-destructive hover:bg-destructive/20 hover:shadow-[0_0_10px_hsl(var(--destructive)/0.5)] before:content-['['] after:content-[']'] before:text-destructive/50 after:text-destructive/50 before:mr-1 after:ml-1",
				outline:
					"text-foreground border-primary/30 before:content-['['] after:content-[']'] before:text-primary/40 after:text-primary/40 before:mr-1 after:ml-1 hover:bg-black/40",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

export interface BadgeProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
	return (
		<div className={cn(badgeVariants({ variant }), className)} {...props} />
	);
}

export { Badge, badgeVariants };
