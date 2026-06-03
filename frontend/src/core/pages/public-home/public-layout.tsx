import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { publicAssets } from "./cloudinary-assets";
import { PublicFloatingActions } from "./public-floating-actions";
import { PublicNavbar } from "./public-navbar";
import "./public-home-page.css";

type PublicLayoutProps = {
  children: ReactNode;
  className?: string;
};

export function PublicLayout({ children, className = "" }: PublicLayoutProps) {
  return (
    <main className={`public-site ${className}`.trim()}>
      <PublicNavbar />
      {children}
      <PublicFloatingActions />
      <footer className="public-footer">
        <div>
          <img src={publicAssets.logo} alt="Fundación MTM" />
          <p>
            Plataforma pública y administrativa para gestionar donaciones,
            beneficiarios, padrinos, voluntariado, eventos y campañas.
          </p>
        </div>
        <div>
          <h4>Fundación</h4>
          <Link to="/home">Inicio</Link>
          <Link to="/nosotros">Nosotros</Link>
          <Link to="/programas">Programas</Link>
        </div>
        <div>
          <h4>Ayuda</h4>
          <Link to="/como-ayudar">Cómo ayudar</Link>
          <Link to="/donar">Bono Donación</Link>
          <Link to="/padrino-permanente">Padrino permanente</Link>
        </div>
        <div>
          <h4>Contenido</h4>
          <Link to="/blog">Blog</Link>
          <Link to="/noticias">Noticias</Link>
          <Link to="/preguntas-frecuentes">Preguntas frecuentes</Link>
          <Link to="/login">Panel administrativo</Link>
        </div>
      </footer>
    </main>
  );
}
