import { WifiOff } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Thin banner that appears at the top of the page when the device
 * loses network connectivity, and auto-dismisses when it reconnects.
 */
export function OfflineBanner() {
	const [isOffline, setIsOffline] = useState(() => !navigator.onLine);
	const [dismissedAt, setDismissedAt] = useState<number | null>(null);
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const handleOffline = () => {
			setIsOffline(true);
			setDismissedAt(null); // re-show if previously dismissed
			setVisible(true);
		};
		const handleOnline = () => {
			setIsOffline(false);
			// Give a 1.5s grace period to show "back online" before hiding
			setTimeout(() => setVisible(false), 1500);
		};

		window.addEventListener("offline", handleOffline);
		window.addEventListener("online", handleOnline);

		if (!navigator.onLine) setVisible(true);

		return () => {
			window.removeEventListener("offline", handleOffline);
			window.removeEventListener("online", handleOnline);
		};
	}, []);

	if (!visible) return null;

	return (
		<div
			role="alert"
			aria-live="assertive"
			className={cn(
				"fixed top-0 left-0 right-0 z-[9999] flex items-center justify-between gap-3 px-4 py-2 text-sm font-medium transition-all duration-300",
				isOffline
					? "bg-destructive text-destructive-foreground"
					: "bg-green-600 text-white",
			)}
		>
			<div className="flex items-center gap-2">
				<WifiOff className="w-4 h-4 shrink-0" />
				<span>
					{isOffline
						? "You are offline. Some features may be unavailable."
						: "Connection restored."}
				</span>
			</div>
			{isOffline && (
				<button
					type="button"
					onClick={() => setVisible(false)}
					className="text-xs underline underline-offset-2 opacity-80 hover:opacity-100"
				>
					Dismiss
				</button>
			)}
		</div>
	);
}
