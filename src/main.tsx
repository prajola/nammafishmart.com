import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { StoreProvider } from "./context/store";
import { UIProvider } from "./context/ui";
import "@fontsource-variable/inter";
import "@fontsource-variable/space-grotesk";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <StoreProvider>
        <UIProvider>
          <App />
        </UIProvider>
      </StoreProvider>
    </BrowserRouter>
  </StrictMode>
);
