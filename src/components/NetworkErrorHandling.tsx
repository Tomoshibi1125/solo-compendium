import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  RefreshCw, 
  Wifi, 
  WifiOff, 
  Clock,
  Server,
  Database
} from 'lucide-react';

interface NetworkErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: string;
  retryCount: number;
}

interface NetworkErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; retry: () => void; retryCount: number }>;
}

export class NetworkErrorBoundary extends React.Component<
  NetworkErrorBoundaryProps,
  NetworkErrorBoundaryState
> {
  constructor(props: NetworkErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<NetworkErrorBoundaryState> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo: errorInfo.componentStack || undefined
    });
  }

  retry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      retryCount: prevState.retryCount + 1
    }));
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent 
            error={this.state.error} 
            retry={this.retry} 
            retryCount={this.state.retryCount} 
          />
        );
      }

      return (
        <NetworkErrorFallback 
          error={this.state.error} 
          retry={this.retry} 
          retryCount={this.state.retryCount} 
        />
      );
    }

    return this.props.children;
  }
}

export function NetworkErrorFallback({ 
  error, 
  retry, 
  retryCount 
}: { 
  error?: Error; 
  retry: () => void; 
  retryCount: number; 
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <WifiOff className="w-12 h-12 text-destructive" />
          </div>
          <CardTitle className="text-destructive">Connection Error</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="w-4 h-4" />
            <AlertDescription>
              {error?.message || 'Network connection failed. Please check your internet connection.'}
            </AlertDescription>
          </Alert>
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              We're having trouble connecting to our servers. This could be due to:
            </p>
            <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
              <li>Poor internet connection</li>
              <li>Server maintenance</li>
              <li>Network firewall restrictions</li>
              <li>Temporary service outage</li>
            </ul>
          </div>

          {retryCount > 0 && (
            <Alert>
              <Clock className="w-4 h-4" />
              <AlertDescription>
                Retry attempt {retryCount}. If this continues, please contact support.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2">
            <Button onClick={retry} className="flex-1">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Reload Page
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function LoadingIndicator({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}

export function SlowNetworkWarning() {
  return (
    <Alert className="border-yellow-200 bg-yellow-50">
      <Clock className="w-4 h-4 text-yellow-600" />
      <AlertDescription className="text-yellow-800">
        <strong>Slow Network Detected:</strong> Loading may take longer than usual. 
        Your connection appears to be slower than expected.
      </AlertDescription>
    </Alert>
  );
}

export function ServerErrorFallback({ error, retry }: { error?: Error; retry: () => void }) {
  return (
    <Card className="border-red-200 bg-red-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-800">
          <Server className="w-5 h-5" />
          Server Error
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="border-red-200">
          <AlertTriangle className="w-4 h-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {error?.message || 'The server encountered an internal error. Please try again later.'}
          </AlertDescription>
        </Alert>
        
        <div className="space-y-2">
          <p className="text-sm text-red-700">
            Our servers are experiencing difficulties. This is usually temporary and resolves quickly.
          </p>
          <div className="text-sm text-red-600">
            <strong>Error Code:</strong> 500 Internal Server Error
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={retry} variant="destructive">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry Request
          </Button>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Reload Page
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function TimeoutErrorFallback({ retry }: { retry: () => void }) {
  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-800">
          <Clock className="w-5 h-5" />
          Request Timeout
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="border-orange-200">
          <AlertTriangle className="w-4 h-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            The request took too long to complete. This may be due to network congestion or server overload.
          </AlertDescription>
        </Alert>
        
        <div className="space-y-2">
          <p className="text-sm text-orange-700">
            The server didn't respond in time. This usually happens during high traffic periods.
          </p>
        </div>

        <Button onClick={retry} className="w-full">
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </CardContent>
    </Card>
  );
}

export function OfflineModeIndicator() {
  return (
    <Alert className="border-gray-200 bg-gray-50">
      <WifiOff className="w-4 h-4 text-gray-600" />
      <AlertDescription className="text-gray-800">
        <strong>Offline Mode:</strong> You're currently offline. Some features may be limited until you reconnect.
      </AlertDescription>
    </Alert>
  );
}

export function NetworkStatusIndicator({ 
  isOnline, 
  latency 
}: { 
  isOnline: boolean; 
  latency?: number; 
}) {
  const getConnectionQuality = () => {
    if (!latency) return 'unknown';
    if (latency < 100) return 'excellent';
    if (latency < 300) return 'good';
    if (latency < 1000) return 'poor';
    return 'very-poor';
  };

  const quality = getConnectionQuality();
  
  return (
    <div className="flex items-center gap-2 p-2 border rounded">
      {isOnline ? (
        <Wifi className="w-4 h-4 text-green-500" />
      ) : (
        <WifiOff className="w-4 h-4 text-red-500" />
      )}
      
      <div className="flex items-center gap-2">
        <Badge variant={isOnline ? 'default' : 'destructive'}>
          {isOnline ? 'Online' : 'Offline'}
        </Badge>
        
        {latency && (
          <Badge variant="outline">
            {latency}ms
          </Badge>
        )}
        
        {quality !== 'unknown' && (
          <Badge 
            variant={
              quality === 'excellent' ? 'default' :
              quality === 'good' ? 'secondary' :
              'destructive'
            }
          >
            {quality.replace('-', ' ')}
          </Badge>
        )}
      </div>
    </div>
  );
}

export function ResourceLoadingFailure({ resource, retry }: { 
  resource: string; 
  retry: () => void; 
}) {
  return (
    <Card className="border-red-200 bg-red-50">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Database className="w-5 h-5 text-red-500" />
          <div className="flex-1">
            <h4 className="font-semibold text-red-800">Resource Loading Failed</h4>
            <p className="text-sm text-red-600">
              Failed to load: {resource}
            </p>
          </div>
          <Button size="sm" variant="destructive" onClick={retry}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default NetworkErrorBoundary;
