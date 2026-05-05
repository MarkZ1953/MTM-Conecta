import { LoginForm } from "../components";
import "../styles/auth.css";

export function LoginPage() {
  return (
    <div className="auth-page">
      {/* Panel izquierdo — branding */}
      <aside className="auth-brand-panel">
        <div className="auth-brand-content">
          <div className="auth-brand-logo">
            <span className="auth-brand-icon">
              <i className="pi pi-heart-fill" />
            </span>
          </div>
          <h2 className="auth-brand-name">Fundación MTM</h2>
          <p className="auth-brand-tagline">
            Juntas transformamos la esperanza en acción. Apoyamos a niñas y
            niños con cáncer y a las familias que los rodean con amor y
            dedicación.
          </p>

          {/* Decoración de paleta */}
          <div className="auth-brand-palette">
            <span className="auth-palette-dot dot-rose" />
            <span className="auth-palette-dot dot-primary" />
            <span className="auth-palette-dot dot-teal" />
            <span className="auth-palette-dot dot-accent" />
          </div>

          <ul className="auth-brand-features">
            <li>
              <i className="pi pi-heart" />
              Acompañamiento integral a niños con cáncer
            </li>
            <li>
              <i className="pi pi-users" />
              Red de voluntarias comprometidas con la causa
            </li>
            <li>
              <i className="pi pi-shield" />
              Gestión transparente de recursos y actividades
            </li>
          </ul>
        </div>

        {/* Formas decorativas */}
        <div className="auth-brand-shape shape-1" />
        <div className="auth-brand-shape shape-2" />
        <div className="auth-brand-shape shape-3" />
      </aside>

      {/* Panel derecho — formulario */}
      <main className="auth-form-panel">
        <div className="auth-form-container">
          <div className="auth-form-mission">
            <span className="auth-mission-badge">
              <i className="pi pi-heart-fill" /> Juntas hacemos la diferencia
            </span>
          </div>

          <LoginForm />
        </div>
      </main>
    </div>
  );
}
