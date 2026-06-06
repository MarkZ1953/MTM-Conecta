import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE_URL = (import.meta.env.VITE_SITE_URL || "http://localhost:5173").replace(/\/+$/, "");
const DEFAULT_TITLE = "Fundación MTM | Mujeres Trabajando por una Meta";
const DEFAULT_DESCRIPTION =
  "Fundación MTM acompaña a mujeres, niñas, niños y familias mediante programas sociales, voluntariado, donaciones y acciones comunitarias.";
const DEFAULT_IMAGE =
  "https://res.cloudinary.com/djee0c2fs/image/upload/f_auto,q_auto,w_1200/v1779826335/portada_fb_MTM_nkgfsz.jpg";

type SeoProps = {
  canonicalPath?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  noIndex?: boolean;
  title?: string;
  type?: "website" | "article";
};

function absoluteUrl(pathOrUrl: string) {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${SITE_URL}${path}`;
}

function setMeta(attribute: "name" | "property", key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
}

function setCanonical(href: string) {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", "canonical");
    document.head.appendChild(element);
  }

  element.setAttribute("href", href);
}

export function Seo({
  canonicalPath,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  imageAlt = "Fundación MTM - Mujeres Trabajando por una Meta",
  noIndex = false,
  title = DEFAULT_TITLE,
  type = "website",
}: SeoProps) {
  const location = useLocation();
  const canonical = absoluteUrl(canonicalPath || location.pathname || "/home");
  const imageUrl = absoluteUrl(image);

  useEffect(() => {
    document.documentElement.lang = "es-CO";
    document.title = title;

    setCanonical(canonical);
    setMeta("name", "description", description);
    setMeta("name", "robots", noIndex ? "noindex, follow" : "index, follow");

    setMeta("property", "og:locale", "es_CO");
    setMeta("property", "og:type", type);
    setMeta("property", "og:site_name", "Fundación MTM");
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", canonical);
    setMeta("property", "og:image", imageUrl);
    setMeta("property", "og:image:alt", imageAlt);

    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", imageUrl);
  }, [canonical, description, imageAlt, imageUrl, noIndex, title, type]);

  return null;
}
