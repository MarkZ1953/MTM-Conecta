import { Link } from "react-router-dom";
import { useState } from "react";
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
  { label: "Sobre nosotros", target: "nosotros" },
  { label: "Programas", target: "programas" },
  { label: "Noticias", target: "noticias" },
  { label: "Contacto", target: "contacto" },
];

const actionLinks: ActionLink[] = [
  { label: "Inicio", target: "inicio", path: "/home" },
  { label: "Quiero donar", path: "/donar", icon: "pi-heart-fill" },
  { label: "Como puedo ayudar", target: "ayudar", path: "/home#ayudar" },
  { label: "Eventos", target: "eventos", path: "/eventos-publicos" },
  { label: "Padrino permanente", path: "/padrino-permanente" },
];

export function PublicNavbar({ onSectionNavigate }: PublicNavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSection = (target?: string) => {
    if (!target || !onSectionNavigate) return;
    setMenuOpen(false);
    onSectionNavigate(target);
  };

  return (
    <header className="public-navbar">
      <div className="public-navbar-top">
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
          Que el cancer infantil no signifique vivir con miedo y sin esperanza
        </span>

        <div className="public-navbar-tools">
          <Link to="/blog" aria-label="Buscar noticias">
            <i className="pi pi-search" />
          </Link>
          <Link to="/login">
            <i className="pi pi-user" />
            <span>Iniciar sesion / Registrarse</span>
          </Link>
        </div>
      </div>

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
          <img src={publicAssets.logoCompact} alt="Fundacion Mujeres Trabajando por el Meta" />
        </Link>

        <nav className="public-navbar-links" aria-label="Menu institucional">
          {institutionalLinks.map((item) =>
            onSectionNavigate ? (
              <button key={item.target} type="button" onClick={() => handleSection(item.target)}>
                {item.label}
              </button>
            ) : (
              <Link key={item.target} to={`/home#${item.target}`}>
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <button
          className="public-navbar-toggle"
          type="button"
          aria-label={menuOpen ? "Cerrar menu" : "Abrir menu"}
          onClick={() => setMenuOpen((value) => !value)}
        >
          <i className={`pi ${menuOpen ? "pi-times" : "pi-bars"}`} />
        </button>
      </div>

      <nav
        className={`public-navbar-actions ${menuOpen ? "is-open" : ""}`}
        aria-label="Acciones principales"
      >
        {actionLinks.map((item, index) =>
          item.target && onSectionNavigate ? (
            <button
              key={item.label}
              type="button"
              className={index === 0 ? "is-active" : ""}
              onClick={() => handleSection(item.target)}
            >
              {item.icon && <i className={`pi ${item.icon}`} />}
              <span>{item.label}</span>
            </button>
          ) : (
            <Link key={item.label} className={index === 0 ? "is-active" : ""} to={item.path}>
              {item.icon && <i className={`pi ${item.icon}`} />}
              <span>{item.label}</span>
            </Link>
          ),
        )}
      </nav>
    </header>
  );
}
