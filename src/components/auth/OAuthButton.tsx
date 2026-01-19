import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { OAuthProvider, OAUTH_PROVIDERS } from '@/hooks/useOAuth';

interface OAuthButtonProps {
  provider: OAuthProvider;
  isLoading?: boolean;
  onClick: () => void;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function OAuthButton({ 
  provider, 
  isLoading = false, 
  onClick, 
  variant = 'outline',
  size = 'default'
}: OAuthButtonProps) {
  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={onClick}
      disabled={isLoading}
      className={`w-full justify-start gap-3 ${provider.color} text-white border-0`}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <span className="text-lg">{provider.icon}</span>
      )}
      <span>
        Continue with {provider.name}
      </span>
    </Button>
  );
}

interface OAuthButtonsProps {
  isLoading?: boolean;
  onSignIn: (provider: OAuthProvider) => Promise<void>;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export function OAuthButtons({ 
  isLoading = false, 
  onSignIn, 
  variant = 'outline',
  size = 'default',
  className = ''
}: OAuthButtonsProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {OAUTH_PROVIDERS.map((provider) => (
        <OAuthButton
          key={provider.id}
          provider={provider}
          isLoading={isLoading}
          onClick={() => onSignIn(provider)}
          variant={variant}
          size={size}
        />
      ))}
    </div>
  );
}
