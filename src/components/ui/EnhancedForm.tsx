import React, { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { 
  AlertCircle, 
  Check, 
  Eye, 
  EyeOff, 
  HelpCircle,
  Info,
  Loader2
} from 'lucide-react';

interface FormFieldProps {
  label: string;
  description?: string;
  error?: string;
  required?: boolean;
  tooltip?: string;
  disabled?: boolean;
  loading?: boolean;
}

interface EnhancedFormProps {
  title?: string;
  description?: string;
  onSubmit: (data: any) => void;
  loading?: boolean;
  submitText?: string;
  children: React.ReactNode;
  className?: string;
  footer?: React.ReactNode;
  showProgress?: boolean;
  progress?: number;
  autoSave?: boolean;
  validationMode?: 'onChange' | 'onBlur' | 'onSubmit';
  smartDefaults?: boolean;
  showValidationSummary?: boolean;
  enableKeyboardShortcuts?: boolean;
  confirmBeforeLeave?: boolean;
}

interface EnhancedInputProps extends FormFieldProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  placeholder?: string;
  value?: string | number;
  onChange?: (value: any) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  showPasswordToggle?: boolean;
  autoComplete?: string;
  suggestions?: string[];
  onSuggestionSelect?: (suggestion: string) => void;
  realTimeValidation?: boolean;
  debounceMs?: number;
  showCharacterCount?: boolean;
  smartFormatting?: boolean;
  copyToClipboard?: boolean;
  clearButton?: boolean;
  className?: string;
}

interface EnhancedSelectProps extends FormFieldProps {
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  searchable?: boolean;
  multi?: boolean;
  className?: string;
}

interface EnhancedTextareaProps extends FormFieldProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  resize?: 'none' | 'vertical' | 'horizontal';
  className?: string;
}

interface EnhancedCheckboxProps extends FormFieldProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  indeterminate?: boolean;
  className?: string;
}

interface EnhancedRadioGroupProps extends FormFieldProps {
  options: Array<{ value: string; label: string; description?: string }>;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

interface EnhancedSliderProps extends FormFieldProps {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  onChange?: (value: number) => void;
  marks?: Array<{ value: number; label: string }>;
  showValue?: boolean;
}

interface EnhancedSwitchProps extends FormFieldProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  description?: string;
}

