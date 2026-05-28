import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { publicAssets } from "./cloudinary-assets";
import { PublicNavbar } from "./public-navbar";
import "./public-home-page.css";

const heroSlides = [
  {
    src: publicAssets.heroPrincipal,
    alt: "Imagen institucional de la fundacion MTM",
  },
  {
    src: publicAssets.hero,
    alt: "Nina beneficiaria de la fundacion MTM",
  },
];

const programs = [
  {
    icon: "pi-heart",
    title: "Hogar de Paso Victoria",
    text: "Hospedaje gratuito, alimentacion, educacion, apoyo psicosocial, acompanamiento juridico y formacion para familias oncologicas.",
  },
  {
    icon: "pi-book",
    title: "Educando Angeles",
    text: "Restituye el derecho a la educacion de ninas, ninos y adolescentes durante ausencias escolares causadas por el tratamiento.",
  },
  {
    icon: "pi-comments",
    title: "Apoyo psicosocial",
    text: "Herramientas de afrontamiento para pacientes, cuidadores y familias durante las etapas del diagnostico y tratamiento.",
  },
  {
    icon: "pi-verified",
    title: "Apoyo juridico",
    text: "Derechos de peticion y tutelas para disminuir barreras invisibles y evitar tratamientos tardios.",
  },
  {
    icon: "pi-sun",
    title: "Suenos de Arena",
    text: "Una experiencia de esperanza que lleva familias oncologicas a conocer el mar durante procesos prolongados de tratamiento.",
  },
  {
    icon: "pi-car",
    title: "Carrito de la felicidad",
    text: "Espacios de esparcimiento, humanizacion y apoyo psicosocial para cuidadores en entornos intrahospitalarios.",
  },
  {
    icon: "pi-refresh",
    title: "Programa de reciclaje",
    text: "Recoleccion de tapitas plasticas y material reciclable para apoyar necesidades basicas del tratamiento.",
  },
  {
    icon: "pi-briefcase",
    title: "Programa SePuede",
    text: "Fortalece emprendimientos de cuidadores para recuperar estabilidad laboral y sustento familiar.",
  },
];

const helpOptions = [
  {
    title: "Bono de Alegria",
    text: "Bonos en honor a un ser querido o una fecha importante que apoyan a ninas, ninos, adolescentes y sus familias.",
    path: "/donar",
    label: "Aportar con un bono",
    tone: "rose",
  },
  {
    title: "Reciclaje y tapas salvavidas",
    text: "Empresas y aliados pueden vincularse con dispensadores de tapas y recibir certificado ambiental.",
    path: "/contacto",
    label: "Vincular empresa",
    tone: "teal",
  },
  {
    title: "Donacion de cabello",
    text: "Cabello natural minimo de 30 cm ayuda a fabricar pelucas para ninas y ninos al inicio del tratamiento.",
    path: "/padrino-permanente",
    label: "Conocer requisitos",
    tone: "teal",
  },
  {
    title: "Voluntariado",
    text: "Dona tu tiempo y talento para transformar servicio en esperanza y felicidad.",
    path: "/voluntariado",
    label: "Ser voluntario",
    tone: "lime",
  },
];

const news = [
  {
    title: "Buscamos donantes permanentes",
    tag: "Padrinos",
    image: publicAssets.sponsor,
  },
  {
    title: "Donaciones de ropa, juguetes y utiles",
    tag: "Campana",
    image: publicAssets.toys,
  },
  {
    title: "Actividades y encuentros solidarios",
    tag: "Eventos",
    image: publicAssets.bingo,
  },
];

