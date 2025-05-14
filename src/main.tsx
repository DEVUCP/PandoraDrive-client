import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ServiceLocatorProvider } from "./Contexts/ServiceLocatorContext.tsx";
import { AuthProvider } from "./Contexts/AuthContext.tsx";
import { FSProvider } from "./Contexts/FSContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ServiceLocatorProvider>
      <AuthProvider>
        <FSProvider>
          <App />
        </FSProvider>
      </AuthProvider>
    </ServiceLocatorProvider>
  </StrictMode>,
);
