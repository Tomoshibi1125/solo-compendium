import React, { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md hover:shadow-lg",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-sm hover:shadow-md",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm hover:shadow-md",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary/80",
        success: "bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg",
        warning: "bg-yellow-600 text-white hover:bg-yellow-700 shadow-md hover:shadow-lg",
        info: "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3 py-1.5 text-xs",
        lg: "h-11 px-6 py-2.5 text-base",
        xl: "h-12 px-8 py-3 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface EnhancedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  tooltip?: string;
}

const EnhancedButton = forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    asChild = false, 
    loading = false, 
    loadingText, 
    icon, 
    iconPosition = 'left',
    fullWidth = false,
    tooltip,
    children, 
    disabled,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    const buttonContent = (
      <>
        {loading && (
          <Loader2 className={cn(
            "h-4 w-4 animate-spin",
            iconPosition === 'right' && "order-1 ml-2",
            iconPosition === 'left' && "mr-2"
          )} />
        )}
        
        {icon && !loading && (
          <span className={cn(
            "flex items-center",
            iconPosition === 'right' && "order-1 ml-2",
            iconPosition === 'left' && "mr-2"
          )}>
            {icon}
          </span>
        )}
        
        <span className={cn(
          "truncate",
          loading && "opacity-70"
        )}>
          {loading ? loadingText || "Loading..." : children}
        </span>
      </>
    );

    const buttonElement = (
      <Comp
        className={cn(buttonVariants({ variant, size, className }), {
          "w-full": fullWidth,
        })}
        ref={ref}
        disabled={disabled || loading}
        title={tooltip}
        {...props}
      >
        {buttonContent}
      </Comp>
    );

    // Wrap with tooltip if provided
    if (tooltip) {
      return (
        <div className="relative inline-block group">
          {buttonElement}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
            {tooltip}
          </div>
        </div>
      );
    }

    return buttonElement;
  }
);

EnhancedButton.displayName = "EnhancedButton";

export { EnhancedButton, buttonVariants };
