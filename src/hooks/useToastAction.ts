import { useToast } from '@/hooks/use-toast';

/**
 * Hook for common toast actions
 */
export function useToastAction() {
  const { toast } = useToast();

  const showSuccess = (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: 'default',
    });
  };

  const showError = (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: 'destructive',
    });
  };

  const showInfo = (title: string, description?: string) => {
    toast({
      title,
      description,
    });
  };

  return {
    showSuccess,
    showError,
    showInfo,
  };
}

