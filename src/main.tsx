import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { enableTouchOptimizations } from "./lib/mobile";

// Enable mobile optimizations
enableTouchOptimizations();

createRoot(document.getElementById("root")!).render(<App />);
