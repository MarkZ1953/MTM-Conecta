import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { publicHelpGallerySlides } from "./public-home/cloudinary-assets";
import {
  getPublicHelpWay,
  publicHelpWays,
  type PublicHelpWay,
  type PublicHelpWayKey,
} from "./public-home/public-help-options";
import type { PublicImageCarouselSlide } from "./public-home/public-image-carousel";
import { PublicLayout } from "./public-home/public-layout";
import { usePublicCloudinaryGallery } from "./public-home/use-public-cloudinary-gallery";

const getImageByToken = (assets: PublicImageCarouselSlide[], token: string) =>
  assets.find((asset) => asset.publicId?.toLowerCase().includes(token)) ?? assets[0];

function HelpDetailTabs({ current }: { current: PublicHelpWay }) {
  return (
    <nav className="public-help-detail-tabs" aria-label="Formas de ayudar">
      {publicHelpWays.map((way) => (
        <Link
          className={way.path === current.path ? "is-active" : ""}
          key={way.path}
          to={way.path}
        >
          <i className={`pi ${way.icon}`} />
          <span>{way.title}</span>
        </Link>
      ))}
    </nav>
  );
}

function CheckList({ items }: { items: string[] }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item}>
          <i className="pi pi-check-circle" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function HelpDetailPage({ type }: { type: PublicHelpWayKey }) {
  const helpAssets = usePublicCloudinaryGallery("como-puedo-ayudar", publicHelpGallerySlides);
  const current = getPublicHelpWay(type);
  const image = getImageByToken(helpAssets, current.imageToken);

  return (
    <PublicLayout className={`public-help-detail-page is-${current.tone}`}>
      <section
        className="public-help-detail"
        style={{ "--public-help-detail-accent": current.accent } as CSSProperties}
      >
        <div className="public-help-detail-shell">
          <nav className="public-help-breadcrumb" aria-label="Ruta de navegación">
            <Link to="/home">Inicio</Link>
            <i className="pi pi-angle-right" />
            <Link to="/como-ayudar">¿Cómo puedo ayudar?</Link>
            <i className="pi pi-angle-right" />
            <span>{current.title}</span>
          </nav>

          <HelpDetailTabs current={current} />

          <div className="public-help-detail-hero">
            {image && <img src={image.src} alt={image.alt} />}
            <div>
              <span className="public-help-detail-hero-icon">
                <i className={`pi ${current.icon}`} />
              </span>
              <span className="public-help-detail-eyebrow">{current.eyebrow}</span>
              <h1>{current.title}</h1>
              <p>{current.intro}</p>
              <strong>{current.quote}</strong>
            </div>
          </div>

          <div className="public-help-detail-value-grid">
            {current.valueCards.map((card) => (
              <article key={card.title}>
                <span>
                  <i className={`pi ${card.icon}`} />
                </span>
                <div>
                  <h2>{card.title}</h2>
                  <p>{card.text}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="public-help-detail-info-grid">
            <article>
              <span>
                <i className="pi pi-heart" />
              </span>
              <h2>¿En qué puedes apoyar?</h2>
              <CheckList items={current.support} />
            </article>
            <article>
              <span>
                <i className="pi pi-user" />
              </span>
              <h2>Perfil recomendado</h2>
              <CheckList items={current.profile} />
            </article>
          </div>

          <div className="public-help-detail-process">
            <h2>¿Cómo funciona?</h2>
            <div>
              {current.steps.map((step, index) => (
                <article key={step.title}>
                  <strong>{index + 1}</strong>
                  <i className={`pi ${step.icon}`} />
                  <span>
                    <b>{step.title}</b>
                    {step.text}
                  </span>
                </article>
              ))}
            </div>
          </div>

          <div className="public-help-detail-bottom">
            <div className="public-help-detail-cta">
              <i className="pi pi-heart" />
              <p>{current.heroText}</p>
              <Link to={current.tone === "rose" ? "/register" : "/contacto"}>
                <i className="pi pi-heart" />
                {current.linkLabel}
              </Link>
            </div>

            <div className="public-help-detail-meta" aria-label="Información rápida">
              <article>
                <i className="pi pi-calendar" />
                <b>Frecuencia</b>
                <span>{current.frequency}</span>
              </article>
              <article>
                <i className="pi pi-clock" />
                <b>Duración</b>
                <span>{current.duration}</span>
              </article>
              <article>
                <i className="pi pi-map-marker" />
                <b>Lugar</b>
                <span>{current.location}</span>
              </article>
              <article>
                <i className="pi pi-whatsapp" />
                <b>{current.contactLabel}</b>
                <span>{current.contactText}</span>
              </article>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
