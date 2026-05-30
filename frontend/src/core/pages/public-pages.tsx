import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { publicAboutGallerySlides, publicAssets } from "./public-home/cloudinary-assets";
import { PublicImageCarousel } from "./public-home/public-image-carousel";
import {
  publicFaqs,
  publicHelpOptions,
  publicNews,
  publicPrograms,
} from "./public-home/public-content";
import { PublicLayout } from "./public-home/public-layout";
import { usePublicCloudinaryGallery } from "./public-home/use-public-cloudinary-gallery";

function PageHero({
  eyebrow,
  title,
  text,
  image,
  className = "",
  style,
}: {
  eyebrow: string;
  title: string;
  text: string;
  image: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <section className={`public-page-hero ${className}`.trim()} style={style}>
      <div>
        <span className="public-kicker">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{text}</p>
      </div>
      <img src={image} alt={title} />
    </section>
  );
}

function PlaceholderBlock({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <section className="public-section">
      <div className="public-placeholder">
        <span>
          <i className={`pi ${icon}`} />
        </span>
        <h2>{title}</h2>
        <p>{text}</p>
      </div>
    </section>
  );
}

function SponsorFloatingCta() {
  return (
    <Link
      className="public-sponsor-floating-cta"
      to="/register"
      aria-label="Haz clic aquí para conocer MTM y registrarte como padrino permanente"
    >
      <img src={publicAssets.sponsorCta} alt="" aria-hidden="true" />
    </Link>
  );
}

export function AboutPage() {
  const aboutSlides = usePublicCloudinaryGallery("sobre-nosotros", publicAboutGallerySlides);

  return (
    <PublicLayout>
      <PublicImageCarousel
        className="public-about-gallery"
        label="Galería Sobre Nosotros MTM"
        slides={aboutSlides}
      />
      <section className="public-section public-about public-about-story">
        <div className="public-copy">
          <span className="public-kicker">Sobre nosotros</span>
          <h1>Desde Villavicencio trabajamos por la adherencia al tratamiento de los niños con cáncer de la Orinoquía.</h1>
          <p>
            La Fundación Mujeres Trabajando por el Meta nació en Villavicencio
            para reducir barreras de acceso y brindar apoyo integral en la
            Orinoquía.
          </p>
        </div>
        <div className="public-about-summary">
          <p>
            Nuestro trabajo une acompañamiento humano, educación, hospedaje,
            apoyo psicosocial, alimentación, recreación y redes de solidaridad
            para que cada familia pueda sostener su tratamiento con dignidad.
          </p>
        </div>
      </section>
      <section className="public-section public-two-column">
        <div>
          <span className="public-kicker">Misión</span>
          <h2>Mejorar la calidad de vida con apoyo humano, social y familiar.</h2>
          <p>
            Brindamos apoyo psicosocial, hospedaje, medicamentos, alimentación,
            educación y recreación para minimizar el impacto emocional y
            económico de la enfermedad.
          </p>
        </div>
        <div>
          <span className="public-kicker">Visión</span>
          <h2>Ser referente regional en acompañamiento integral.</h2>
          <p>
            Trabajamos por un hogar de paso fortalecido, programas sostenibles
            y una red de aliados que ayude a sostener la esperanza de cada
            familia.
          </p>
        </div>
      </section>
    </PublicLayout>
  );
}

export function ProgramsPage() {
  return (
    <PublicLayout>
      <PageHero
        eyebrow="Programas"
        title="Frentes de apoyo que convierten solidaridad en bienestar real."
        text="Cada programa responde a necesidades concretas de pacientes oncológicos, cuidadores y familias."
        image={publicAssets.careOne}
      />
      <section className="public-section public-band">
        <div className="public-program-grid">
          {publicPrograms.map((program) => (
            <article className="public-program-card" key={program.title}>
              <span><i className={`pi ${program.icon}`} /></span>
              <h3>{program.title}</h3>
              {program.text && <p>{program.text}</p>}
            </article>
          ))}
        </div>
      </section>
    </PublicLayout>
  );
}

export function HelpPage() {
  return (
    <PublicLayout>
      <PageHero
        eyebrow="Cómo ayudar"
        title="Hay muchas formas de transformar apoyo en esperanza."
        text="Puedes realizar un Bono Donación, convertirte en padrino permanente, vincular tu empresa, participar como voluntario o apoyar campañas de ecoaporte y recolección de tapas."
        image={publicAssets.donate}
      />
      <section className="public-section">
        <div className="public-help-grid">
          {publicHelpOptions.map((option) => (
            <article className={`public-help-card ${option.tone}`} key={option.title}>
              <h3>{option.title}</h3>
              <p>{option.text}</p>
              <Link to={option.path}>{option.label} <i className="pi pi-arrow-right" /></Link>
            </article>
          ))}
        </div>
      </section>
    </PublicLayout>
  );
}

export function DonatePage() {
  return (
    <PublicLayout>
      <PageHero
        eyebrow="Donaciones"
        title="Apoya a pacientes y familias con un Bono Donación o una campaña activa."
        text="Cualquier persona puede donar. El flujo en línea se habilitará con registro de usuario y confirmación segura de pagos."
        image={publicAssets.donate}
      />
      <PlaceholderBlock
        icon="pi-heart-fill"
        title="Bono Donación y campañas de recaudo próximamente"
        text="Aquí se mostrarán las campañas activas para que cada persona elija a qué causa quiere aportar."
      />
    </PublicLayout>
  );
}

