import { Link } from "react-router-dom";
import { publicAssets } from "./public-home/cloudinary-assets";
import { PublicFloatingActions } from "./public-home/public-floating-actions";
import { Seo } from "../seo";
import "./public-home/public-home-page.css";

type PublicInfoPageProps = {
  variant: "donar" | "padrino" | "voluntariado" | "eventos" | "blog" | "contacto";
};

const content = {
  donar: {
    eyebrow: "Donaciones",
    title: "Apoya a ninas, ninos, adolescentes y familias durante el tratamiento.",
    text: "El Bono de Alegria representa amor y bondad en honor a un ser querido o una fecha importante. Cada aporte ayuda a sostener apoyo psicosocial, hospedaje, medicamentos, alimentacion, educacion y recreacion.",
    image: publicAssets.donate,
    action: "Volver al inicio",
  },
  padrino: {
    eyebrow: "Padrino permanente",
    title: "Acompana de forma constante los programas de bienestar.",
    text: "Los aportes permanentes ayudan a reducir barreras de acceso y sostener programas para pacientes oncologicos y sus familias en la Orinoquia.",
    image: publicAssets.sponsor,
    action: "Conocer otras formas de ayudar",
  },
  voluntariado: {
    eyebrow: "Voluntariado",
    title: "Tu tiempo tambien puede convertirse en esperanza.",
    text: "Dona tu tiempo y talento. El voluntariado de la fundacion transforma el servicio en esperanza y felicidad a traves del amor y la bondad.",
    image: publicAssets.careOne,
    action: "Ir al inicio",
  },
  eventos: {
    eyebrow: "Eventos",
    title: "Simposios, campanas municipales y encuentros solidarios.",
    text: "La fundacion realiza acciones de sensibilizacion en municipios del Meta y encuentros como el Zapero de la Alegria para movilizar apoyo regional.",
    image: publicAssets.childrenInfo,
    action: "Ver inicio",
  },
  blog: {
    eyebrow: "Noticias",
    title: "Historias, campanas y comunicados institucionales.",
    text: "Un espacio para comunicar programas como Educando Angeles, Suenos de Arena, Carrito de la Felicidad, reciclaje, donacion de cabello y SePuede.",
    image: publicAssets.toys,
    action: "Volver",
  },
  contacto: {
    eyebrow: "Contacto",
    title: "Conecta tu empresa, familia o comunidad con la fundacion.",
    text: "La fundacion recibe apoyo para donaciones, voluntariado, reciclaje, tapas salvavidas, alianzas empresariales y campanas solidarias.",
    image: publicAssets.banner,
    action: "Ir al inicio",
  },
};

export const PublicInfoPage = ({ variant }: PublicInfoPageProps) => {
  const page = content[variant];

  return (
    <main className="public-site">
      <Seo
        title={`${page.eyebrow} | Fundación MTM`}
        description={page.text}
        image={page.image}
      />
      <nav className="public-nav is-scrolled">
        <Link className="public-brand" to="/home">
          <img src={publicAssets.logo} alt="Fundacion Mujeres Trabajando por el Meta" />
        </Link>
        <div className="public-nav-links">
          <Link to="/home">Inicio</Link>
          <Link className="public-nav-login" to="/login">Iniciar sesion</Link>
          <Link className="public-nav-donate" to="/donar">Donar</Link>
        </div>
      </nav>

      <section className="public-section public-about compact" style={{ paddingTop: 128 }}>
        <div className="public-copy">
          <span className="public-kicker">{page.eyebrow}</span>
          <h2>{page.title}</h2>
          <p>{page.text}</p>
          <Link className="public-text-link" to="/home">
            {page.action} <i className="pi pi-arrow-right" />
          </Link>
        </div>
        <div className="public-photo-grid">
          <img src={page.image} alt={page.title} />
          <img src={publicAssets.careTwo} alt="Acompanamiento MTM" />
          <img src={publicAssets.heartLogo} alt="Logo de corazon MTM" />
        </div>
      </section>
      <PublicFloatingActions />
    </main>
  );
};
