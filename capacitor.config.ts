import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Misty Pearl H2 — Capacitor configuration for native iOS / Android.
 *
 * Wraps the existing PWA in a native shell so the app can ship to the
 * App Store + Play Store with biometric auth, native push, native
 * filesystem access, and "real-app" perception. The web bundle is
 * identical — Capacitor just hosts it inside a WKWebView / WebView.
 *
 * To actually build native binaries:
 *   1. `npm i --save @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android`
 *      (run this only when you're ready to bundle natively — the
 *      web app continues to work without these.)
 *   2. `npx cap init "Rift Ascendant" "com.riftascendant.app"` once.
 *   3. `npm run build && npx cap copy && npx cap open ios` (or
 *      `android`) to launch Xcode / Android Studio.
 *
 * Signing certs + store listings are not in this repo — they live in
 * the engineer's local Apple Developer / Google Play accounts.
 */
const config: CapacitorConfig = {
	appId: "com.riftascendant.app",
	appName: "Rift Ascendant",
	webDir: "dist",
	bundledWebRuntime: false,
	server: {
		// Allow live-reload during development. Comment out for release.
		// url: "http://192.168.1.10:8080",
		cleartext: false,
		androidScheme: "https",
	},
	ios: {
		contentInset: "always",
		limitsNavigationsToAppBoundDomains: true,
		preferredContentMode: "mobile",
	},
	android: {
		allowMixedContent: false,
		captureInput: true,
		webContentsDebuggingEnabled: false,
	},
	plugins: {
		PushNotifications: {
			presentationOptions: ["badge", "sound", "alert"],
		},
		StatusBar: {
			style: "DARK",
			backgroundColor: "#0a0a0f",
		},
		SplashScreen: {
			launchShowDuration: 1500,
			backgroundColor: "#0a0a0f",
			androidScaleType: "CENTER_CROP",
		},
	},
};

export default config;
