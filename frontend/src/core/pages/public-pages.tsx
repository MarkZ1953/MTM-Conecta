import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { publicAboutGallerySlides, publicAssets } from "./public-home/cloudinary-assets";
import { PublicHelpWaysSection } from "./public-home/public-help-ways-section";
import { PublicImageCarousel } from "./public-home/public-image-carousel";
import {
  publicFaqs,
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

type DonationMethodKey = "card" | "pse" | "paypal";

const donationMethods: Array<{
  key: DonationMethodKey;
  title: string;
  shortTitle: string;
  path: string;
  icon: string;
  text: string;
}> = [
  {
    key: "card",
    title: "Tarjeta de Crédito/Débito",
    shortTitle: "Tarjeta",
    path: "/donar/tarjeta-credito-debito",
    icon: "pi-credit-card",
    text: "Para aportes únicos o recurrentes con tarjetas nacionales e internacionales.",
  },
  {
    key: "pse",
    title: "PSE",
    shortTitle: "PSE",
    path: "/donar/pse",
    icon: "pi-building",
    text: "Para realizar tu aporte desde una cuenta bancaria en Colombia.",
  },
  {
    key: "paypal",
    title: "Paypal",
    shortTitle: "Paypal",
    path: "/donar/paypal",
    icon: "pi-wallet",
    text: "Para donantes que prefieren pagos internacionales o desde su cuenta Paypal.",
  },
];

const donationImpacts = [
  "Hospedaje y alimentación para familias en tratamiento.",
  "Apoyo psicosocial, educativo y jurídico durante el proceso.",
  "Medicamentos, transporte, recreación y actividades de bienestar.",
];

function DonationMethodGrid() {
  return (
    <div className="public-donation-method-grid">
      {donationMethods.map((method) => (
        <Link className="public-donation-method-card" to={method.path} key={method.key}>
          <i className={`pi ${method.icon}`} />
          <strong>{method.title}</strong>
          <span>{method.text}</span>
        </Link>
      ))}
    </div>
  );
}

function DonationMethodLinks() {
  return (
    <div className="public-donation-method-list">
      {donationMethods.map((method) => (
        <Link to={method.path} key={method.key}>
          <i className={`pi ${method.icon}`} />
          <span>{method.shortTitle}</span>
        </Link>
      ))}
    </div>
  );
}

function DonationImpactList() {
  return (
    <div className="public-donation-impact-list">
      {donationImpacts.map((impact) => (
        <span key={impact}>
          <i className="pi pi-check-circle" />
          {impact}
        </span>
      ))}
    </div>
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
      <PublicHelpWaysSection />
    </PublicLayout>
  );
}

export function DonatePage() {
  return (
    <PublicLayout>
      <PageHero
        eyebrow="Quiero donar"
        title="Elige cómo quieres hacer tu aporte a la Fundación MTM."
        text="Puedes apoyar con tarjeta, PSE, Paypal, un Bono Donación o convertirte en padrino permanente."
        image={publicAssets.donate}
      />
      <section className="public-section public-donation-section">
        <div className="public-section-head">
          <span className="public-kicker">Métodos de pago</span>
          <h2>Selecciona el canal que prefieras</h2>
          <p>Estos accesos preparan el camino hacia la pasarela de pago y mantienen separadas las formas de aporte que pidió la fundación.</p>
        </div>
        <DonationMethodGrid />
      </section>
      <section className="public-section public-donation-feature">
        <img src={publicAssets.toys} alt="Campaña solidaria de la Fundación MTM" />
        <div>
          <span className="public-kicker">Aportes con propósito</span>
          <h2>Tu donación sostiene acompañamiento real.</h2>
          <p>
            Cada aporte ayuda a mantener programas de hospedaje, alimentación,
            apoyo psicosocial, educación, recreación y orientación a familias
            que enfrentan el cáncer infantil.
          </p>
          <DonationImpactList />
          <div className="public-donation-actions">
            <Link className="public-btn primary dark-text" to="/bono-donacion">
              Ver Bono Donación
            </Link>
            <Link className="public-text-link" to="/padrino-permanente">
              Ser padrino permanente <i className="pi pi-arrow-right" />
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

export function DonationBondPage() {
  return (
    <PublicLayout>
      <PageHero
        eyebrow="Bono Donación"
        title="Un aporte único que honra fechas especiales y se convierte en bienestar."
        text="El Bono Donación representa amor, gratitud y solidaridad. Puedes dedicarlo a una persona, una fecha importante o una causa que quieras acompañar."
        image={publicAssets.donate}
      />
      <section className="public-section public-donation-detail">
        <div className="public-donation-copy">
          <span className="public-kicker">¿Qué es?</span>
          <h2>Una forma sencilla de ayudar hoy.</h2>
          <p>
            Es un aporte voluntario para apoyar a niñas, niños, adolescentes y
            familias vinculadas a los programas de la Fundación Mujeres
            Trabajando por el Meta.
          </p>
          <DonationImpactList />
          <div className="public-donation-actions">
            <Link className="public-btn primary dark-text" to="/donar/tarjeta-credito-debito">
              Ir a pagar
            </Link>
            <Link className="public-text-link" to="/donar">
              Ver otros métodos <i className="pi pi-arrow-right" />
            </Link>
          </div>
        </div>
        <div className="public-donation-side-card">
          <i className="pi pi-heart-fill" />
          <h3>También puedes donar por PSE o Paypal</h3>
          <p>Elige el canal que mejor se acomode a tu aporte y continúa con el proceso de pago.</p>
          <DonationMethodLinks />
        </div>
      </section>
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
            <div className="public-donation-actions">
              <Link className="public-btn primary dark-text" to="/donar/tarjeta-credito-debito">
                Ir a pagar
              </Link>
              <Link className="public-text-link" to="/donar">
                Ver métodos de pago <i className="pi pi-arrow-right" />
              </Link>
            </div>
          </div>
          <img src={publicAssets.sponsor} alt="Padrino permanente Fundación MTM" />
        </div>

        <div className="public-sponsor-page-register">
          <span>
            <i className="pi pi-calendar-plus" />
          </span>
          <h2>Registro de padrinos en preparación</h2>
          <p>
            Puedes participar como persona natural, familia o empresa. Tu
            aporte mensual ayuda a sostener procesos de acompañamiento y te
            conecta con reportes de actividades, eventos e impacto.
          </p>
          <DonationImpactList />
          <DonationMethodLinks />
        </div>
      </section>
      <SponsorFloatingCta />
    </PublicLayout>
  );
}

export function DonationMethodPage({ method }: { method: DonationMethodKey }) {
  const selectedMethod = donationMethods.find((item) => item.key === method) ?? donationMethods[0];

  return (
    <PublicLayout>
      <PageHero
        eyebrow="Pago de donación"
        title={`Continúa tu aporte por ${selectedMethod.title}.`}
        text="Esta sección deja listo el flujo público para que el donante llegue directamente al método de pago elegido."
        image={method === "paypal" ? publicAssets.banner : publicAssets.donate}
      />
      <section className="public-section public-payment-section">
        <div className="public-payment-panel">
          <div>
            <span className="public-kicker">Método seleccionado</span>
            <h2>{selectedMethod.title}</h2>
            <p>{selectedMethod.text}</p>
            <DonationImpactList />
          </div>
          <div className="public-payment-box">
            <i className={`pi ${selectedMethod.icon}`} />
            <h3>Resumen del aporte</h3>
            <div className="public-payment-amounts" aria-label="Montos sugeridos">
              <span>$50.000</span>
              <span>$100.000</span>
              <span>$200.000</span>
              <span>Otro valor</span>
            </div>
            <Link className="public-btn primary dark-text" to="/register">
              Continuar con el pago
            </Link>
            <Link className="public-text-link" to="/donar">
              Cambiar método <i className="pi pi-arrow-right" />
            </Link>
          </div>
        </div>
      </section>
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
