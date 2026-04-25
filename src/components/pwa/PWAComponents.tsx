// WardenA Install Prompt Component
export function WardenAInstallPrompt({
	isInstallable,
	isInstalled,
	onInstall,
}: {
	isInstallable: boolean;
	isInstalled: boolean;
	onInstall: () => void;
}) {
	if (!isInstallable || isInstalled) {
		return null;
	}

	return (
		<div className="fixed left-4 right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-[70] p-4 bg-background border rounded-lg shadow-lg sm:left-auto sm:max-w-sm">
			<div className="flex items-center space-x-3">
				<div className="text-sm">
					<p className="font-medium">Install Rift Ascendant</p>
					<p className="text-muted-foreground text-xs">
						Get offline access and a native app experience
					</p>
				</div>
				<button
					type="button"
					onClick={onInstall}
					className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90"
				>
					Install
				</button>
			</div>
		</div>
	);
}

// Offline Status Component
export function OfflineStatus({
	isOnline,
	connectionType: _connectionType,
	syncQueueLength,
}: {
	isOnline: boolean;
	connectionType: string;
	syncQueueLength: number;
}) {
	if (isOnline && syncQueueLength === 0) {
		return null;
	}

	return (
		<div
			className="fixed left-4 right-4 top-[max(1rem,env(safe-area-inset-top))] z-[70] p-3 bg-background border rounded-lg shadow-lg sm:left-auto sm:max-w-xs"
			aria-live="polite"
		>
			<div className="flex items-center space-x-2">
				<div
					className={`w-2 h-2 rounded-full ${
						isOnline ? "bg-green-500" : "bg-red-500"
					}`}
				/>
				<div className="text-sm">
					<p className="font-medium">{isOnline ? "Online" : "Offline"}</p>
					{!isOnline && (
						<p className="text-muted-foreground text-xs">
							Changes will sync when online
						</p>
					)}
					{isOnline && syncQueueLength > 0 && (
						<p className="text-muted-foreground text-xs">
							Syncing {syncQueueLength} items
						</p>
					)}
					{!isOnline && syncQueueLength > 0 && (
						<p className="text-muted-foreground text-xs">
							{syncQueueLength} items pending sync
						</p>
					)}
				</div>
			</div>
		</div>
	);
}
