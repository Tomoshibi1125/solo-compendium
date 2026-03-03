import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[2px] text-sm font-system tracking-wide ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent before:-translate-x-full hover:before:animate-[shimmer_1.5s_infinite]",
  {
    variants: {
      variant: {
        default: "bg-primary/20 border border-primary/50 text-primary-foreground hover:bg-primary/40 hover:shadow-[0_0_20px_hsl(var(--primary)/0.6),inset_0_0_10px_hsl(var(--primary)/0.4)] hover:-translate-y-0.5 backdrop-blur-sm",
        destructive: "bg-destructive/20 border border-destructive/50 text-destructive-foreground hover:bg-destructive/40 hover:shadow-[0_0_20px_hsl(var(--destructive)/0.6),inset_0_0_10px_hsl(var(--destructive)/0.4)] hover:-translate-y-0.5 gate-break backdrop-blur-sm",
        outline: "border border-primary/30 bg-black/40 hover:bg-primary/20 hover:text-primary-foreground hover:border-primary/80 hover:shadow-[0_0_15px_hsl(var(--primary)/0.3)] backdrop-blur-sm text-foreground",
        secondary: "bg-secondary/20 border border-secondary/50 text-secondary-foreground hover:bg-secondary/40 hover:shadow-[0_0_20px_hsl(var(--secondary)/0.6),inset_0_0_10px_hsl(var(--secondary)/0.4)] hover:-translate-y-0.5 shadow-extraction backdrop-blur-sm",
        ghost: "hover:bg-primary/20 hover:text-primary-foreground hover:shadow-[inset_0_0_10px_hsl(var(--primary)/0.2)] text-foreground",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary/80 hover:drop-shadow-[0_0_8px_hsl(var(--primary)/0.8)]",
        // Sovereign power variants
        monarch: "bg-monarch-gold text-white hover:bg-monarch-gold/90 hover:shadow-[0_0_25px_hsl(var(--monarch-gold)/0.5),0_0_50px_hsl(var(--shadow-purple)/0.3)] hover:-translate-y-1 monarch-seal",
        arise: "bg-arise-violet text-white hover:bg-arise-violet/90 hover:shadow-[0_0_30px_hsl(var(--arise-violet)/0.6),0_0_60px_hsl(var(--shadow-purple)/0.4)] hover:-translate-y-1 arise",
        // Gate-tier variants
        "gate-e": "bg-gate-e text-white hover:bg-gate-e/90 hover:shadow-[0_0_20px_hsl(var(--gate-e-glow)/0.5)] hover:-translate-y-0.5 gate-energy-flow",
        "gate-d": "bg-gate-d text-white hover:bg-gate-d/90 hover:shadow-[0_0_22px_hsl(var(--gate-d-glow)/0.5)] hover:-translate-y-0.5 gate-energy-flow",
        "gate-c": "bg-gate-c text-white hover:bg-gate-c/90 hover:shadow-[0_0_24px_hsl(var(--gate-c-glow)/0.5)] hover:-translate-y-0.5 gate-energy-flow",
        "gate-b": "bg-gate-b text-white hover:bg-gate-b/90 hover:shadow-[0_0_26px_hsl(var(--gate-b-glow)/0.5)] hover:-translate-y-0.5 gate-energy-flow",
        "gate-a": "bg-gate-a text-white hover:bg-gate-a/90 hover:shadow-[0_0_28px_hsl(var(--gate-a-glow)/0.5)] hover:-translate-y-0.5 gate-energy-flow",
        "gate-s": "bg-gate-s text-white hover:bg-gate-s/90 hover:shadow-[0_0_30px_hsl(var(--gate-s-glow)/0.5)] hover:-translate-y-1 gate-energy-flow dimensional-pulse",
        "gate-ss": "bg-gate-ss text-white hover:bg-gate-ss/90 hover:shadow-[0_0_35px_hsl(var(--gate-ss-glow)/0.6)] hover:-translate-y-1 gate-energy-flow dimensional-pulse",
        "gate-national": "bg-gate-national text-white hover:bg-gate-national/90 hover:shadow-[0_0_40px_hsl(var(--gate-national-glow)/0.7)] hover:-translate-y-1 gate-energy-flow dimensional-pulse rift-portal",
      },
      size: {
        default: "h-10 px-4 py-2 min-h-[44px] sm:min-h-[40px]",
        sm: "h-9 rounded-md px-3 min-h-[44px] sm:min-h-[36px]",
        lg: "h-11 rounded-md px-8 min-h-[44px]",
        icon: "h-10 w-10 min-h-[44px] min-w-[44px] sm:min-h-[40px] sm:min-w-[40px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
