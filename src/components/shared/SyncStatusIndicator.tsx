import { CloudOff, CloudUpload, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { notifyError, notifySuccess } from "@/lib/notify";
import { flushSyncQueue, getSyncQueue } from "@/lib/syncManager";
import { cn } from "@/lib/utils";

interface SyncStatusIndicatorProps {
	className?: string;
	/** Poll interval for the queue length, ms. */
	pollMs?: number;
}

/**
 * Surfaces the offline sync queue: shows "N pending" with a manual Sync-now
 * retry when online, or an "Offline" marker when disconnected. Renders nothing
 * when online with an empty queue (the common case), so it stays out of the
 * way until there's something to report.
 */
export function SyncStatusIndicator({
	className,
	pollMs = 5000,
}: SyncStatusIndicatorProps) {
	const [pending, setPending] = useState(0);
	const [online, setOnline] = useState(() =>
		typeof navigator === "undefined" ? true : navigator.onLine,
	);
	const [syncing, setSyncing] = useState(false);

	const refresh = useCallback(async () => {
		const queue = await getSyncQueue();
		setPending(queue.length);
	}, []);

	useEffect(() => {
		void refresh();
		const id = window.setInterval(() => void refresh(), pollMs);
		const goOnline = () => {
			setOnline(true);
			void refresh();
		};
		const goOffline = () => setOnline(false);
		window.addEventListener("online", goOnline);
		window.addEventListener("offline", goOffline);
		return () => {
			window.clearInterval(id);
			window.removeEventListener("online", goOnline);
			window.removeEventListener("offline", goOffline);
		};
	}, [refresh, pollMs]);

	const handleRetry = useCallback(async () => {
		setSyncing(true);
		try {
			const result = await flushSyncQueue();
			if (result.failed > 0) {
				void notifyError("Sync incomplete", {
					message: `${result.failed} change${
						result.failed === 1 ? "" : "s"
					} couldn't sync and will retry.`,
					category: "sync",
				});
			} else if (result.success > 0) {
				void notifySuccess("Changes synced", {
					message: `${result.success} change${
						result.success === 1 ? "" : "s"
					} saved to the cloud.`,
					category: "sync",
				});
			}
		} finally {
			setSyncing(false);
			await refresh();
		}
	}, [refresh]);

	if (online && pending === 0) return null;

	return (
		<div
			className={cn("flex items-center gap-1.5 text-[11px]", className)}
			title={
				online
					? `${pending} change${pending === 1 ? "" : "s"} waiting to sync`
					: "You're offline — changes are queued"
			}
		>
			{online ? (
				<CloudUpload className="w-3.5 h-3.5 text-primary" />
			) : (
				<CloudOff className="w-3.5 h-3.5 text-warning" />
			)}
			<span className="text-muted-foreground">
				{online ? `${pending} pending` : "Offline"}
			</span>
			{online && pending > 0 && (
				<Button
					type="button"
					variant="ghost"
					size="icon"
					className="h-6 w-6"
					onClick={handleRetry}
					disabled={syncing}
					title="Sync now"
				>
					<RefreshCw className={cn("w-3 h-3", syncing && "animate-spin")} />
				</Button>
			)}
		</div>
	);
}
