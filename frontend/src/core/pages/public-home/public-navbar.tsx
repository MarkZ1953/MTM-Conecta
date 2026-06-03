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

const actionLinks: ActionLink[] = [
  { label: "Inicio", path: "/home", strongLabel: "Inicio" },
  { label: "Bono Donación", path: "/bono-donacion", strongLabel: "Bono Donación" },
  {
    label: "Padrino Permanente",
    path: "/padrino-permanente",
    lightLabel: "Padrino",
    strongLabel: "Permanente",
  },
  {
    label: "Cómo puedo ayudar",
    path: "/como-ayudar",
    lightLabel: "¿Cómo",
    strongLabel: "puedo ayudar?",
  },
  { label: "Eventos", path: "/eventos-publicos", strongLabel: "Eventos" },
];

const donationMenuLinks = [
  {
    label: "Tarjeta de Crédito/Débito",
    description: "Aporte rápido con tarjeta nacional o internacional.",
    path: "/donar/tarjeta-credito-debito",
    icon: "pi-credit-card",
  },
  {
    label: "PSE",
    description: "Paga desde tu banco en Colombia.",
    path: "/donar/pse",
    icon: "pi-building",
  },
  {
    label: "Paypal",
    description: "Ideal para aportes internacionales.",
    path: "/donar/paypal",
    icon: "pi-wallet",
  },
  {
    label: "Bono Donación",
    description: "Haz un aporte único con propósito.",
    path: "/bono-donacion",
    icon: "pi-heart-fill",
  },
  {
    label: "Padrino Permanente",
    description: "Acompaña mes a mes los programas MTM.",
    path: "/padrino-permanente",
    icon: "pi-star-fill",
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
  const [donateOpen, setDonateOpen] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const topBarRef = useRef<HTMLElement | null>(null);
  const compactStateRef = useRef(false);
  const frameRef = useRef<number | null>(null);
  const location = useLocation();
  const { logged, logout, user } = useContext(AuthContext);
  const showPanelAccess = logged && canAccessAdminPanel(user);
  const donationPaths = ["/donar", "/bono-donacion", "/padrino-permanente"];
  const donationMenuActive = donationPaths.some((path) => location.pathname.startsWith(path));
  const isActionActive = (path: string) =>
    path === "/home" ? location.pathname === path : location.pathname === path || location.pathname.startsWith(`${path}/`);

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
    setDonateOpen(false);
    onSectionNavigate(target);
  };

  const closeMenus = () => {
    setMenuOpen(false);
    setDonateOpen(false);
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
            <Link className={location.pathname === "/nosotros" ? "is-active" : ""} to="/nosotros">
              Sobre nosotros
            </Link>
            <Link className={location.pathname === "/programas" ? "is-active" : ""} to="/programas">
              Programas
            </Link>
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
          <Link className={isActionActive("/home") ? "is-active" : ""} to="/home" onClick={closeMenus}>
            <ActionLabel item={actionLinks[0]} />
          </Link>

          <div className={`public-navbar-donate-menu ${donateOpen ? "is-open" : ""}`}>
            <button
              type="button"
              className={donationMenuActive ? "is-active" : ""}
              aria-expanded={donateOpen}
              aria-haspopup="true"
              onClick={() => setDonateOpen((value) => !value)}
            >
              <i className="pi pi-heart-fill" />
              <span className="public-navbar-action-text">
                <span className="public-navbar-action-light">Quiero</span>
                <span className="public-navbar-action-strong">Donar</span>
              </span>
              <i className="pi pi-chevron-down public-navbar-chevron" />
            </button>
            <div className="public-navbar-dropdown" role="menu">
              {donationMenuLinks.map((item) => (
                <Link key={item.path} to={item.path} role="menuitem" onClick={closeMenus}>
                  <i className={`pi ${item.icon}`} />
                  <span>
                    <strong>{item.label}</strong>
                    <small>{item.description}</small>
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {actionLinks.slice(1).map((item) =>
            item.target && onSectionNavigate ? (
              <button
                key={item.label}
                type="button"
                className={isActionActive(item.path) ? "is-active" : ""}
                onClick={() => handleSection(item.target)}
              >
                <ActionLabel item={item} />
              </button>
            ) : (
              <Link
                key={item.label}
                className={isActionActive(item.path) ? "is-active" : ""}
                to={item.path}
                onClick={closeMenus}
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
