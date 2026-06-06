import { useEffect, useMemo, useState, type CSSProperties, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import {
  publicAboutGallerySlides,
  publicAssets,
  publicEventsGallerySlides,
} from "./public-home/cloudinary-assets";
import { PublicHelpWaysSection } from "./public-home/public-help-ways-section";
import { PublicImageCarousel } from "./public-home/public-image-carousel";
import {
  publicFaqs,
  publicNews,
  publicPrograms,
} from "./public-home/public-content";
import {
  fetchPublicBlogPost,
  fetchPublicBlogPosts,
  subscribeToNewsletter,
  type PublicBlogPostRecord,
} from "./public-home/public-blog.api";
import { fetchPublicEvents, type PublicEventRecord } from "./public-home/public-events.api";
import { PublicLayout } from "./public-home/public-layout";
import { usePublicCloudinaryGallery } from "./public-home/use-public-cloudinary-gallery";
import { Seo } from "../seo";

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
      <Seo
        canonicalPath="/nosotros"
        title="Sobre Nosotros | Fundación MTM en Villavicencio"
        description="Conoce la historia, misión y visión de Fundación MTM, una organización que acompaña a niñas, niños y familias durante el tratamiento oncológico en la Orinoquía."
        image={publicAssets.heroAlt}
      />
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
      <Seo
        canonicalPath="/programas"
        title="Programas Sociales | Fundación MTM"
        description="Explora los programas de Fundación MTM para brindar acompañamiento, bienestar, educación y apoyo familiar a pacientes oncológicos y sus cuidadores."
        image={publicAssets.careOne}
      />
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
      <Seo
        canonicalPath="/como-ayudar"
        title="Cómo Ayudar | Fundación MTM"
        description="Descubre cómo apoyar a Fundación MTM mediante donaciones, voluntariado, aportes en especie, alianzas y actividades solidarias."
        image={publicAssets.vinculate}
      />
      <PublicHelpWaysSection />
    </PublicLayout>
  );
}

