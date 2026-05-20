import { RegisterForm } from "../components/forms/register/register-form";
import "../styles/auth.css";

export function RegisterPage() {
  return (
    <div className="auth-page auth-page--register">
      {/* Panel izquierdo — formulario en register */}
      <main className="auth-form-panel">
        <div className="auth-form-container">
          <div className="auth-form-mission">
            <span className="auth-mission-badge">
              <i className="pi pi-heart-fill" /> Juntas hacemos la diferencia
            </span>
          </div>
          <RegisterForm />
        </div>
      </main>

      {/* Panel derecho — branding (invertido vs login) */}
      <aside className="auth-brand-panel auth-brand-panel--right">
        <div className="auth-brand-content">
          <div className="auth-brand-logo">
            <span className="auth-brand-icon">
              <i className="pi pi-heart-fill" />
            </span>
          </div>
          <h2 className="auth-brand-name">Sé parte del cambio</h2>
          <p className="auth-brand-tagline">
            Cada voluntaria que se une a nuestra red acerca a más niñas y niños
            al tratamiento y la esperanza que merecen.
          </p>

          <div className="auth-brand-palette">
            <span className="auth-palette-dot dot-rose" />
            <span className="auth-palette-dot dot-primary" />
            <span className="auth-palette-dot dot-teal" />
            <span className="auth-palette-dot dot-accent" />
          </div>

          <ul className="auth-brand-features">
            <li>
              <i className="pi pi-heart" />
              Apoya a niños con cáncer desde donde estés
            </li>
            <li>
              <i className="pi pi-star" />
              Forma parte de una comunidad de mujeres que transforman vidas
            </li>
            <li>
              <i className="pi pi-verified" />
              Tu trabajo tendrá impacto real y medible
            </li>
          </ul>
        </div>

        <div className="auth-brand-shape shape-1" />
        <div className="auth-brand-shape shape-2" />
        <div className="auth-brand-shape shape-3" />
      </aside>
    </div>
  );
}
