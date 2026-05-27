import { LoginForm } from "../components";
import "../styles/auth.css";

export function LoginPage() {
  return (
    <div className="auth-page auth-page--login">
      <aside className="auth-brand-panel">
        <div className="auth-brand-content">
          <div className="auth-brand-logo auth-brand-logo--image">
            <img src="/logo-mtm.png" alt="Fundación MTM" />
          </div>
          <span className="auth-brand-eyebrow">Plataforma administrativa</span>
          <h2 className="auth-brand-name">MTM Conecta</h2>
          <p className="auth-brand-tagline">
            Gestiona beneficiarios, eventos, donaciones y campañas desde un
            espacio claro, seguro y pensado para el trabajo diario de la
            fundación.
          </p>

          <div className="auth-brand-snapshot" aria-label="Resumen de módulos">
            <div>
              <strong>360°</strong>
              <span>Gestión integral</span>
            </div>
            <div>
              <strong>24/7</strong>
              <span>Información disponible</span>
            </div>
          </div>

          <ul className="auth-brand-features">
            <li>
              <i className="pi pi-check-circle" />
              Datos organizados para decisiones rápidas
            </li>
            <li>
              <i className="pi pi-shield" />
              Acceso privado para equipos autorizados
            </li>
            <li>
              <i className="pi pi-chart-line" />
              Reportes y trazabilidad en un solo lugar
            </li>
          </ul>
        </div>
      </aside>

      <main className="auth-form-panel">
        <div className="auth-form-container">
          <div className="auth-form-mission">
            <span className="auth-mission-badge">
              <i className="pi pi-lock" /> Acceso seguro
            </span>
          </div>

          <LoginForm />
        </div>
      </main>
    </div>
  );
}