export function DonatePage() {
  return (
    <PublicLayout>
      <Seo
        canonicalPath="/donar"
        title="Donar a Fundación MTM | Apoya a familias en tratamiento"
        description="Haz tu aporte a Fundación MTM y ayuda a sostener programas de hospedaje, alimentación, apoyo psicosocial, educación y bienestar familiar."
        image={publicAssets.donate}
      />
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
      <Seo
        canonicalPath="/bono-donacion"
        title="Bono Donación | Fundación MTM"
        description="Realiza un aporte único con propósito a Fundación MTM y acompaña a niñas, niños, adolescentes y familias vinculadas a sus programas sociales."
        image={publicAssets.donate}
      />
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
      <Seo
        canonicalPath="/padrino-permanente"
        title="Padrino Permanente | Fundación MTM"
        description="Conviértete en padrino permanente de Fundación MTM y apoya mes a mes los programas de acompañamiento familiar y bienestar."
        image={publicAssets.sponsor}
      />
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
      <Seo
        canonicalPath={selectedMethod.path}
        title={`Donar por ${selectedMethod.title} | Fundación MTM`}
        description={`Continúa tu aporte a Fundación MTM por ${selectedMethod.title}. ${selectedMethod.text}`}
        image={method === "paypal" ? publicAssets.banner : publicAssets.donate}
      />
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
      <Seo
        canonicalPath="/voluntariado"
        title="Voluntariado | Fundación MTM"
        description="Dona tu tiempo y talento como voluntario de Fundación MTM para acompañar actividades, familias y programas sociales."
        image={publicAssets.careOne}
      />
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

type PublicEventItem = {
  dateLabel: string;
  day: string;
  description: string;
  id: number;
  imageAlt: string;
  imageSrc: string;
  imageSrcs: string[];
  location: string;
  month: string;
  startDate: Date;
  time: string;
  title: string;
};

const EVENTS_PER_PAGE = 10;

function getEventImageIndex(index: number, totalImages: number) {
  return totalImages > 0 ? index % totalImages : 0;
}

const eventDateFormatter = new Intl.DateTimeFormat("es-CO", {
  day: "numeric",
  month: "long",
  weekday: "long",
  year: "numeric",
});

const eventMonthFormatter = new Intl.DateTimeFormat("es-CO", {
  month: "short",
});

const eventMonthTitleFormatter = new Intl.DateTimeFormat("es-CO", {
  month: "long",
  year: "numeric",
});

const eventTimeFormatter = new Intl.DateTimeFormat("es-CO", {
  hour: "numeric",
  minute: "2-digit",
});

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

const blogDayFormatter = new Intl.DateTimeFormat("es-CO", {
  day: "2-digit",
});

const blogMonthFormatter = new Intl.DateTimeFormat("es-CO", {
  month: "short",
});

const blogYearFormatter = new Intl.DateTimeFormat("es-CO", {
  year: "numeric",
});

const blogLongDateFormatter = new Intl.DateTimeFormat("es-CO", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

function getBlogDate(value?: string | null) {
  const date = value ? new Date(value) : null;

  if (!date || Number.isNaN(date.getTime())) {
    return {
      day: "--",
      month: "MTM",
      year: "Blog",
      long: "Fecha por anunciar",
    };
  }

  return {
    day: blogDayFormatter.format(date),
    month: blogMonthFormatter.format(date).replace(".", "").toUpperCase(),
    year: blogYearFormatter.format(date),
    long: capitalize(blogLongDateFormatter.format(date)),
  };
}

function getBlogImage(post?: PublicBlogPostRecord | null) {
  return post?.image_url || publicAssets.careOne;
}

function BlogDateBadge({ value }: { value?: string | null }) {
  const date = getBlogDate(value);

  return (
    <span className="public-blog-date-badge">
      <strong>{date.day}</strong>
      <span>{date.month}</span>
      <small>{date.year}</small>
    </span>
  );
}

function BlogCard({ post, featured = false }: { post: PublicBlogPostRecord; featured?: boolean }) {
  return (
    <article className={featured ? "public-blog-card public-blog-featured-card is-featured" : "public-blog-card"}>
      <div className="public-blog-card-media">
        <img src={getBlogImage(post)} alt={post.image_alt || post.title} />
        {featured && (
          <span className="public-blog-feature-pill">
            <i className="pi pi-star-fill" />
            Destacada
          </span>
        )}
        <BlogDateBadge value={post.published_at} />
      </div>
      <div className="public-blog-card-copy">
        <h2>{post.title}</h2>
        <p>{post.summary}</p>
        <Link to={`/blog/${post.slug}`}>
          Leer más
          <i className="pi pi-arrow-right" />
        </Link>
      </div>
    </article>
  );
}

function formatPublicEvent(
  event: PublicEventRecord,
  index: number,
  fallbackSlides: Array<{ alt: string; src: string }>,
): PublicEventItem {
  const startDate = new Date(event.start_date);
  const endDate = new Date(event.end_date);
  const fallbackImage = fallbackSlides[getEventImageIndex(index, fallbackSlides.length)];
  const uploadedImages = event.images?.map((image) => image.image_url).filter(Boolean) ?? [];
  const imageSrc = event.image_url || uploadedImages[0] || fallbackImage?.src || publicAssets.careOne;

  return {
    dateLabel: capitalize(eventDateFormatter.format(startDate)),
    day: String(startDate.getDate()).padStart(2, "0"),
    description: event.description,
    id: event.id,
    imageAlt: event.title,
    imageSrc,
    imageSrcs: uploadedImages.length > 0 ? uploadedImages : [imageSrc],
    location: event.location,
    month: eventMonthFormatter.format(startDate).replace(".", "").toUpperCase(),
    startDate,
    time: `${eventTimeFormatter.format(startDate)} - ${eventTimeFormatter.format(endDate)}`,
    title: event.title,
  };
}

export function PublicEventsPage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [events, setEvents] = useState<PublicEventRecord[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventsError, setEventsError] = useState("");
  const eventSlides = usePublicCloudinaryGallery("eventos", publicEventsGallerySlides);
  const publicEventItems = useMemo(
    () => events.map((event, index) => formatPublicEvent(event, index, eventSlides)),
    [eventSlides, events],
  );
  const pageCount = Math.max(1, Math.ceil(publicEventItems.length / EVENTS_PER_PAGE));
  const featuredEvent = publicEventItems[0];
  const featuredImages = useMemo(() => {
    const eventImages = publicEventItems.flatMap((event) => event.imageSrcs).filter(Boolean);
    return eventImages.length > 0 ? eventImages : eventSlides.map((slide) => slide.src);
  }, [eventSlides, publicEventItems]);
  const featuredImage = featuredImages[getEventImageIndex(activeSlide, featuredImages.length)];
  const calendarBaseDate = featuredEvent?.startDate ?? new Date();
  const calendarMonth = calendarBaseDate.getMonth();
  const calendarYear = calendarBaseDate.getFullYear();
  const calendarDays = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const calendarEventDays = new Set(
    publicEventItems
      .filter((event) => event.startDate.getMonth() === calendarMonth && event.startDate.getFullYear() === calendarYear)
      .map((event) => event.startDate.getDate()),
  );
  const monthTitle = capitalize(eventMonthTitleFormatter.format(calendarBaseDate));
  const featuredDisplayEvent = featuredEvent ?? {
    dateLabel: "Fecha por anunciar",
    day: "--",
    description: eventsLoading
      ? "Estamos cargando las actividades publicadas por la fundación."
      : "Cuando el equipo registre un evento desde el panel administrativo, aparecerá aquí como destacado.",
    id: 0,
    imageAlt: "Eventos Fundación MTM",
    imageSrc: publicAssets.careOne,
    imageSrcs: [publicAssets.careOne],
    location: "Fundación MTM",
    month: "MTM",
    startDate: calendarBaseDate,
    time: "Hora por anunciar",
    title: eventsLoading ? "Cargando eventos..." : "Eventos por anunciar",
  };
  const safeCurrentPage = Math.min(currentPage, pageCount);

  useEffect(() => {
    let isMounted = true;

    fetchPublicEvents()
      .then((data) => {
        if (!isMounted) return;
        setEvents(data);
        setEventsError("");
      })
      .catch((error) => {
        if (!isMounted) return;
        setEventsError(error instanceof Error ? error.message : "No se pudieron cargar los eventos.");
      })
      .finally(() => {
        if (isMounted) {
          setEventsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (featuredImages.length <= 1) return undefined;

    const intervalId = window.setInterval(() => {
      setActiveSlide((value) => (value + 1) % featuredImages.length);
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [featuredImages.length]);

  const visibleEvents = useMemo(() => {
    const start = (safeCurrentPage - 1) * EVENTS_PER_PAGE;
    return publicEventItems.slice(start, start + EVENTS_PER_PAGE);
  }, [publicEventItems, safeCurrentPage]);

  const setPage = (nextPage: number) => {
    setCurrentPage(Math.min(Math.max(nextPage, 1), pageCount));
  };

  return (
    <PublicLayout>
      <Seo
        canonicalPath="/eventos-publicos"
        title="Eventos Públicos | Fundación MTM"
        description="Consulta eventos, jornadas, campañas y actividades públicas de Fundación MTM en Villavicencio y la región de la Orinoquía."
        image={featuredEvent?.imageSrc || publicAssets.careOne}
      />
      <section className="public-events-showcase" aria-label="Eventos Fundación MTM">
        <div className="public-events-showcase-hero">
          <div className="public-events-showcase-copy">
            <span className="public-kicker">Eventos</span>
            <h1>Próximos eventos y encuentros solidarios</h1>
            <p>
              Descubre nuestras actividades, campañas, jornadas solidarias y
              espacios comunitarios que transforman vidas y brindan esperanza a
              niños con cáncer y sus familias en la Orinoquía.
            </p>
            <div className="public-events-showcase-actions">
              <a href="#eventos-listado">
                <i className="pi pi-calendar" />
                Ver calendario completo
              </a>
              <Link to="/contacto">
                Suscríbete a nuestro boletín
                <i className="pi pi-arrow-right" />
              </Link>
            </div>
          </div>

          <article className="public-events-featured-card">
            <div>
              <span>
                <i className="pi pi-star-fill" />
                Evento destacado
              </span>
              <h2>{featuredDisplayEvent.title}</h2>
              <p>{featuredDisplayEvent.description}</p>
              <ul>
                <li>
                  <i className="pi pi-calendar" />
                  {featuredDisplayEvent.dateLabel}
                </li>
                <li>
                  <i className="pi pi-clock" />
                  {featuredDisplayEvent.time}
                </li>
                <li>
                  <i className="pi pi-map-marker" />
                  {featuredDisplayEvent.location}
                </li>
              </ul>
              <a href="#eventos-listado">
                Ver detalles
                <i className="pi pi-arrow-right" />
              </a>
            </div>
            <img src={featuredImage || featuredDisplayEvent.imageSrc} alt={featuredDisplayEvent.imageAlt} />
          </article>
        </div>

        <div className="public-events-showcase-toolbar" aria-label="Filtros de eventos">
          <button type="button" className="is-active">
            <i className="pi pi-calendar" />
            Próximos
          </button>
          <button type="button">
            <i className="pi pi-star" />
            Destacados
          </button>
          <button type="button">
            <i className="pi pi-calendar-plus" />
            Mes actual
          </button>
          <button type="button">
            <i className="pi pi-sliders-h" />
            Todos
          </button>
        </div>

        <div className="public-events-showcase-main" id="eventos-listado">
          <div>
            <div className="public-events-card-grid">
              {eventsLoading &&
                Array.from({ length: 3 }, (_, index) => (
                  <article className="public-events-card is-loading" key={`event-loading-${index}`}>
                    <div className="public-events-card-media" />
                    <div className="public-events-card-copy">
                      <span />
                      <p />
                      <p />
                    </div>
                  </article>
                ))}

              {!eventsLoading &&
                visibleEvents.map((event) => (
                  <article className="public-events-card" key={event.id}>
                    <div className="public-events-card-media">
                      <img src={event.imageSrc} alt={event.imageAlt} />
                      <span>
                        <strong>{event.day}</strong>
                        {event.month}
                      </span>
                    </div>
                    <div className="public-events-card-copy">
                      <div>
                        <h2>{event.title}</h2>
                        <i className="pi pi-star" aria-hidden="true" />
                      </div>
                      <p>{event.description}</p>
                      <ul>
                        <li>
                          <i className="pi pi-clock" />
                          {event.time}
                        </li>
                        <li>
                          <i className="pi pi-map-marker" />
                          {event.location}
                        </li>
                      </ul>
                      <Link to="/contacto">
                        Ver detalles
                        <i className="pi pi-arrow-right" />
                      </Link>
                    </div>
                  </article>
                ))}
            </div>

            {!eventsLoading && publicEventItems.length === 0 && (
              <div className="public-events-empty">
                <i className="pi pi-calendar-times" />
                <h2>{eventsError ? "No pudimos cargar los eventos" : "Eventos por anunciar"}</h2>
                <p>
                  {eventsError ||
                    "Cuando el equipo publique eventos desde el panel administrativo, aparecerán en esta sección."}
                </p>
              </div>
            )}

            {pageCount > 1 && (
              <nav className="public-events-pagination" aria-label="Paginación de eventos">
                  <button type="button" onClick={() => setPage(safeCurrentPage - 1)} disabled={safeCurrentPage === 1}>
                  <i className="pi pi-angle-left" />
                  Anterior
                </button>
                {Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => (
                  <button
                    type="button"
                    className={page === safeCurrentPage ? "is-active" : ""}
                    key={page}
                    onClick={() => setPage(page)}
                    aria-current={page === safeCurrentPage ? "page" : undefined}
                  >
                    {page}
                  </button>
                ))}
                <button type="button" onClick={() => setPage(safeCurrentPage + 1)} disabled={safeCurrentPage === pageCount}>
                  Siguiente
                  <i className="pi pi-angle-right" />
                </button>
              </nav>
            )}

            <div className="public-events-participate">
              <div>
                <h2>¿Quieres participar?</h2>
                <p>Tu tiempo, talento y apoyo hacen la diferencia.</p>
              </div>
              <Link to="/como-ayudar/voluntariado-presencial">
                <i className="pi pi-users" />
                <span>
                  <strong>Ser voluntario</strong>
                  Únete a nuestro equipo de voluntarios.
                </span>
                <i className="pi pi-angle-right" />
              </Link>
              <Link to="/contacto">
                <i className="pi pi-heart" />
                <span>
                  <strong>Aliarte con la fundación</strong>
                  Empresas y aliados que suman para transformar vidas.
                </span>
                <i className="pi pi-angle-right" />
              </Link>
            </div>
          </div>

          <aside className="public-events-month-card" aria-label="Eventos del mes">
            <div className="public-events-month-card-head">
              <span>
                <i className="pi pi-calendar" />
                Este mes
              </span>
              <div>
                <button type="button" aria-label="Mes anterior">
                  <i className="pi pi-angle-left" />
                </button>
                <button type="button" aria-label="Mes siguiente">
                  <i className="pi pi-angle-right" />
                </button>
              </div>
            </div>
            <h2>{monthTitle}</h2>
            <div className="public-events-calendar-grid" aria-label={`Calendario de ${monthTitle}`}>
              {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((dayName) => (
                <strong key={dayName}>{dayName}</strong>
              ))}
              {Array.from({ length: calendarDays }, (_, index) => index + 1).map((day) => (
                <span className={calendarEventDays.has(day) ? "is-event-day" : ""} key={day}>
                  {day}
                </span>
              ))}
            </div>
            <div className="public-events-month-list">
              {publicEventItems.slice(0, 4).map((event) => (
                <Link to="/contacto" key={`month-${event.id}`}>
                  <span>
                    <strong>{event.day}</strong>
                    {event.month}
                  </span>
                  <b>{event.title}</b>
                  <small>{event.time.split(" - ")[0]}</small>
                  <i className="pi pi-angle-right" />
                </Link>
              ))}
            </div>
            <a href="#eventos-listado" className="public-events-month-all">
              Ver todos los eventos del mes
              <i className="pi pi-arrow-right" />
            </a>
          </aside>
        </div>
      </section>
    </PublicLayout>
  );
}

export function BlogPage() {
  const [posts, setPosts] = useState<PublicBlogPostRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "success" | "error">("idle");
  const [newsletterMessage, setNewsletterMessage] = useState("");
  const [newsletterSubmitting, setNewsletterSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const filteredPosts = useMemo(
    () =>
      normalizedSearchTerm
        ? posts.filter((post) =>
            [post.title, post.summary, post.content].some((value) =>
              value.toLowerCase().includes(normalizedSearchTerm),
            ),
          )
        : posts,
    [normalizedSearchTerm, posts],
  );
  const featuredPost = filteredPosts[0];
  const latestPosts = filteredPosts.slice(1);
  const recentPosts = posts.slice(0, 5);

  useEffect(() => {
    let isMounted = true;

    fetchPublicBlogPosts()
      .then((data) => {
        if (!isMounted) return;
        setPosts(data);
        setError("");
      })
      .catch((fetchError) => {
        if (!isMounted) return;
        setError(fetchError instanceof Error ? fetchError.message : "No se pudieron cargar las publicaciones.");
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleNewsletterSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = newsletterEmail.trim();

    if (!email) {
      setNewsletterStatus("error");
      setNewsletterMessage("Ingresa tu correo para suscribirte.");
      return;
    }

    try {
      setNewsletterSubmitting(true);
      const response = await subscribeToNewsletter(email);
      setNewsletterStatus("success");
      setNewsletterMessage(response.message || "Listo, quedaste suscrito al boletín.");
      setNewsletterEmail("");
    } catch (submitError) {
      setNewsletterStatus("error");
      setNewsletterMessage(
        submitError instanceof Error
          ? submitError.message
          : "No pudimos registrar tu suscripción. Inténtalo nuevamente.",
      );
    } finally {
      setNewsletterSubmitting(false);
    }
  };

  return (
    <PublicLayout>
      <Seo
        canonicalPath="/blog"
        title="Blog | Historias reales de Fundación MTM"
        description="Lee historias, actividades, logros y aprendizajes de Fundación MTM y conoce el impacto que construye con familias, voluntarios y aliados."
        image={featuredPost ? getBlogImage(featuredPost) : publicAssets.careThree}
      />
      <section
        className="public-blog-hero"
        aria-label="Blog de Fundación MTM"
        style={
          {
            "--public-blog-hero-image": `url(${publicAssets.careThree})`,
          } as CSSProperties
        }
      >
        <div className="public-blog-hero-copy">
          <span className="public-blog-kicker">Blog de Fundación MTM</span>
          <h1>
            Lo que hacemos,
            <strong> contado en historias reales</strong>
          </h1>
          <p>
            Conoce nuestras actividades, logros e historias que reflejan el trabajo
            de nuestra comunidad y el impacto que construimos juntas.
          </p>
          <a href="#public-blog-posts">
            <i className="pi pi-envelope" />
            Conoce nuestro impacto
          </a>
        </div>
      </section>

      <section className="public-blog-shell" id="public-blog-posts">
        <div className="public-blog-main">
          {loading && (
            <div className="public-blog-loading">
              <i className="pi pi-spin pi-spinner" />
              Cargando publicaciones...
            </div>
          )}

          {!loading && featuredPost && (
            <>
              <div className="public-blog-section-title">
                <i className="pi pi-star-fill" />
                <h2>Historia destacada</h2>
              </div>
              <BlogCard post={featuredPost} featured />
            </>
          )}

          {!loading && !featuredPost && (
            <div className="public-blog-empty">
              <i className="pi pi-book" />
              <h2>
                {error
                  ? "No pudimos cargar el Blog"
                  : normalizedSearchTerm
                    ? "No encontramos resultados"
                    : "Publicaciones por anunciar"}
              </h2>
              <p>
                {error ||
                  (normalizedSearchTerm
                    ? "Prueba con otra búsqueda o vuelve a ver todas las publicaciones."
                    : "Cuando el equipo publique artículos desde el panel administrativo, aparecerán en esta sección.")}
              </p>
            </div>
          )}

          {latestPosts.length > 0 && (
            <>
              <div className="public-blog-section-title">
                <i className="pi pi-book" />
                <h2>Publicaciones recientes</h2>
              </div>
              <div className="public-blog-grid">
                {latestPosts.map((post) => (
                  <BlogCard post={post} key={post.id} />
                ))}
              </div>
            </>
          )}
        </div>

        <aside className="public-blog-sidebar" aria-label="Publicaciones recientes del Blog">
          <div className="public-blog-search">
            <input
              type="search"
              placeholder="Buscar en el blog..."
              aria-label="Buscar en el blog"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
            <i className="pi pi-search" />
          </div>

          <div className="public-blog-recent">
            <h2>
              <i className="pi pi-list" />
              Publicaciones recientes
            </h2>
            {recentPosts.length > 0 ? (
              recentPosts.map((post) => {
                const date = getBlogDate(post.published_at);

                return (
                  <Link to={`/blog/${post.slug}`} key={post.id}>
                    <img src={getBlogImage(post)} alt={post.image_alt || post.title} />
                    <span>
                      <strong>{post.title}</strong>
                      <small>{date.long}</small>
                    </span>
                  </Link>
                );
              })
            ) : (
              <p>{loading ? "Cargando entradas recientes..." : "Aún no hay entradas publicadas."}</p>
            )}
          </div>

          <div className="public-blog-newsletter">
            <h2>
              <i className="pi pi-envelope" />
              Recibe nuestras novedades
            </h2>
            <p>Suscríbete a nuestro boletín y entérate de todo lo que estamos haciendo.</p>
            <form onSubmit={handleNewsletterSubmit}>
              <input
                type="email"
                placeholder="Tu correo electrónico"
                aria-label="Tu correo electrónico"
                value={newsletterEmail}
                onChange={(event) => {
                  setNewsletterEmail(event.target.value);
                  if (newsletterStatus !== "idle") {
                    setNewsletterStatus("idle");
                    setNewsletterMessage("");
                  }
                }}
                disabled={newsletterSubmitting}
              />
              <button type="submit" disabled={newsletterSubmitting}>
                {newsletterSubmitting ? "Enviando..." : "Suscribirme"}
              </button>
            </form>
            {newsletterMessage && (
              <small className={`public-blog-newsletter-message ${newsletterStatus}`}>
                {newsletterMessage}
              </small>
            )}
          </div>
        </aside>
      </section>
    </PublicLayout>
  );
}

export function BlogPostDetailPage() {
  const { slug = "" } = useParams();
  const [post, setPost] = useState<PublicBlogPostRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const date = getBlogDate(post?.published_at);
  const paragraphs = useMemo(
    () => post?.content.split(/\n{2,}/).map((text) => text.trim()).filter(Boolean) ?? [],
    [post?.content],
  );

  useEffect(() => {
    let isMounted = true;

    fetchPublicBlogPost(slug)
      .then((data) => {
        if (!isMounted) return;
        setPost(data);
        setError("");
      })
      .catch((fetchError) => {
        if (!isMounted) return;
        setError(fetchError instanceof Error ? fetchError.message : "No se pudo cargar la publicación.");
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  return (
    <PublicLayout>
      <Seo
        canonicalPath={`/blog/${slug}`}
        title={post ? `${post.title} | Blog Fundación MTM` : "Blog Fundación MTM"}
        description={post?.summary || "Lee publicaciones, historias y actividades recientes de Fundación MTM."}
        image={post ? getBlogImage(post) : publicAssets.careThree}
        imageAlt={post?.image_alt || post?.title || "Blog Fundación MTM"}
        noIndex={!loading && !post}
        type="article"
      />
      <article className="public-blog-detail">
        <Link className="public-blog-back-link" to="/blog">
          <i className="pi pi-arrow-left" />
          Volver al Blog
        </Link>

        {loading && (
          <div className="public-blog-loading">
            <i className="pi pi-spin pi-spinner" />
            Cargando publicación...
          </div>
        )}

        {!loading && post && (
          <>
            <header className="public-blog-detail-hero">
              <div>
                <span className="public-blog-kicker">Blog de Fundación MTM</span>
                <h1>{post.title}</h1>
                <p>{post.summary}</p>
                <small>
                  <i className="pi pi-calendar" />
                  {date.long}
                </small>
              </div>
              <figure>
                <img src={getBlogImage(post)} alt={post.image_alt || post.title} />
                <BlogDateBadge value={post.published_at} />
              </figure>
            </header>

            <div className="public-blog-detail-content">
              {paragraphs.map((paragraph, index) => (
                <p key={`${post.slug}-paragraph-${index}`}>{paragraph}</p>
              ))}
            </div>
          </>
        )}

        {!loading && !post && (
          <div className="public-blog-empty">
            <i className="pi pi-exclamation-circle" />
            <h2>Publicación no encontrada</h2>
            <p>{error || "Esta entrada no está publicada o ya no se encuentra disponible."}</p>
            <Link to="/blog">Ver publicaciones disponibles</Link>
          </div>
        )}
      </article>
    </PublicLayout>
  );
}

export function NewsPage() {
  return (
    <PublicLayout>
      <Seo
        canonicalPath="/noticias"
        title="Noticias | Fundación MTM"
        description="Consulta campañas, comunicados, novedades institucionales y próximas noticias conectadas con las redes sociales de Fundación MTM."
        image={publicAssets.bingo}
      />
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
      <Seo
        canonicalPath="/testimonios"
        title="Testimonios | Fundación MTM"
        description="Historias y voces de familias, cuidadores, beneficiarios y aliados que acompañan el trabajo social de Fundación MTM."
        image={publicAssets.careThree}
      />
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
      <Seo
        canonicalPath="/preguntas-frecuentes"
        title="Preguntas Frecuentes | Fundación MTM"
        description="Resuelve dudas frecuentes sobre donaciones, padrinos, voluntariado, programas y formas de apoyar a Fundación MTM."
        image={publicAssets.banner}
      />
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

const contactCards = [
  {
    action: "https://wa.me/573103423223",
    actionLabel: "+57 310 342 3223",
    actionIcon: "pi-whatsapp",
    icon: "pi-whatsapp",
    text: "Escríbenos y atenderemos tu solicitud.",
    title: "WhatsApp",
    tone: "teal",
  },
  {
    action: "mailto:contacto@fundacionmtm.org",
    actionLabel: "contacto@fundacionmtm.org",
    actionIcon: "pi-copy",
    icon: "pi-envelope",
    text: "Envíanos tus mensajes y propuestas.",
    title: "Correo",
    tone: "purple",
  },
  {
    action: "https://www.google.com/maps/search/?api=1&query=Villavicencio%2C%20Meta%2C%20Colombia",
    actionLabel: "Villavicencio, Meta, Colombia",
    actionIcon: "pi-external-link",
    icon: "pi-map-marker",
    text: "Estamos en el corazón del Meta, trabajando por nuestra región.",
    title: "Ubicación",
    tone: "teal",
  },
  {
    action: "/contacto",
    actionLabel: "Lun - Vie   8:00 a.m. - 5:00 p.m.",
    actionIcon: "pi-clock",
    icon: "pi-clock",
    text: "Atendemos de lunes a viernes en jornada continua.",
    title: "Horario de atención",
    tone: "purple",
  },
];

const contactSocialLinks = [
  {
    icon: "pi-facebook",
    label: "Facebook",
    path: "https://www.facebook.com/",
    tone: "facebook",
  },
  {
    icon: "pi-instagram",
    label: "Instagram",
    path: "https://www.instagram.com/",
    tone: "instagram",
  },
  {
    label: "TikTok",
    path: "https://www.tiktok.com/",
    textIcon: "T",
    tone: "tiktok",
  },
  {
    icon: "pi-youtube",
    label: "YouTube",
    path: "https://www.youtube.com/",
    tone: "youtube",
  },
];

export function ContactPage() {
  return (
    <PublicLayout>
      <Seo
        canonicalPath="/contacto"
        title="Contacto | Fundación MTM"
        description="Contacta a Fundación MTM en Villavicencio para donaciones, voluntariado, alianzas, campañas solidarias y apoyo institucional."
        image="/contacto-poster-mtm.png"
      />
      <section className="public-contact-showcase" aria-label="Contacto Fundación MTM">
        <div className="public-contact-showcase-hero">
          <div className="public-contact-showcase-copy">
            <span className="public-contact-showcase-mark">
              <i className="pi pi-heart-fill" />
            </span>
            <h1>
              <span>Conecta tu empresa, </span>
              <strong>familia o comunidad </strong>
              <span>con la fundación.</span>
            </h1>
            <p>
              En Fundación MTM recibimos apoyo a través de donaciones,
              voluntariado, reciclaje, alianzas empresariales y campañas
              solidarias que transforman vidas de los niños con cáncer en la
              Orinoquía.
            </p>
            <div className="public-contact-showcase-actions">
              <a className="public-contact-showcase-primary" href="https://wa.me/573103423223" target="_blank" rel="noreferrer">
                <i className="pi pi-send" />
                Escríbenos
              </a>
              <Link className="public-contact-showcase-secondary" to="/como-ayudar">
                <i className="pi pi-heart" />
                Conocer formas de ayudar
              </Link>
            </div>
          </div>

          <div className="public-contact-showcase-media">
            <img
              className="public-contact-showcase-poster"
              src="/contacto-poster-mtm.png"
              alt="Juntos transformamos vidas en la Orinoquía - Fundación MTM"
            />
          </div>
        </div>

        <div className="public-contact-showcase-card-grid">
          {contactCards.map((card) => (
            <article className={`public-contact-showcase-card is-${card.tone}`} key={card.title}>
              <span>
                <i className={`pi ${card.icon}`} />
              </span>
              <div>
                <h2>{card.title}</h2>
                <p>{card.text}</p>
              </div>
              <a href={card.action} target={card.action.startsWith("http") ? "_blank" : undefined} rel={card.action.startsWith("http") ? "noreferrer" : undefined}>
                {card.actionLabel}
                <i className={`pi ${card.actionIcon}`} />
              </a>
            </article>
          ))}

          <article className="public-contact-showcase-card is-rose">
            <span>
              <i className="pi pi-users" />
            </span>
            <div>
              <h2>Redes sociales</h2>
              <p>Síguenos y sé parte de nuestra comunidad.</p>
            </div>
            <div className="public-contact-showcase-socials">
              {contactSocialLinks.map((item) => (
                <a
                  className={`is-${item.tone}`}
                  href={item.path}
                  key={item.label}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={item.label}
                >
                  {"icon" in item ? <i className={`pi ${item.icon}`} /> : <span>{item.textIcon}</span>}
                </a>
              ))}
            </div>
          </article>
        </div>

        <div className="public-contact-showcase-footer">
          <span>
            <i className="pi pi-heart-fill" />
          </span>
          <div>
            <h2>Cada acción cuenta.</h2>
            <p>
              Tu apoyo nos permite seguir transformando vidas de mujeres, niños
              y familias en el Meta.
            </p>
          </div>
          <Link to="/donar">
            <i className="pi pi-heart" />
            Quiero apoyar
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}

export function NotFoundPage() {
  return (
    <PublicLayout>
      <Seo
        canonicalPath="/404"
        title="Página no encontrada | Fundación MTM"
        description="La página solicitada no existe. Vuelve al inicio de Fundación MTM para conocer programas, donaciones, blog y contacto."
        image={publicAssets.notFound}
        noIndex
      />
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
