import { Link } from "react-router-dom";
import { publicAssets } from "@/core/pages/public-home/cloudinary-assets";
import { RegisterForm } from "../components/forms/register/register-form";
import "../styles/auth.css";

const navItems = [
  { label: "Inicio", href: "/home" },
  { label: "Programas", href: "/home#programas" },
  { label: "Donar", href: "/donar" },
  { label: "Contacto", href: "/contacto" },
];

export function RegisterPage() {
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
          <Link className="auth-public-action" to="/login">
            Iniciar sesión
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
        <h1>Registro de usuarios</h1>
        <p>
          Crea tu acceso para colaborar con la administración de programas,
          campañas y procesos internos de la fundación.
        </p>
      </section>

      <section className="auth-account-shell auth-account-shell--register">
        <div className="auth-account-card">
          <div className="auth-account-card-heading">
            <span className="auth-account-pill auth-account-pill--rose">
              <i className="pi pi-heart-fill" aria-hidden="true" /> Comunidad
              MTM
            </span>
          </div>
          <RegisterForm />
        </div>

        <aside className="auth-account-visual">
          <img
            src={publicAssets.careOne}
            alt="Actividad de acompañamiento de la Fundación MTM"
          />
          <div className="auth-account-visual-copy">
            <span>Hogar de Paso Victoria</span>
            <h2>Un acceso para servir mejor</h2>
            <p>
              La plataforma acompaña el trabajo diario de quienes apoyan a
              niñas, niños y familias durante el proceso oncológico.
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}
