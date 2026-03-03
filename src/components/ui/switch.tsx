import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-[20px] w-[36px] shrink-0 cursor-pointer items-center rounded-sm border border-primary/30 bg-black/60 shadow-[inset_0_0_4px_rgba(0,0,0,0.5)] transition-colors",
      "data-[state=checked]:bg-primary/30 data-[state=checked]:border-primary data-[state=checked]:shadow-[0_0_8px_hsl(var(--primary)/0.3),inset_0_0_4px_hsl(var(--primary)/0.2)]",
      "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-1 focus-visible:ring-offset-background",
      "disabled:cursor-not-allowed disabled:opacity-40",
      className,
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-4 w-4 rounded-sm bg-foreground/50 shadow-md ring-0 transition-transform",
        "data-[state=checked]:translate-x-[16px] data-[state=checked]:bg-primary-foreground data-[state=checked]:shadow-[0_0_8px_hsl(var(--primary)/0.8)]",
        "data-[state=unchecked]:translate-x-0",
      )}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
