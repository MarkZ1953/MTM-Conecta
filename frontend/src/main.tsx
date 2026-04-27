import "primereact/resources/themes/lara-light-cyan/theme.css";
import "./theme.css"; /* Paleta MTM-Conecta — override de .p-* classes */
import { PrimeReactProvider } from "primereact/api";
import { createRoot } from "react-dom/client";
import "primeicons/primeicons.css";
import { StrictMode } from "react";
import "primeflex/primeflex.css";
import App from "./App.tsx";
// import { AuthProvider } from "./auth";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      {/* <AuthProvider> */}
      <PrimeReactProvider>
        <App />
      </PrimeReactProvider>
      {/* </AuthProvider> */}
    </BrowserRouter>
  </StrictMode>,
);
