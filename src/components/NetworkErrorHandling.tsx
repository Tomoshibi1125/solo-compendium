import { AlertTriangle, Clock, RefreshCw, WifiOff } from "lucide-react";
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface NetworkErrorBoundaryState {
	hasError: boolean;
	error?: Error;
	errorInfo?: string;
	retryCount: number;
}

interface NetworkErrorBoundaryProps {
	children: React.ReactNode;
	fallback?: React.ComponentType<{
		error?: Error;
		retry: () => void;
		retryCount: number;
	}>;
}

export class NetworkErrorBoundary extends React.Component<
	NetworkErrorBoundaryProps,
	NetworkErrorBoundaryState
> {
	constructor(props: NetworkErrorBoundaryProps) {
		super(props);
		this.state = {
			hasError: false,
			retryCount: 0,
		};
	}

	static getDerivedStateFromError(
		error: Error,
	): Partial<NetworkErrorBoundaryState> {
		return {
			hasError: true,
			error,
		};
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		this.setState({
			error,
			errorInfo: errorInfo.componentStack || undefined,
		});
	}

	retry = () => {
		this.setState((prevState) => ({
			hasError: false,
			error: undefined,
			errorInfo: undefined,
			retryCount: prevState.retryCount + 1,
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
	retryCount,
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
							{error?.message ||
								"Network connection failed. Please check your internet connection."}
						</AlertDescription>
					</Alert>

					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">
							We're having trouble connecting to our servers. This could be due
							to:
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
								Retry attempt {retryCount}. If this continues, please contact
								support.
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

export function LoadingIndicator({
	message = "Loading...",
}: {
	message?: string;
}) {
	return (
		<div className="flex items-center justify-center p-8">
			<div className="text-center space-y-4">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
				<p className="text-muted-foreground">{message}</p>
			</div>
		</div>
	);
}
