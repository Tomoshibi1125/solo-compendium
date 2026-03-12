import { AlertTriangle } from "lucide-react";
import type React from "react";
import type { ReactNode } from "react";
import {
	type FallbackProps,
	ErrorBoundary as ReactErrorBoundary,
} from "react-error-boundary";
import { error as logError } from "@/lib/logger";
import { captureException } from "@/lib/sentry";
import { Button } from "./ui/button";
import { SystemWindow } from "./ui/SystemWindow";

interface Props {
	children: ReactNode;
	fallback?: ReactNode;
}

const DefaultErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
	return (
		<div className="container flex items-center justify-center min-h-[50vh] px-4 py-8 mx-auto max-w-2xl">
			<SystemWindow
				title="SYSTEM ERROR"
				variant="alert"
				className="w-full text-center"
			>
				<AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
				<h2 className="font-display text-2xl font-bold mb-2 gradient-text-shadow">
					FATAL ANOMALY
				</h2>
				<p className="text-muted-foreground mb-4">
					The System has encountered an anomaly. Even under the Prime
					Architect's watch, reality sometimes glitches. Please try resetting
					the view.
				</p>
				{error !== undefined && error !== null && (
					<details className="text-left mb-4">
						<summary className="cursor-pointer text-sm text-muted-foreground mb-2">
							Error details
						</summary>
						<pre className="text-xs bg-muted p-4 rounded overflow-auto max-h-[200px]">
							{String(error)}
						</pre>
					</details>
				)}
				<div className="flex gap-4 justify-center flex-wrap">
					<Button onClick={resetErrorBoundary} variant="default">
						Try Again
					</Button>
					<Button onClick={() => window.location.reload()} variant="outline">
						Refresh Page
					</Button>
					<Button
						onClick={() => (window.location.href = "/")}
						variant="outline"
					>
						Go Home
					</Button>
				</div>
			</SystemWindow>
		</div>
	);
};

const handleError = (error: unknown, info: React.ErrorInfo) => {
	// Log error for debugging
	logError("ErrorBoundary caught an error:", error, info);

	// Report to Sentry
	captureException(error as Error, {
		react: {
			componentStack: info.componentStack,
		},
	});
};

export const ErrorBoundary = ({ children, fallback }: Props) => {
	return (
		<ReactErrorBoundary
			FallbackComponent={
				fallback ? () => <>{fallback}</> : DefaultErrorFallback
			}
			onError={handleError}
		>
			{children}
		</ReactErrorBoundary>
	);
};
