import { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext, canAccessAdminPanel, getPanelLabel } from "@/auth";
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
  lightLabel?: string;
  strongLabel?: string;
};

const institutionalLinks = [
  { label: "Sobre nosotros", path: "/nosotros" },
  { label: "Programas", path: "/programas" },
  { label: "Noticias", path: "/noticias" },
  { label: "Contacto", path: "/contacto" },
];

const actionLinks: ActionLink[] = [
  { label: "Inicio", path: "/home", strongLabel: "Inicio" },
  {
    label: "Cómo puedo ayudar",
    path: "/como-ayudar",
    lightLabel: "¿Cómo",
    strongLabel: "puedo ayudar?",
  },
  { label: "Eventos", path: "/eventos-publicos", strongLabel: "Eventos" },
  {
    label: "Padrino permanente",
    path: "/padrino-permanente",
    lightLabel: "Padrino",
    strongLabel: "permanente",
  },
];

function ActionLabel({ item }: { item: ActionLink }) {
  return (
    <>
      {item.icon && <i className={`pi ${item.icon}`} />}
      <span className="public-navbar-action-text">
        {item.lightLabel && <span className="public-navbar-action-light">{item.lightLabel}</span>}
        <span className="public-navbar-action-strong">{item.strongLabel ?? item.label}</span>
      </span>
    </>
  );
}

export function PublicNavbar({ onSectionNavigate }: PublicNavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const topBarRef = useRef<HTMLElement | null>(null);
  const compactStateRef = useRef(false);
  const frameRef = useRef<number | null>(null);
  const location = useLocation();
  const { logged, logout, user } = useContext(AuthContext);
  const showPanelAccess = logged && canAccessAdminPanel(user);

  useEffect(() => {
    const updateCompactState = () => {
      const topBarHeight = topBarRef.current?.offsetHeight ?? 42;
      const scrollY = window.scrollY;
      const hysteresis = 14;
      const nextCompactState = compactStateRef.current
        ? scrollY > Math.max(0, topBarHeight - hysteresis)
        : scrollY >= topBarHeight + hysteresis;

      if (compactStateRef.current !== nextCompactState) {
        compactStateRef.current = nextCompactState;
        setIsCompact(nextCompactState);
      }
    };

    const scheduleCompactUpdate = () => {
      if (frameRef.current !== null) return;

      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = null;
        updateCompactState();
      });
    };

    updateCompactState();
    window.addEventListener("scroll", scheduleCompactUpdate, { passive: true });
    window.addEventListener("resize", scheduleCompactUpdate);

    return () => {
      window.removeEventListener("scroll", scheduleCompactUpdate);
      window.removeEventListener("resize", scheduleCompactUpdate);

      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const handleSection = (target?: string) => {
    if (!target || !onSectionNavigate) return;
    setMenuOpen(false);
    onSectionNavigate(target);
  };

  return (
    <>
      <header ref={topBarRef} className="public-navbar public-navbar-top">
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
          {logged ? (
            <>
              {showPanelAccess && (
                <Link className="public-navbar-panel-link" to="/">
                  <i className="pi pi-th-large" />
                  <span>{getPanelLabel(user)}</span>
                </Link>
              )}
              <Link className="public-navbar-account-link" to="/mi-cuenta">
                <i className="pi pi-user" />
                <span>Mi cuenta</span>
              </Link>
              <button className="public-navbar-logout-btn" type="button" onClick={logout}>
                <i className="pi pi-sign-out" />
                <span>Cerrar sesión</span>
              </button>
            </>
          ) : (
            <Link to="/login">
              <i className="pi pi-user" />
              <span>Iniciar sesión / Registrarse</span>
            </Link>
          )}
        </div>
      </header>

      <div className={`public-navbar public-navbar-sticky ${isCompact ? "is-compact" : ""}`}>
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
            <Link className="public-navbar-vinculate" to="/donar">
              <i className="pi pi-heart-fill" />
              <span>Vincúlate</span>
            </Link>
          </nav>

          <Link className="public-navbar-vinculate-compact" to="/donar">
            <i className="pi pi-heart-fill" />
            <span>Vincúlate</span>
          </Link>

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
                <ActionLabel item={item} />
              </button>
            ) : (
              <Link
                key={item.label}
                className={location.pathname === item.path ? "is-active" : ""}
                to={item.path}
              >
                <ActionLabel item={item} />
              </Link>
            ),
          )}
        </nav>
      </div>
    </>
  );
}
