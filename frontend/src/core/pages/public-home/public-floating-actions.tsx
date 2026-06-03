import { useEffect, useRef, useState } from "react";

const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/",
    icon: "pi pi-facebook",
    className: "facebook",
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/",
    customIcon: "tiktok",
    className: "tiktok",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/",
    icon: "pi pi-instagram",
    className: "instagram",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/",
    icon: "pi pi-youtube",
    className: "youtube",
  },
];

export function PublicFloatingActions() {
  const [showTopButton, setShowTopButton] = useState(false);
  const isVisibleRef = useRef(false);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const updateTopButton = () => {
      const shouldShow = window.scrollY > 520;

      if (isVisibleRef.current !== shouldShow) {
        isVisibleRef.current = shouldShow;
        setShowTopButton(shouldShow);
      }
    };

    const scheduleUpdate = () => {
      if (frameRef.current !== null) return;

      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = null;
        updateTopButton();
      });
    };

    updateTopButton();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);

      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <div className="public-floating-actions" aria-label="Redes sociales">
        <div className="public-floating-socials" aria-label="Redes sociales">
          {socialLinks.map((item) => (
            <a
              key={item.label}
              className={`public-floating-social is-${item.className}`}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              aria-label={item.label}
              title={item.label}
            >
              {item.customIcon === "tiktok" ? (
                <svg className="public-floating-tiktok-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M16.74 3.02c.26 2.1 1.46 3.44 3.51 3.57v3.03c-1.19.11-2.23-.27-3.42-1v5.67c0 7.2-7.84 9.45-11 4.29-2.03-3.32-.79-9.14 5.73-9.37v3.2c-.39.06-.81.16-1.19.29-1.14.38-1.78 1.1-1.6 2.37.35 2.44 4.82 3.16 4.45-1.6V3.03h3.52Z" />
                </svg>
              ) : (
                <i className={item.icon} />
              )}
            </a>
          ))}
        </div>
      </div>

      <button
        className={`public-scroll-top ${showTopButton ? "is-visible" : ""}`}
        type="button"
        onClick={scrollToTop}
        aria-label="Volver al inicio"
        title="Volver al inicio"
      >
        <i className="pi pi-arrow-up" />
      </button>
    </>
  );
}
