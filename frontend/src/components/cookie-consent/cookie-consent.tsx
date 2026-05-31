import { useEffect, useState } from "react";
import { publicAssets } from "@/core/pages/public-home/cloudinary-assets";
import "./cookie-consent.css";

type ConsentMode = "summary" | "preferences";

type CookiePreferences = {
  necessary: true;
  analytics: boolean;
  communications: boolean;
};

const STORAGE_KEY = "mtm_cookie_consent_v1";

const defaultPreferences: CookiePreferences = {
  necessary: true,
  analytics: false,
  communications: false,
};

const savePreferences = (preferences: CookiePreferences) => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      ...preferences,
      savedAt: new Date().toISOString(),
    }),
  );
};

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<ConsentMode>("summary");
  const [preferences, setPreferences] =
    useState<CookiePreferences>(defaultPreferences);

  useEffect(() => {
    setVisible(!localStorage.getItem(STORAGE_KEY));
  }, []);

  const closeWith = (nextPreferences: CookiePreferences) => {
    savePreferences(nextPreferences);
    setVisible(false);
  };

  const acceptAll = () => {
    closeWith({
      necessary: true,
      analytics: true,
      communications: true,
    });
  };

  const rejectOptional = () => {
    closeWith(defaultPreferences);
  };

  const toggle = (key: keyof Omit<CookiePreferences, "necessary">) => {
    setPreferences((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  if (!visible) return null;

  return (
    <div className="cookie-consent" role="presentation">
      <section
        className="cookie-consent-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-consent-title"
      >
        <button
          className="cookie-consent-close"
          type="button"
          aria-label="Cerrar aviso de cookies"
          onClick={rejectOptional}
        >
          <i className="pi pi-times" />
        </button>

        <header className="cookie-consent-header">
          <img src={publicAssets.logo} alt="Fundación MTM" />
          <h2 id="cookie-consent-title">Gestionar consentimiento</h2>
        </header>

        {mode === "summary" ? (
          <>
            <div className="cookie-consent-body">
              <p>
                Utilizamos cookies necesarias para que el sitio funcione y,
                con tu autorización, cookies de analítica y comunicación para
                mejorar la experiencia, entender el uso del sitio y compartir
                campañas de la fundación.
              </p>
            </div>

            <div className="cookie-consent-actions">
              <button type="button" className="cookie-btn accept" onClick={acceptAll}>
                Aceptar
              </button>
              <button type="button" className="cookie-btn deny" onClick={rejectOptional}>
                Denegar
              </button>
              <button
                type="button"
                className="cookie-btn preferences"
                onClick={() => setMode("preferences")}
              >
                Ver preferencias
              </button>
            </div>

            <footer className="cookie-consent-links">
              <a href="/contacto">Política de Cookies</a>
              <a href="/contacto">Protección de Datos Personales</a>
            </footer>
          </>
        ) : (
          <>
            <div className="cookie-consent-preferences">
              <article>
                <div>
                  <h3>Cookies necesarias</h3>
                  <p>Permiten seguridad, navegación y preferencias básicas.</p>
                </div>
                <span className="cookie-required">Siempre activas</span>
              </article>

              <article>
                <div>
                  <h3>Analítica</h3>
                  <p>Nos ayuda a entender qué secciones son más útiles.</p>
                </div>
                <button
                  type="button"
                  className={`cookie-switch ${preferences.analytics ? "on" : ""}`}
                  aria-pressed={preferences.analytics}
                  onClick={() => toggle("analytics")}
                >
                  <span />
                </button>
              </article>

              <article>
                <div>
                  <h3>Comunicación</h3>
                  <p>Permite mejorar mensajes sobre campañas y donaciones.</p>
                </div>
                <button
                  type="button"
                  className={`cookie-switch ${preferences.communications ? "on" : ""}`}
                  aria-pressed={preferences.communications}
                  onClick={() => toggle("communications")}
                >
                  <span />
                </button>
              </article>
            </div>

            <div className="cookie-consent-actions compact">
              <button
                type="button"
                className="cookie-btn deny"
                onClick={() => setMode("summary")}
              >
                Volver
              </button>
              <button
                type="button"
                className="cookie-btn accept"
                onClick={() => closeWith(preferences)}
              >
                Guardar preferencias
              </button>
              <button
                type="button"
                className="cookie-btn preferences"
                onClick={acceptAll}
              >
                Aceptar todas
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
