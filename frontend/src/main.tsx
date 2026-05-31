import "primereact/resources/themes/lara-light-cyan/theme.css";
import "./theme.css"; /* Paleta MTM-Conecta — override de .p-* classes */
import "./index.css";
import { PrimeReactProvider } from "primereact/api";
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { UIToast } from "./components";
import "primeicons/primeicons.css";
import { StrictMode } from "react";
import "primeflex/primeflex.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <PrimeReactProvider>
        <UIToast />
        <App />
      </PrimeReactProvider>
    </BrowserRouter>
  </StrictMode>,
);
