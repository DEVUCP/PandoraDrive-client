import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ServiceLocatorProvider } from "./Contexts/ServiceLocatorContext.tsx";
import { AuthProvider } from "./Contexts/AuthContext.tsx";
import { FSCacheProvider } from "./Contexts/FSCacheContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ServiceLocatorProvider>
      <AuthProvider>
        <FSCacheProvider>
          <App />
        </FSCacheProvider>
      </AuthProvider>
    </ServiceLocatorProvider>
  </StrictMode>,
);