export function SponsorPage() {
  return (
    <PublicLayout>
      <section
        className="public-sponsor-page"
        aria-label="Padrino permanente"
        style={
          {
            "--public-sponsor-page-bg": `url(${publicAssets.sponsorBackground})`,
          } as CSSProperties
        }
      >
        <div className="public-sponsor-page-hero">
          <div>
            <span className="public-kicker">Padrino permanente</span>
            <h1>Acompaña de forma constante los programas de bienestar.</h1>
            <p>
              Los padrinos permanentes realizan aportes mensuales y reciben
              información de actividades, eventos e impacto de la fundación.
            </p>
          </div>
          <img src={publicAssets.sponsor} alt="Padrino permanente Fundación MTM" />
        </div>

        <div className="public-sponsor-page-register">
          <span>
            <i className="pi pi-calendar-plus" />
          </span>
          <h2>Registro de padrinos en preparación</h2>
          <p>
            El flujo permitirá registrar personas naturales, familias o
            empresas, definir aportes mensuales y comunicar beneficios según el
            monto de vinculación.
          </p>
        </div>
      </section>
      <SponsorFloatingCta />
    </PublicLayout>
  );
}

export function VolunteerPage() {
  return (
    <PublicLayout>
      <PageHero
        eyebrow="Voluntariado"
        title="Tu tiempo también puede convertirse en esperanza."
        text="El voluntariado reunirá disponibilidad, profesión, áreas de apoyo y seguimiento desde el panel administrativo."
        image={publicAssets.careOne}
      />
      <PlaceholderBlock
        icon="pi-users"
        title="Formulario de voluntariado próximamente"
        text="Este espacio recibirá las solicitudes de personas interesadas en donar tiempo y talento."
      />
    </PublicLayout>
  );
}

export function PublicEventsPage() {
  return (
    <PublicLayout>
      <PageHero
        eyebrow="Eventos"
        title="Señales de alarma, actividades y encuentros solidarios."
        text="Este espacio reunirá calendario público, materiales educativos, galerías e historias de actividades institucionales."
        image={publicAssets.childrenInfo}
      />
      <PlaceholderBlock
        icon="pi-calendar"
        title="Calendario público en preparación"
        text="Los eventos internos ya existen; el siguiente paso será publicar los visibles para la comunidad."
      />
    </PublicLayout>
  );
}

export function BlogPage() {
  return (
    <PublicLayout>
      <PageHero
        eyebrow="Blog"
        title="Historias, aprendizajes y contenido institucional."
        text="El blog será el espacio editorial para contar procesos, programas y temas de interés para familias y aliados."
        image={publicAssets.toys}
      />
      <PlaceholderBlock
        icon="pi-book"
        title="Blog administrable próximamente"
        text="Por ahora dejamos la ruta lista. Luego conectaremos publicaciones desde el panel administrativo."
      />
    </PublicLayout>
  );
}

export function NewsPage() {
  return (
    <PublicLayout>
      <PageHero
        eyebrow="Noticias"
        title="Campañas, comunicados y novedades de la fundación."
        text="Las noticias mostrarán comunicaciones recientes, campañas y avances institucionales."
        image={publicAssets.bingo}
      />
      <section className="public-section public-news">
        <div className="public-news-grid">
          {publicNews.map((item) => (
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
    </PublicLayout>
  );
}

export function TestimonialsPage() {
  return (
    <PublicLayout>
      <PageHero
        eyebrow="Testimonios"
        title="Voces de familias, cuidadores y beneficiarios."
        text="Esta página recibirá contenido multimedia con imágenes, videos e historias autorizadas por las familias."
        image={publicAssets.careThree}
      />
      <PlaceholderBlock
        icon="pi-video"
        title="Galería de testimonios próximamente"
        text="Dejamos la ruta lista para agregar videos, fotografías y relatos cuando el contenido esté aprobado."
      />
    </PublicLayout>
  );
}

export function FAQPage() {
  return (
    <PublicLayout>
      <PageHero
        eyebrow="Preguntas frecuentes"
        title="Respuestas claras para donantes, padrinos, familias y aliados."
        text="Estas preguntas se podrán convertir luego en contenido administrable desde el panel."
        image={publicAssets.banner}
      />
      <section className="public-section">
        <div className="public-faq-list">
          {publicFaqs.map((faq) => (
            <article key={faq.question}>
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </PublicLayout>
  );
}

export function ContactPage() {
  return (
    <PublicLayout>
      <PageHero
        eyebrow="Contacto"
        title="Conecta tu empresa, familia o comunidad con la fundación."
        text="La fundación recibe apoyo para donaciones, voluntariado, reciclaje, alianzas empresariales y campañas solidarias."
        image={publicAssets.banner}
      />
      <section className="public-section">
        <div className="public-contact-grid">
          <article>
            <i className="pi pi-whatsapp" />
            <h3>WhatsApp</h3>
            <p>310 342 3223</p>
          </article>
          <article>
            <i className="pi pi-envelope" />
            <h3>Correo</h3>
            <p>fundacion.mtm.contraelcancer@gmail.com</p>
          </article>
          <article>
            <i className="pi pi-map-marker" />
            <h3>Ubicación</h3>
            <p>Villavicencio, Meta</p>
          </article>
        </div>
      </section>
    </PublicLayout>
  );
}

export function NotFoundPage() {
  return (
    <PublicLayout>
      <section className="public-not-found" aria-label="Error 404, página no encontrada">
        <img
          className="public-not-found-image"
          src={publicAssets.notFound}
          alt="Error 404: esta ruta no existe. Volvamos juntos al camino de la esperanza."
        />
        <Link
          className="public-not-found-home-link"
          to="/home"
          aria-label="Volver al inicio"
        >
          <span aria-hidden="true" />
        </Link>
      </section>
    </PublicLayout>
  );
}
