import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div className="p-10 bg-gray-100">
      <h2 className="text-3xl font-bold text-yellow-500">
        This should be yellow
      </h2>
    </div>
    {/* <App /> */}
  </StrictMode>,
);
