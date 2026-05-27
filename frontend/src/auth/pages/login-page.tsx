import { Link } from "react-router-dom";
import { publicAssets } from "@/core/pages/public-home/cloudinary-assets";
import { LoginForm } from "../components";
import "../styles/auth.css";

const navItems = [
  { label: "Inicio", href: "/home" },
  { label: "Programas", href: "/home#programas" },
  { label: "Donar", href: "/donar" },
  { label: "Contacto", href: "/contacto" },
];

export function LoginPage() {
  return (
    <main className="auth-public-page">
      <nav className="auth-public-nav" aria-label="Navegación principal">
        <Link className="auth-public-brand" to="/home">
          <img src={publicAssets.logo} alt="Fundación MTM" />
        </Link>

        <div className="auth-public-links">
          {navItems.map((item) => (
            <Link key={item.href} to={item.href}>
              {item.label}
            </Link>
          ))}
          <Link className="auth-public-action" to="/register">
            Registrarse
          </Link>
        </div>
      </nav>

      <section
        className="auth-account-band"
        style={{
          backgroundImage: `linear-gradient(110deg, rgba(15, 31, 44, 0.72), rgba(34, 155, 137, 0.7) 54%, rgba(197, 215, 46, 0.58)), url(${publicAssets.banner})`,
        }}
      >
        <span>Mi cuenta</span>
        <h1>Acceso a MTM Conecta</h1>
        <p>
          Un espacio privado para organizar la gestión social, administrativa y
          solidaria de la Fundación Mujeres Trabajando por el Meta.
        </p>
      </section>

      <section className="auth-account-shell auth-account-shell--login">
        <div className="auth-account-card">
          <div className="auth-account-card-heading">
            <span className="auth-account-pill">
              <i className="pi pi-lock" aria-hidden="true" /> Acceso seguro
            </span>
          </div>
          <LoginForm />
        </div>

        <aside className="auth-account-visual">
          <img
            src={publicAssets.heroAlt}
            alt="Niña beneficiaria de la Fundación MTM"
          />
          <div className="auth-account-visual-copy">
            <span>Fundación MTM</span>
            <h2>Gestión con propósito</h2>
            <p>
              Centraliza beneficiarios, donaciones, campañas y eventos para que
              el acompañamiento llegue con más claridad a cada familia.
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}