// Enhanced Input Component with advanced features
const EnhancedInput: React.FC<EnhancedInputProps> = ({
  label,
  description,
  error,
  required = false,
  tooltip,
  disabled = false,
  loading = false,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  onFocus,
  maxLength,
  minLength,
  pattern,
  prefix,
  suffix,
  showPasswordToggle = false,
  autoComplete,
  suggestions = [],
  onSuggestionSelect,
  realTimeValidation = true,
  debounceMs = 300,
  showCharacterCount = false,
  smartFormatting = false,
  copyToClipboard = false,
  clearButton = false,
  className,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const inputType = type === 'password' && showPassword ? 'text' : type;
  const currentValue = typeof value === 'string' ? value : String(value || '');
  const characterCount = currentValue.length;
  const isOverLimit = maxLength && characterCount > maxLength;

  // Smart formatting
  const formatValue = useCallback((inputValue: string) => {
    if (!smartFormatting) return inputValue;
    
    switch (type) {
      case 'email':
        return inputValue.toLowerCase().trim();
      case 'tel':
        return inputValue.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
      case 'number':
        const num = parseFloat(inputValue);
        return isNaN(num) ? inputValue : num.toString();
      default:
        return inputValue.trim();
    }
  }, [smartFormatting, type]);

  // Debounced onChange with validation
  const debouncedOnChange = useCallback((inputValue: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      const formattedValue = formatValue(inputValue);
      onChange?.(formattedValue);
    }, debounceMs);
  }, [onChange, formatValue, debounceMs]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    if (!realTimeValidation) {
      debouncedOnChange(inputValue);
    } else {
      onChange?.(formatValue(inputValue));
    }
    
    // Filter suggestions
    if (suggestions.length > 0 && inputValue.length > 0) {
      const filtered = suggestions.filter(s => 
        s.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  // Handle suggestion selection
  const handleSuggestionClick = (suggestion: string) => {
    onChange?.(suggestion);
    setShowSuggestions(false);
    onSuggestionSelect?.(suggestion);
    inputRef.current?.focus();
  };

  // Copy to clipboard
  const handleCopy = async () => {
    if (navigator.clipboard && currentValue) {
      try {
        await navigator.clipboard.writeText(currentValue);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  // Clear input
  const handleClear = () => {
    onChange?.('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label className={cn("text-sm font-medium text-foreground", required && "flex items-center gap-1")}>
          {label}
          {required && <span className="text-destructive">*</span>}
        </Label>
      )}
      
      <div className="relative">
        {prefix && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            {prefix}
          </div>
        )}
        
        <Input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onBlur={onBlur}
          onFocus={() => {
            setIsFocused(true);
            onFocus?.();
          }}
          maxLength={maxLength}
          minLength={minLength}
          pattern={pattern}
          disabled={disabled || loading}
          autoComplete={autoComplete}
          className={cn(
            "pr-10",
            prefix && "pl-10",
            suffix && "pr-10",
            showPasswordToggle && "pr-10",
            error && "border-destructive focus:ring-destructive",
            isFocused && "ring-2 ring-primary/20"
          )}
          {...props}
        />
        
        {suffix && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            {suffix}
          </div>
        )}
        
        {type === 'password' && showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
        
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>
      
      {(description || error || tooltip) && (
        <div className="mt-1 space-y-1">
          {description && (
            <p className="text-xs text-muted-foreground flex items-start gap-1">
              <Info className="h-3 w-3 flex-shrink-0 mt-0.5" />
              {description}
            </p>
          )}
          
          {error && (
            <p className="text-xs text-destructive flex items-start gap-1">
              <AlertCircle className="h-3 w-3 flex-shrink-0 mt-0.5" />
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

// Enhanced Select Component
const EnhancedSelect: React.FC<EnhancedSelectProps> = ({
  label,
  description,
  error,
  required = false,
  tooltip,
  disabled = false,
  loading = false,
  options,
  value,
  onChange,
  placeholder,
  searchable = false,
  multi = false,
  className
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label className={cn("text-sm font-medium text-foreground", required && "flex items-center gap-1")}>
          {label}
          {required && <span className="text-destructive">*</span>}
        </Label>
      )}
      
      <Select value={value} onValueChange={onChange} disabled={disabled || loading}>
        <SelectTrigger className={cn(
          "w-full",
          error && "border-destructive focus:ring-destructive",
          loading && "opacity-50"
        )}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem 
              key={option.value} 
              value={option.value} 
              disabled={option.disabled}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {(description || error || tooltip) && (
        <div className="mt-1 space-y-1">
          {description && (
            <p className="text-xs text-muted-foreground flex items-start gap-1">
              <Info className="h-3 w-3 flex-shrink-0 mt-0.5" />
              {description}
            </p>
          )}
          
          {error && (
            <p className="text-xs text-destructive flex items-start gap-1">
              <AlertCircle className="h-3 w-3 flex-shrink-0 mt-0.5" />
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

// Enhanced Textarea Component
const EnhancedTextarea: React.FC<EnhancedTextareaProps> = ({
  label,
  description,
  error,
  required = false,
  tooltip,
  disabled = false,
  loading = false,
  value,
  onChange,
  placeholder,
  rows = 4,
  maxLength,
  resize = 'vertical',
  className
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label className={cn("text-sm font-medium text-foreground", required && "flex items-center gap-1")}>
          {label}
          {required && <span className="text-destructive">*</span>}
        </Label>
      )}
      
      <Textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        rows={rows}
        maxLength={maxLength}
        disabled={disabled || loading}
        className={cn(
          "resize-none",
          resize === 'vertical' && "resize-y",
          resize === 'horizontal' && "resize-x",
          error && "border-destructive focus:ring-destructive",
          loading && "opacity-50"
        )}
      />
      
      {(description || error || tooltip) && (
        <div className="mt-1 space-y-1">
          {description && (
            <p className="text-xs text-muted-foreground flex items-start gap-1">
              <Info className="h-3 w-3 flex-shrink-0 mt-0.5" />
              {description}
            </p>
          )}
          
          {error && (
            <p className="text-xs text-destructive flex items-start gap-1">
              <AlertCircle className="h-3 w-3 flex-shrink-0 mt-0.5" />
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

// Enhanced Checkbox Component
const EnhancedCheckbox: React.FC<EnhancedCheckboxProps> = ({
  label,
  description,
  error,
  required = false,
  tooltip,
  disabled = false,
  loading = false,
  checked,
  onChange,
  indeterminate = false,
  className
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-start space-x-2">
        <Checkbox
          id={label}
          checked={checked}
          onCheckedChange={onChange}
          disabled={disabled || loading}
          className={cn(
            error && "border-destructive focus:ring-destructive",
            loading && "opacity-50"
          )}
        />
        <div className="flex-1">
          <Label 
            htmlFor={label} 
            className={cn(
              "text-sm font-medium text-foreground cursor-pointer",
              required && "flex items-center gap-1"
            )}
          >
            {label}
            {required && <span className="text-destructive">*</span>}
          </Label>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">
              {description}
            </p>
          )}
        </div>
      </div>
      
      {error && (
        <p className="text-xs text-destructive flex items-start gap-1 mt-1">
          <AlertCircle className="h-3 w-3 flex-shrink-0 mt-0.5" />
          {error}
        </p>
      )}
    </div>
  );
};

// Enhanced Form Component
const EnhancedForm: React.FC<EnhancedFormProps> = ({
  title,
  description,
  onSubmit,
  loading = false,
  submitText = "Submit",
  children,
  className,
  footer,
  showProgress = false,
  progress = 0
}) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const updateFormData = (field: string, value: any) => {
    setFormData((prev: Record<string, any>) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if ((errors as Record<string, any>)[field]) {
      setErrors((prev: Record<string, any>) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-6", className)}>
      {title && (
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-foreground">
            {title}
          </h2>
          {description && (
            <p className="text-muted-foreground mt-2">
              {description}
            </p>
          )}
        </div>
      )}

      <div className="space-y-4">
        {React.Children.map(children, (child, index) => {
          if (React.isValidElement(child)) {
            const childProps = child.props as Record<string, any>;
            return React.cloneElement(child as React.ReactElement<any>, {
              key: index,
              error: (errors as Record<string, any>)[childProps.name || ''],
              onChange: (value: any) => updateFormData(childProps.name || '', value),
              value: (formData as Record<string, any>)[childProps.name || '']
            });
          }
          return child;
        })}
      </div>

      <div className="flex items-center justify-between space-x-4">
        <Button
          type="submit"
          disabled={loading}
          className="relative"
        >
          {loading && (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          )}
          {submitText}
        </Button>

        {showProgress && (
          <div className="flex items-center space-x-2">
            <progress
              className="w-32 h-2"
              value={progress}
              max={100}
            />
            <span className="text-xs text-muted-foreground">{progress}%</span>
          </div>
        )}
      </div>

      {footer && (
        <div className="mt-6 pt-6 border-t border-border">
          {footer}
        </div>
      )}
    </form>
  );
};

export {
  EnhancedForm,
  EnhancedInput,
  EnhancedSelect,
  EnhancedTextarea,
  EnhancedCheckbox,
  RadioGroup as EnhancedRadioGroup,
  Slider as EnhancedSlider,
  Switch as EnhancedSwitch,
  type FormFieldProps,
  type EnhancedFormProps,
  type EnhancedInputProps,
  type EnhancedSelectProps,
  type EnhancedTextareaProps,
  type EnhancedCheckboxProps,
  type EnhancedRadioGroupProps,
  type EnhancedSliderProps,
  type EnhancedSwitchProps
};
