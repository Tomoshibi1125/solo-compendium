import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { enableTouchOptimizations } from "./lib/mobile";

// Wait for DOM to be ready
function initApp() {
  const rootElement = document.getElementById("root");

  if (!rootElement) {
    console.error("Root element not found. Make sure index.html has a div with id='root'");
    // Create a fallback error display
    document.body.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #1a1a2e; color: #fff; font-family: system-ui;">
        <div style="text-align: center; padding: 2rem;">
          <h1 style="font-size: 2rem; margin-bottom: 1rem;">Application Error</h1>
          <p>Root element not found. Please check index.html</p>
        </div>
      </div>
    `;
    return;
  }

  try {
    // Enable mobile optimizations after DOM is ready
    enableTouchOptimizations();

    // Render the app
    const root = createRoot(rootElement);
    root.render(<App />);
  } catch (error) {
    console.error("Failed to initialize app:", error);
    rootElement.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #1a1a2e; color: #fff; font-family: system-ui; padding: 2rem;">
        <div style="text-align: center; max-width: 600px;">
          <h1 style="font-size: 2rem; margin-bottom: 1rem; color: #ef4444;">Application Error</h1>
          <p style="margin-bottom: 1rem;">Failed to initialize the application.</p>
          <pre style="background: #0f0f1e; padding: 1rem; border-radius: 0.5rem; overflow: auto; text-align: left; font-size: 0.875rem;">
            ${error instanceof Error ? error.message : String(error)}
          </pre>
          <button onclick="window.location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #3b82f6; color: white; border: none; border-radius: 0.5rem; cursor: pointer;">
            Reload Page
          </button>
        </div>
      </div>
    `;
  }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
