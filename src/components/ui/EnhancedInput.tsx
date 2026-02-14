import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Input } from './input';

interface EnhancedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  required?: boolean;
}

const EnhancedInput = forwardRef<HTMLInputElement, EnhancedInputProps>(
  ({ className, type, label, error, helper, required, ...props }, ref) => {
    const [value, setValue] = React.useState(props.value || '');
    const [isFocused, setIsFocused] = React.useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setValue(newValue);
      
      // Call original onChange if provided
      if (props.onChange) {
        props.onChange(e);
      }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      
      // Call original onBlur if provided
      if (props.onBlur) {
        props.onBlur(e);
      }
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      
      // Call original onFocus if provided
      if (props.onFocus) {
        props.onFocus(e);
      }
    };

    return (
      <div className="space-y-1">
        {label && (
          <label 
            htmlFor={props.id}
            className={cn(
              "text-sm font-medium leading-none peer-disabled:cursor-not-allowed",
              error && "text-destructive",
              required && "after:content-['*'] after:ml-0.5 after:text-red-500"
            )}
          >
            {label}
            {required && <span className="text-destructive"> *</span>}
          </label>
        )}
        <div className="relative">
          <Input
            {...props}
            type={type}
            ref={ref}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            className={cn(
              "peer",
              error && "border-destructive focus:ring-destructive",
              isFocused && "ring-2 ring-ring-primary",
              className
            )}
            aria-describedby={helper ? `${props.id}-helper` : undefined}
            aria-invalid={!!error}
            aria-required={required}
          />
          {(error || helper) && (
            <div 
              id={`${props.id}-helper`}
              className={cn(
                "mt-1 text-xs",
                error ? "text-destructive" : "text-muted-foreground"
              )}
            >
              {error || helper}
            </div>
          )}
        </div>
      </div>
    );
  }
);

EnhancedInput.displayName = 'EnhancedInput';

export { EnhancedInput };
