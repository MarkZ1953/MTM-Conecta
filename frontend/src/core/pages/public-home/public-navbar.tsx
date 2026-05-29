import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { publicAssets } from "./cloudinary-assets";
import "./public-navbar.css";

type PublicNavbarProps = {
  onSectionNavigate?: (target: string) => void;
};

type ActionLink = {
  label: string;
  path: string;
  target?: string;
  icon?: string;
};

const institutionalLinks = [
  { label: "Sobre nosotros", path: "/nosotros" },
  { label: "Programas", path: "/programas" },
  { label: "Noticias", path: "/noticias" },
  { label: "Contacto", path: "/contacto" },
];

const actionLinks: ActionLink[] = [
  { label: "Inicio", path: "/home" },
  { label: "Vincúlate", path: "/donar", icon: "pi-heart-fill" },
  { label: "Cómo puedo ayudar", path: "/como-ayudar" },
  { label: "Eventos", path: "/eventos-publicos" },
  { label: "Padrino permanente", path: "/padrino-permanente" },
];

export function PublicNavbar({ onSectionNavigate }: PublicNavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const handleSection = (target?: string) => {
    if (!target || !onSectionNavigate) return;
    setMenuOpen(false);
    onSectionNavigate(target);
  };

  return (
    <>
      <header className="public-navbar public-navbar-top">
        <div className="public-navbar-social" aria-label="Redes sociales">
          <a href="https://www.facebook.com/" target="_blank" rel="noreferrer" aria-label="Facebook">
            <i className="pi pi-facebook" />
          </a>
          <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram">
            <i className="pi pi-instagram" />
          </a>
          <a href="https://wa.me/" target="_blank" rel="noreferrer" aria-label="WhatsApp">
            <i className="pi pi-whatsapp" />
          </a>
        </div>

        <span className="public-navbar-mission">
          Que el cáncer infantil no signifique vivir con miedo y sin esperanza
        </span>

        <div className="public-navbar-tools">
          <Link to="/blog" aria-label="Buscar noticias">
            <i className="pi pi-search" />
          </Link>
          <Link to="/login">
            <i className="pi pi-user" />
            <span>Iniciar sesión / Registrarse</span>
          </Link>
        </div>
      </header>

      <div className="public-navbar public-navbar-sticky">
        <div className="public-navbar-main">
          <img
            className="public-navbar-mark public-navbar-mark-left"
            src={publicAssets.heartLogo}
            alt=""
            aria-hidden="true"
          />
          <img
            className="public-navbar-mark public-navbar-mark-right"
            src={publicAssets.heartLogo}
            alt=""
            aria-hidden="true"
          />

          <Link className="public-navbar-brand" to="/home" onClick={() => handleSection("inicio")}>
            <img src={publicAssets.logoCompact} alt="Fundación Mujeres Trabajando por el Meta" />
          </Link>

          <nav className="public-navbar-links" aria-label="Menú institucional">
            {institutionalLinks.map((item) => (
              <Link
                key={item.path}
                className={location.pathname === item.path ? "is-active" : ""}
                to={item.path}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <button
            className="public-navbar-toggle"
            type="button"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setMenuOpen((value) => !value)}
          >
            <i className={`pi ${menuOpen ? "pi-times" : "pi-bars"}`} />
          </button>
        </div>

        <nav
          className={`public-navbar-actions ${menuOpen ? "is-open" : ""}`}
          aria-label="Acciones principales"
        >
          {actionLinks.map((item) =>
            item.target && onSectionNavigate ? (
              <button
                key={item.label}
                type="button"
                className={location.pathname === item.path ? "is-active" : ""}
                onClick={() => handleSection(item.target)}
              >
                {item.icon && <i className={`pi ${item.icon}`} />}
                <span>{item.label}</span>
              </button>
            ) : (
              <Link
                key={item.label}
                className={location.pathname === item.path ? "is-active" : ""}
                to={item.path}
              >
                {item.icon && <i className={`pi ${item.icon}`} />}
                <span>{item.label}</span>
              </Link>
            ),
          )}
        </nav>
      </div>
    </>
  );
}
