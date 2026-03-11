import { createRoot } from "react-dom/client";
import { registerSW } from 'virtual:pwa-register';
import { installGlobalErrorHandlers } from "./lib/error-tracking";
import App from "./App";
import "./index.css";

// Install global error handlers for uncaught errors and unhandled rejections
installGlobalErrorHandlers();

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  registerSW({ immediate: true });
}

createRoot(document.getElementById("root")!).render(<App />);
