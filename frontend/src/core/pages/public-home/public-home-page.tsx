import { Link } from "react-router-dom";
import { publicAssets } from "./cloudinary-assets";
import { PublicImageCarousel } from "./public-image-carousel";
import { publicHelpOptions, publicNews, publicPrograms } from "./public-content";
import { PublicLayout } from "./public-layout";
import "./public-home-page.css";

const heroSlides = [
  {
    src: publicAssets.heroPrincipal,
    alt: "Imagen institucional de la Fundación MTM",
  },
  {
    src: publicAssets.hero,
    alt: "Niña beneficiaria de la Fundación MTM",
  },
];

export const PublicHomePage = () => {
  return (
    <PublicLayout>
      <PublicImageCarousel
        className="public-hero"
        label="Galeria principal MTM"
        slides={heroSlides}
      />

      <section className="public-section public-about" id="nosotros">
        <div className="public-copy">
          <span className="public-kicker">Sobre nosotros</span>
          <h2>Desde Villavicencio trabajamos por la adherencia al tratamiento de los niños con cáncer de la Orinoquía.</h2>
          <p>
            La Fundación Mujeres Trabajando por el Meta fue constituida el 1 de
            abril de 2017 en Villavicencio. Promueve programas y proyectos que
            reducen barreras de acceso frente a la promoción, prevención y
            atención integral de niñas, niños, adolescentes y jóvenes con
            diagnóstico de cáncer.
          </p>
          <p>
            Su misión es mejorar la calidad de vida de pacientes de escasos
            recursos con apoyo psicosocial, hospedaje, medicamentos,
            alimentación, educación y recreación durante el tratamiento.
          </p>
          <Link className="public-text-link" to="/nosotros">
            Conocer la fundación <i className="pi pi-arrow-right" />
          </Link>
        </div>
        <div className="public-photo-grid">
          <img src={publicAssets.heroAlt} alt="Acompañamiento familiar de la fundación" />
          <img src={publicAssets.careOne} alt="Actividad de apoyo a beneficiarios" />
          <img src={publicAssets.careThree} alt="Cuidadora y beneficiaria" />
        </div>
      </section>

      <section className="public-section public-cancer-types" id="cancer-infantil">
        <div className="public-cancer-image-wrap">
          <img
            src={publicAssets.cancerTypes}
            alt="Tipos de cáncer infantil que afectan a niñas, niños y adolescentes"
          />
        </div>
      </section>

      <section className="public-section public-band" id="programas">
        <div className="public-section-head">
          <span className="public-kicker">Programas</span>
          <h2>Programas que convierten apoyo en bienestar real</h2>
          <p>Estos son los frentes institucionales descritos en el portafolio de la fundación.</p>
        </div>
        <div className="public-program-grid">
          {publicPrograms.slice(0, 4).map((program) => (
            <article className="public-program-card" key={program.title}>
              <span><i className={`pi ${program.icon}`} /></span>
              <h3>{program.title}</h3>
              {program.text && <p>{program.text}</p>}
            </article>
          ))}
        </div>
        <div className="public-section-action">
          <Link className="public-btn primary dark-text" to="/programas">
            Ver todos los programas
          </Link>
        </div>
      </section>

      <section className="public-section public-help" id="ayudar">
        <div className="public-section-head align-left">
          <span className="public-kicker">Cómo ayudar</span>
          <h2>Elige una forma de convertir solidaridad en acción.</h2>
        </div>
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

      <section className="public-vinculate-feature" aria-label="Padrino permanente">
        <div className="public-vinculate-card">
          <div className="public-vinculate-media">
            <img
              src={publicAssets.vinculate}
              alt="Pieza institucional para vincularse con la Fundación MTM"
            />
            <span className="public-vinculate-float one">
              <i className="pi pi-heart-fill" />
            </span>
            <span className="public-vinculate-float two">
              <i className="pi pi-star-fill" />
            </span>
          </div>
          <div className="public-vinculate-copy">
            <span className="public-kicker">Padrino permanente</span>
            <h2>Haz parte de una red que acompaña mes a mes.</h2>
            <p>
              Un padrino permanente es una persona, familia o empresa que decide
              sostener con aportes mensuales los programas de bienestar de la
              fundación. Su apoyo ayuda a mantener acompañamiento, educación,
              actividades y espacios de esperanza para niñas, niños y familias.
            </p>
            <div className="public-vinculate-benefits">
              <article>
                <i className="pi pi-envelope" />
                <h3>Informe mensual</h3>
                <p>Recibe actividades, avances e impacto de los programas.</p>
              </article>
              <article>
                <i className="pi pi-calendar" />
                <h3>Eventos</h3>
                <p>Participa en encuentros y campañas de la fundación.</p>
              </article>
              <article>
                <i className="pi pi-users" />
                <h3>Continuidad</h3>
                <p>Ayuda a sostener procesos de acompañamiento familiar.</p>
              </article>
            </div>
            <div className="public-vinculate-actions">
              <Link className="public-btn primary dark-text" to="/padrino-permanente">
                Haz parte ya
              </Link>
              <Link className="public-text-link" to="/como-ayudar">
                Ver formas de apoyo <i className="pi pi-arrow-right" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="public-section public-events" id="eventos">
        <div className="public-section-head">
          <span className="public-kicker">Eventos y actividades</span>
          <h2>Educación, señales de alarma y encuentros de impacto</h2>
          <p>La fundación promueve actividades, campañas y contenidos para reconocer señales de alarma y fortalecer la conciencia sobre el cáncer infantil.</p>
        </div>
        <div className="public-event-layout">
          <img src={publicAssets.childrenInfo} alt="Información educativa de campaña" />
          <div>
            <h3>Señales de alarma, calendario y participación</h3>
            <p>
              Este espacio reunirá contenidos educativos, eventos públicos,
              campañas y materiales de orientación para familias, empresas y
              aliados de la fundación.
            </p>
            <Link className="public-text-link" to="/eventos-publicos">
              Ver eventos <i className="pi pi-arrow-right" />
            </Link>
          </div>
        </div>
      </section>

      <section className="public-section public-news" id="noticias">
        <div className="public-section-head align-left">
          <span className="public-kicker">Noticias y campañas</span>
          <h2>Historias, comunicados y acciones recientes.</h2>
        </div>
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
        <div className="public-section-action align-left">
          <Link className="public-text-link" to="/noticias">
            Ver noticias <i className="pi pi-arrow-right" />
          </Link>
        </div>
      </section>

      <section className="public-newsletter" id="contacto">
        <div>
          <span className="public-kicker">Permanece informado</span>
          <h2>Recibe noticias, eventos y campañas de la fundación.</h2>
        </div>
        <form className="public-newsletter-form">
          <input type="email" placeholder="tu correo electrónico" aria-label="Correo electrónico" />
          <button type="button">Suscribirme</button>
        </form>
      </section>

    </PublicLayout>
  );
};
