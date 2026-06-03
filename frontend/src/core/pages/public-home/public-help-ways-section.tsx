import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { publicHelpGallerySlides } from "./cloudinary-assets";
import { publicHelpWays, type PublicHelpWay } from "./public-help-options";
import type { PublicImageCarouselSlide } from "./public-image-carousel";
import { usePublicCloudinaryGallery } from "./use-public-cloudinary-gallery";

const getImageByToken = (assets: PublicImageCarouselSlide[], token: string) =>
  assets.find((asset) => asset.publicId?.toLowerCase().includes(token)) ?? assets[0];

function HelpMainCard({ card, image }: { card: PublicHelpWay; image?: PublicImageCarouselSlide }) {
  return (
    <article className={`public-help-showcase-card is-${card.tone}`}>
      {image && <img src={image.src} alt={image.alt} />}
      <div className="public-help-showcase-copy">
        <span className="public-help-showcase-icon">
          <i className={`pi ${card.icon}`} />
        </span>
        <span className="public-help-showcase-eyebrow">{card.eyebrow}</span>
        <h3>{card.title}</h3>
        <p>{card.heroText}</p>
        <Link to={card.path}>
          {card.linkLabel}
          <i className="pi pi-arrow-right" />
        </Link>
      </div>
    </article>
  );
}

function HelpSideCard({ card, image }: { card: PublicHelpWay; image?: PublicImageCarouselSlide }) {
  return (
    <article className={`public-help-showcase-side-card is-${card.tone}`}>
      <div>
        <span className="public-help-showcase-icon">
          <i className={`pi ${card.icon}`} />
        </span>
        <span className="public-help-showcase-eyebrow">{card.eyebrow}</span>
        <h3>{card.title}</h3>
        <p>{card.heroText}</p>
        <Link to={card.path}>
          {card.linkLabel}
          <i className="pi pi-arrow-right" />
        </Link>
      </div>
      {image && <img src={image.src} alt={image.alt} />}
    </article>
  );
}

export function PublicHelpWaysSection() {
  const helpAssets = usePublicCloudinaryGallery("como-puedo-ayudar", publicHelpGallerySlides);
  const background = getImageByToken(helpAssets, "fondo");
  const laborSocial = publicHelpWays[0];
  const presencial = publicHelpWays[1];
  const empresarial = publicHelpWays[2];
  const especie = publicHelpWays[3];

  return (
    <section
      className="public-help-showcase"
      id="ayudar"
      style={
        background
          ? ({ "--public-help-showcase-bg": `url(${background.src})` } as CSSProperties)
          : undefined
      }
    >
      <div className="public-help-showcase-head">
        <span>
          <i className="pi pi-heart" />
          Juntos transformamos vidas
        </span>
        <h2>
          Formas de <strong>ayudar</strong>
        </h2>
        <p>
          Cada acción cuenta. Tu tiempo, tus talentos y tus recursos nos permiten acompañar
          a niños, niñas y familias en su camino.
        </p>
      </div>

      <div className="public-help-showcase-layout">
        <HelpMainCard card={laborSocial} image={getImageByToken(helpAssets, laborSocial.imageToken)} />
        <HelpMainCard card={presencial} image={getImageByToken(helpAssets, presencial.imageToken)} />
        <div className="public-help-showcase-side">
          <HelpSideCard card={empresarial} image={getImageByToken(helpAssets, empresarial.imageToken)} />
          <HelpSideCard card={especie} image={getImageByToken(helpAssets, especie.imageToken)} />
        </div>
      </div>

      <div className="public-help-showcase-footer">
        <span>
          <i className="pi pi-heart" />
          Hay muchas más formas de ayudar
        </span>
        <p>Descubre otras maneras de ser parte del cambio.</p>
        <Link to="/contacto">
          Ver más formas de ayudar
          <i className="pi pi-arrow-right" />
        </Link>
      </div>
    </section>
  );
}
