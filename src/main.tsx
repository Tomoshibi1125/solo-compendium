import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { enableTouchOptimizations } from "./lib/mobile";
import { error as logError, warn as logWarn } from "./lib/logger";
import { initSentry } from "./lib/sentry";

// Initialize Sentry before anything else
initSentry();

// Wait for DOM to be ready
function initApp() {
  const rootElement = document.getElementById("root");

  if (!rootElement) {
    logError("Root element not found. Make sure index.html has a div with id='root'");
    // Create a fallback error display using safe DOM manipulation
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = 'display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #1a1a2e; color: #fff; font-family: system-ui;';
    const contentDiv = document.createElement('div');
    contentDiv.style.cssText = 'text-align: center; padding: 2rem;';
    const h1 = document.createElement('h1');
    h1.style.cssText = 'font-size: 2rem; margin-bottom: 1rem;';
    h1.textContent = 'Application Error';
    const p = document.createElement('p');
    p.textContent = 'Root element not found. Please check index.html';
    contentDiv.appendChild(h1);
    contentDiv.appendChild(p);
    errorDiv.appendChild(contentDiv);
    document.body.appendChild(errorDiv);
    return;
  }

  try {
    // Enable mobile optimizations after DOM is ready (non-blocking)
    try {
      enableTouchOptimizations();
    } catch (mobileError) {
      logWarn('Mobile optimizations failed:', mobileError);
      // Continue anyway - mobile optimizations are not critical
    }

    // Render the app
    const root = createRoot(rootElement);
    root.render(<App />);
  } catch (error) {
    logError("Failed to initialize app:", error);
    // Create error display using safe DOM manipulation instead of innerHTML
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = 'display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #1a1a2e; color: #fff; font-family: system-ui; padding: 2rem;';
    const contentDiv = document.createElement('div');
    contentDiv.style.cssText = 'text-align: center; max-width: 600px;';
    const h1 = document.createElement('h1');
    h1.style.cssText = 'font-size: 2rem; margin-bottom: 1rem; color: #ef4444;';
    h1.textContent = 'Application Error';
    const p = document.createElement('p');
    p.style.cssText = 'margin-bottom: 1rem;';
    p.textContent = 'Failed to initialize the application.';
    const pre = document.createElement('pre');
    pre.style.cssText = 'background: #0f0f1e; padding: 1rem; border-radius: 0.5rem; overflow: auto; text-align: left; font-size: 0.875rem;';
    pre.textContent = error instanceof Error ? error.message : String(error);
    const button = document.createElement('button');
    button.style.cssText = 'margin-top: 1rem; padding: 0.5rem 1rem; background: #3b82f6; color: white; border: none; border-radius: 0.5rem; cursor: pointer;';
    button.textContent = 'Reload Page';
    button.onclick = () => window.location.reload();
    contentDiv.appendChild(h1);
    contentDiv.appendChild(p);
    contentDiv.appendChild(pre);
    contentDiv.appendChild(button);
    errorDiv.appendChild(contentDiv);
    rootElement.appendChild(errorDiv);
  }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
