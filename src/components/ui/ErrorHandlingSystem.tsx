import React, { createContext, useContext, useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { AlertTriangle, CheckCircle, Info, X } from 'lucide-react';

interface ErrorInfo {
  id: string;
  title: string;
  message: string;
  type: 'error' | 'warning' | 'info' | 'success';
  timestamp: Date;
  action?: {
    label: string;
    handler: () => void;
  };
  recoverable?: boolean;
  details?: Record<string, any>;
  retryable?: boolean;
  retryCount?: number;
  maxRetries?: number;
  context?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  category?: 'network' | 'validation' | 'authentication' | 'system' | 'user' | 'unknown';
}

interface ErrorHandlingContextType {
  errors: ErrorInfo[];
  addError: (error: Omit<ErrorInfo, 'id'>) => void;
  removeError: (id: string) => void;
  clearErrors: () => void;
  getErrors: (type?: ErrorInfo['type']) => ErrorInfo[];
  hasErrors: (type?: ErrorInfo['type']) => boolean;
  showError: (error: Omit<ErrorInfo, 'id'>) => void;
  showSuccess: (message: string) => void;
  showWarning: (message: string) => void;
  showInfo: (message: string) => void;
  retryError: (id: string) => Promise<boolean>;
  dismissError: (id: string) => void;
  escalateError: (id: string) => void;
  getErrorStats: () => {
    total: number;
    byType: Record<string, number>;
    bySeverity: Record<string, number>;
    byCategory: Record<string, number>;
  };
}

const ErrorHandlingContext = createContext<ErrorHandlingContextType | null>(null);

export const useErrorHandling = () => {
  const context = useContext(ErrorHandlingContext);
  if (!context) {
    throw new Error('useErrorHandling must be used within ErrorHandlingProvider');
  }
  return context;
};

export const ErrorHandlingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [errors, setErrors] = useState<ErrorInfo[]>([]);

  const addError = useCallback((error: Omit<ErrorInfo, 'id'>) => {
    const errorWithId = {
      ...error,
      id: crypto.randomUUID(),
      timestamp: new Date(),
      retryCount: 0,
      maxRetries: error.maxRetries || 3,
      severity: error.severity || 'medium',
      category: error.category || 'unknown'
    };
    
    setErrors(prev => [...prev, errorWithId]);
    
    // Auto-show toast for errors
    toast({
      title: error.title,
      description: error.message,
      variant: error.type === 'error' ? 'destructive' : 'default',
    });
    
    // Log to console for debugging
    if (error.type === 'error') {
      console.error('Error:', errorWithId);
    }
  }, []);

  const removeError = useCallback((id: string) => {
    setErrors(prev => prev.filter(error => error.id !== id));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  const getErrors = useCallback((type?: ErrorInfo['type']) => {
    if (type) {
      return errors.filter(error => error.type === type);
    }
    return errors;
  }, [errors]);

  const hasErrors = useCallback((type?: ErrorInfo['type']) => {
    return getErrors(type).length > 0;
  }, [errors]);

  const retryError = useCallback(async (id: string): Promise<boolean> => {
    const error = errors.find(e => e.id === id);
    if (!error || !error.retryable || !error.action) {
      return false;
    }
    
    if (error.retryCount! >= error.maxRetries!) {
      return false;
    }
    
    try {
      // Update retry count
      setErrors(prev => prev.map(e => 
        e.id === id 
          ? { ...e, retryCount: (e.retryCount || 0) + 1 }
          : e
      ));
      
      // Execute retry action
      await error.action.handler();
      
      // Remove error on successful retry
      removeError(id);
      return true;
    } catch (retryError) {
      // Update error with retry failure info
      setErrors(prev => prev.map(e => 
        e.id === id 
          ? { 
              ...e, 
              details: { 
                ...e.details, 
                lastRetryError: retryError instanceof Error ? retryError.message : 'Unknown error'
              }
            }
          : e
      ));
      return false;
    }
  }, [errors, removeError]);

  const dismissError = useCallback((id: string) => {
    removeError(id);
  }, [removeError]);

  const escalateError = useCallback((id: string) => {
    const error = errors.find(e => e.id === id);
    if (!error) return;
    
    // Update severity to critical
    setErrors(prev => prev.map(e => 
      e.id === id 
        ? { ...e, severity: 'critical' as const }
        : e
    ));
    
    // Log escalation
    console.error('Error escalated to critical:', error);
  }, [errors]);

  const getErrorStats = useCallback(() => {
    const stats = {
      total: errors.length,
      byType: {} as Record<string, number>,
      bySeverity: {} as Record<string, number>,
      byCategory: {} as Record<string, number>
    };
    
    errors.forEach(error => {
      stats.byType[error.type] = (stats.byType[error.type] || 0) + 1;
      stats.bySeverity[error.severity || 'medium'] = (stats.bySeverity[error.severity || 'medium'] || 0) + 1;
      stats.byCategory[error.category || 'unknown'] = (stats.byCategory[error.category || 'unknown'] || 0) + 1;
    });
    
    return stats;
  }, [errors]);

  const showError = useCallback((error: Omit<ErrorInfo, 'id'>) => {
    addError(error);
  }, []);

  const showSuccess = useCallback((message: string) => {
    toast({
      title: 'Success',
      description: message,
      variant: 'default',
    });
  }, []);

  const showWarning = useCallback((message: string) => {
    toast({
      title: 'Warning',
      description: message,
      variant: 'default',
    });
  }, []);

  const showInfo = useCallback((message: string) => {
    toast({
      title: 'Info',
      description: message,
      variant: 'default',
    });
  }, []);

  const contextValue: ErrorHandlingContextType = {
    errors,
    addError,
    removeError,
    clearErrors,
    getErrors,
    hasErrors,
    showError,
    showSuccess,
    showWarning,
    showInfo,
    retryError,
    dismissError,
    escalateError,
    getErrorStats
  };

  return (
    <ErrorHandlingContext.Provider value={contextValue}>
      {children}
    </ErrorHandlingContext.Provider>
  );
};

// Error boundary component
export const ErrorBoundary: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}> = ({ children, fallback, onError }) => {
  const [hasError, setHasError] = useState(false);
  const [errorInfo, setErrorInfo] = useState<ErrorInfo | null>(null);

  const handleError = useCallback((error: Error, errorInfo: React.ErrorInfo) => {
    console.error('Error caught by boundary:', error, errorInfo);
    setHasError(true);
    setErrorInfo({
      id: crypto.randomUUID(),
      title: error.name || 'Application Error',
      message: error.message || 'An unexpected error occurred',
      type: 'error',
      timestamp: new Date(),
      details: { stack: error.stack, errorInfo }
    });
    
    if (onError) {
      onError(error, errorInfo);
    }
  }, []);

  const getErrorIcon = (type?: ErrorInfo['type']) => {
    switch (type) {
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <X className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const resetError = useCallback(() => {
    setHasError(false);
    setErrorInfo(null);
  }, []);

  return (
    <div className="relative">
      {hasError ? (
        <div className="p-4 border border-destructive/20 bg-destructive/5 rounded-lg">
          <div className="flex items-start space-x-3">
            {getErrorIcon(errorInfo?.type)}
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground">
                {errorInfo?.title || 'Error'}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {errorInfo?.message}
              </p>
              {errorInfo?.details && (
                <details className="mt-2">
                  <summary className="text-sm font-medium text-foreground cursor-pointer hover:text-primary">
                    Error Details
                  </summary>
                  <pre className="text-xs text-muted-foreground mt-2 p-2 bg-background/80 rounded overflow-x-auto">
                    {JSON.stringify(errorInfo.details, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          </div>
          <button
            onClick={resetError}
            className="ml-3 px-3 py-1 text-sm bg-background hover:bg-muted rounded-md transition-colors"
          >
            Dismiss
          </button>
        </div>
      ) : (
        children
      )}
    </div>
  );
};

// Form validation utilities
export const ValidationRules = {
  required: (value: any, fieldName: string) => {
    if (value === null || value === undefined || value === '') {
      return `${fieldName} is required`;
    }
    if (typeof value === 'string' && value.trim().length === 0) {
      return `${fieldName} cannot be empty`;
    }
    if (typeof value === 'number' && (value < 0 || value > 100)) {
      return `${fieldName} must be between 0 and 100`;
    }
    return null;
  },

  email: (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return null;
  },

  password: (password: string) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return 'Password must contain at least one letter';
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/(?=.*\d)/.test(password)) {
      return 'Password must contain at least one number';
    }
    return null;
  },

  phone: (phone: string) => {
    const phoneRegex = /^\+?[\d\s\-\(\)]?\d{3}[\)\-\(\)]?\d{4}[\)\-\(\)]?\d{6}[\)\-\(\)]?\d{7,8}\d*$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      return 'Please enter a valid phone number';
    }
    return null;
  }
};

// Loading states with skeleton screens
export const LoadingStates = {
  skeleton: 'animate-pulse bg-muted/20',
  shimmer: 'bg-gradient-to-r from-muted via-transparent to-muted animate-shimmer',
  spinner: 'animate-spin border-2 border-primary border-t-primary rounded-full',
  dots: 'flex space-x-1',
  bars: 'flex space-x-1',
  pulse: 'animate-pulse bg-primary/20 rounded-full'
};

// Micro-interactions
export const MicroInteractions = {
  hover: 'transition-all duration-200 hover:scale-105 hover:shadow-lg',
  focus: 'ring-2 ring-primary/20 ring-offset-2 focus:ring-offset-background',
  active: 'ring-2 ring-primary/30 ring-offset-2',
  disabled: 'opacity-50 cursor-not-allowed',
  loading: 'opacity-70'
};

// Success/error states
export const StatusStates = {
  success: 'bg-green-100 text-green-800 border-green-200',
  warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  error: 'bg-red-100 text-red-800 border-red-200',
  info: 'bg-blue-100 text-blue-800 border-blue-200'
};

export default ErrorHandlingProvider;
