import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export type PublicImageCarouselSlide = {
  alt: string;
  hotspots?: {
    className: string;
    label: string;
    to: string;
  }[];
  publicId?: string;
  src: string;
};

type PublicImageCarouselProps = {
  className?: string;
  label: string;
  slides: PublicImageCarouselSlide[];
};

export function PublicImageCarousel({
  className = "",
  label,
  slides,
}: PublicImageCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!slides.length) return null;

  const hasMultipleSlides = slides.length > 1;

  useEffect(() => {
    if (!hasMultipleSlides) return;

    const intervalId = window.setInterval(() => {
      setCurrentSlide((current) => (current + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [hasMultipleSlides, slides.length]);

  const goToSlide = (direction: "next" | "prev") => {
    setCurrentSlide((current) => {
      if (direction === "next") return (current + 1) % slides.length;
      return (current - 1 + slides.length) % slides.length;
    });
  };

  return (
    <section className={`public-image-carousel ${className}`.trim()} aria-label={label}>
      <div className="public-image-carousel-track">
        {slides.map((slide, index) => (
          <div
            aria-hidden={index !== currentSlide}
            className={`public-image-carousel-slide ${index === currentSlide ? "is-active" : ""}`}
            key={slide.publicId ?? slide.src}
          >
            <img className="public-image-carousel-image" src={slide.src} alt={slide.alt} />
            {slide.hotspots?.length ? (
              <div className="public-image-carousel-hotspots" aria-label={`${label}: enlaces`}>
                {slide.hotspots.map((hotspot) => (
                  <Link
                    aria-label={hotspot.label}
                    className={`public-image-carousel-hotspot ${hotspot.className}`}
                    key={hotspot.label}
                    tabIndex={index === currentSlide ? 0 : -1}
                    to={hotspot.to}
                  >
                    <span aria-hidden="true" />
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>

      {hasMultipleSlides && (
        <div className="public-image-carousel-controls" aria-label={`${label}: controles`}>
          <button
            type="button"
            className="public-image-carousel-arrow"
            onClick={() => goToSlide("prev")}
            aria-label="Ver imagen anterior"
          >
            <i className="pi pi-chevron-left" />
          </button>
          <div className="public-image-carousel-dots" aria-label="Seleccionar imagen">
            {slides.map((slide, index) => (
              <button
                key={slide.publicId ?? slide.src}
                type="button"
                className={index === currentSlide ? "is-active" : ""}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Ver imagen ${index + 1}`}
                aria-current={index === currentSlide ? "true" : undefined}
              />
            ))}
          </div>
          <button
            type="button"
            className="public-image-carousel-arrow"
            onClick={() => goToSlide("next")}
            aria-label="Ver imagen siguiente"
          >
            <i className="pi pi-chevron-right" />
          </button>
        </div>
      )}
    </section>
  );
}