export const PublicHomePage = () => {
  const navigate = useNavigate();
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);

  const scrollTo = (target: string) => {
    document.getElementById(target)?.scrollIntoView({ behavior: "smooth" });
  };

  const goToHeroSlide = (direction: "next" | "prev") => {
    setCurrentHeroSlide((current) => {
      if (direction === "next") return (current + 1) % heroSlides.length;
      return (current - 1 + heroSlides.length) % heroSlides.length;
    });
  };

  return (
    <main className="public-site">
      <PublicNavbar onSectionNavigate={scrollTo} />

      <section id="inicio" className="public-hero" aria-label="Galeria principal MTM">
        <div className="public-hero-track">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.src}
              className={`public-hero-slide ${index === currentHeroSlide ? "is-active" : ""}`}
            >
              <img className="public-hero-image" src={slide.src} alt={slide.alt} />
            </div>
          ))}
        </div>

        <div className="public-hero-controls" aria-label="Controles de galeria principal">
          <button
            type="button"
            className="public-hero-arrow"
            onClick={() => goToHeroSlide("prev")}
            aria-label="Ver imagen anterior"
          >
            <i className="pi pi-chevron-left" />
          </button>
          <div className="public-hero-dots" aria-label="Seleccionar imagen">
            {heroSlides.map((slide, index) => (
              <button
                key={slide.src}
                type="button"
                className={index === currentHeroSlide ? "is-active" : ""}
                onClick={() => setCurrentHeroSlide(index)}
                aria-label={`Ver imagen ${index + 1}`}
                aria-current={index === currentHeroSlide ? "true" : undefined}
              />
            ))}
          </div>
          <button
            type="button"
            className="public-hero-arrow"
            onClick={() => goToHeroSlide("next")}
            aria-label="Ver imagen siguiente"
          >
            <i className="pi pi-chevron-right" />
          </button>
        </div>
      </section>

      <section className="public-section public-about" id="nosotros">
        <div className="public-copy">
          <span className="public-kicker">Sobre nosotros</span>
          <h2>Desde Villavicencio trabajamos por la adherencia al tratamiento y la calidad de vida.</h2>
          <p>
            La Fundacion Mujeres Trabajando por el Meta fue constituida el 1 de
            abril de 2017 en Villavicencio. Promueve programas y proyectos que
            reducen barreras de acceso frente a la promocion, prevencion y
            atencion integral de ninas, ninos, adolescentes y jovenes con
            diagnostico de cancer.
          </p>
          <p>
            Su mision es mejorar la calidad de vida de pacientes de escasos
            recursos con apoyo psicosocial, hospedaje, medicamentos,
            alimentacion, educacion y recreacion durante el tratamiento.
          </p>
        </div>
        <div className="public-photo-grid">
          <img src={publicAssets.heroAlt} alt="Acompanamiento familiar de la fundacion" />
          <img src={publicAssets.careOne} alt="Actividad de apoyo a beneficiarios" />
          <img src={publicAssets.careThree} alt="Cuidadora y beneficiaria" />
        </div>
      </section>

      <section className="public-section public-band" id="programas">
        <div className="public-section-head">
          <span className="public-kicker">Programas</span>
          <h2>Programas que convierten apoyo en bienestar real</h2>
          <p>Estos son los frentes institucionales descritos en el portafolio de la fundacion.</p>
        </div>
        <div className="public-program-grid">
          {programs.map((program) => (
            <article className="public-program-card" key={program.title}>
              <span><i className={`pi ${program.icon}`} /></span>
              <h3>{program.title}</h3>
              <p>{program.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="public-section public-help" id="ayudar">
        <div className="public-section-head align-left">
          <span className="public-kicker">Como ayudar</span>
          <h2>Elige una forma de convertir solidaridad en accion.</h2>
        </div>
        <div className="public-help-grid">
          {helpOptions.map((option) => (
            <article className={`public-help-card ${option.tone}`} key={option.title}>
              <h3>{option.title}</h3>
              <p>{option.text}</p>
              <Link to={option.path}>{option.label} <i className="pi pi-arrow-right" /></Link>
            </article>
          ))}
        </div>
      </section>

      <section className="public-donation-feature">
        <div className="public-donation-image">
          <img src={publicAssets.donate} alt="Campana de apoyo para beneficiarios" />
        </div>
        <div className="public-donation-copy">
          <span className="public-kicker">Bono de Alegria</span>
          <h2>Una forma de honrar momentos importantes ayudando a una familia.</h2>
          <p>
            Los bonos representan amor y bondad en honor a un ser querido o para
            conmemorar nacimientos, cumpleanos, bautizos, matrimonios o despedidas.
            Cada aporte apoya a pacientes diagnosticados con cancer y a sus familias.
          </p>
          <button className="public-btn primary dark-text" onClick={() => navigate("/donar")}>
            Hacer una donacion
          </button>
        </div>
      </section>

      <section className="public-section public-events" id="eventos">
        <div className="public-section-head">
          <span className="public-kicker">Eventos y actividades</span>
          <h2>Sensibilizacion, encuentros y acciones de impacto</h2>
          <p>La fundacion realiza simposios, campanas municipales y actividades para educar sobre cancer infantil.</p>
        </div>
        <div className="public-event-layout">
          <img src={publicAssets.childrenInfo} alt="Informacion educativa de campana" />
          <div>
            <h3>Calendario, galeria y comunicacion</h3>
            <p>
              En 2022, el Zapero de la Alegria unio a la region en favor de la
              poblacion oncologica de la Orinoquia, logrando donar sillas de
              quimioterapia y adecuar espacios pediatricos.
            </p>
            <Link className="public-text-link" to="/eventos-publicos">
              Ver eventos <i className="pi pi-arrow-right" />
            </Link>
          </div>
        </div>
      </section>

      <section className="public-section public-news" id="noticias">
        <div className="public-section-head align-left">
          <span className="public-kicker">Noticias y campanas</span>
          <h2>Historias, comunicados y acciones recientes.</h2>
        </div>
        <div className="public-news-grid">
          {news.map((item) => (
            <article className="public-news-card" key={item.title}>
              <img src={item.image} alt={item.title} />
              <div>
                <span>{item.tag}</span>
                <h3>{item.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="public-newsletter" id="contacto">
        <div>
          <span className="public-kicker">Permanece informado</span>
          <h2>Recibe noticias, eventos y campanas de la fundacion.</h2>
        </div>
        <form className="public-newsletter-form">
          <input type="email" placeholder="tu correo electronico" aria-label="Correo electronico" />
          <button type="button">Suscribirme</button>
        </form>
      </section>

      <footer className="public-footer">
        <div>
          <img src={publicAssets.logo} alt="Fundacion MTM" />
          <p>
            Plataforma publica y administrativa para gestionar donaciones,
            beneficiarios, padrinos, voluntariado, eventos y campanas.
          </p>
        </div>
        <div>
          <h4>Fundacion</h4>
          <Link to="/home">Inicio</Link>
          <Link to="/blog">Noticias</Link>
          <Link to="/voluntariado">Voluntariado</Link>
        </div>
        <div>
          <h4>Ayuda</h4>
          <Link to="/donar">Donar</Link>
          <Link to="/padrino-permanente">Padrino permanente</Link>
          <Link to="/contacto">Contacto</Link>
        </div>
        <div>
          <h4>Redes</h4>
          <a href="https://www.instagram.com/" target="_blank" rel="noreferrer">Instagram</a>
          <a href="https://www.facebook.com/" target="_blank" rel="noreferrer">Facebook</a>
          <Link to="/login">Panel administrativo</Link>
        </div>
      </footer>
    </main>
  );
};
