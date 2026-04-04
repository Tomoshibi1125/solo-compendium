import path from "node:path";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import wasm from "vite-plugin-wasm";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), wasm()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	build: {
		outDir: "dist-sourcebook",
		rollupOptions: {
			input: {
				main: path.resolve(__dirname, "source-book.html"),
			},
		},
		target: "es2022",
		minify: "esbuild",
		chunkSizeWarningLimit: 5000,
	},
	base: "./", // Ensure relative paths for portable download
});
