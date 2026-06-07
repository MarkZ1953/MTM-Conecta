import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE_URL = (import.meta.env.VITE_SITE_URL || "http://localhost:5173").replace(/\/+$/, "");
const DEFAULT_TITLE = "Fundación MTM | Mujeres Trabajando por una Meta";
const DEFAULT_DESCRIPTION =
  "Fundación MTM acompaña a mujeres, niñas, niños y familias mediante programas sociales, voluntariado, donaciones y acciones comunitarias.";
const DEFAULT_IMAGE =
  "https://res.cloudinary.com/djee0c2fs/image/upload/f_auto,q_auto,w_1200/v1779826335/portada_fb_MTM_nkgfsz.jpg";
const JSON_LD_ID = "mtm-json-ld";

type JsonLd = Record<string, unknown>;
type JsonLdContext = {
  canonical: string;
  description: string;
  imageUrl: string;
  title: string;
};

type SeoProps = {
  breadcrumbTitle?: string;
  canonicalPath?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  jsonLd?: JsonLd | JsonLd[] | ((context: JsonLdContext) => JsonLd | JsonLd[] | null | undefined);
  noIndex?: boolean;
  title?: string;
  type?: "website" | "article";
};

const routeLabels: Record<string, string> = {
  "home": "Inicio",
  "nosotros": "Sobre nosotros",
  "programas": "Programas",
  "como-ayudar": "Cómo ayudar",
  "labor-social": "Labor social",
  "voluntariado-presencial": "Voluntariado presencial",
  "voluntariado-empresarial": "Voluntariado empresarial",
  "aportes-en-especie": "Aportes en especie",
  "donar": "Donar",
  "tarjeta-credito-debito": "Tarjeta de crédito o débito",
  "pse": "PSE",
  "paypal": "PayPal",
  "bono-donacion": "Bono Donación",
  "padrino-permanente": "Padrino permanente",
  "eventos-publicos": "Eventos públicos",
  "blog": "Blog",
  "noticias": "Noticias",
  "testimonios": "Testimonios",
  "preguntas-frecuentes": "Preguntas frecuentes",
  "contacto": "Contacto",
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

function buildOrganizationSchema() {
  return {
    "@type": "NGO",
    "@id": `${SITE_URL}/#organization`,
    name: "Fundación MTM",
    alternateName: "Fundación Mujeres Trabajando por una Meta",
    url: SITE_URL,
    logo: absoluteUrl("/logo-mtm.png"),
    image: DEFAULT_IMAGE,
    description: DEFAULT_DESCRIPTION,
    email: "contacto@fundacionmtm.org",
    telephone: "+573103423223",
    areaServed: ["Villavicencio", "Meta", "Orinoquía colombiana"],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Villavicencio",
      addressRegion: "Meta",
      addressCountry: "CO",
    },
  };
}

function buildWebsiteSchema() {
  return {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: "Fundación MTM",
    url: SITE_URL,
    inLanguage: "es-CO",
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
  };
}

function labelFromSegment(segment: string, fallback?: string) {
  if (fallback) return fallback;
  return routeLabels[segment] || segment.replace(/-/g, " ");
}

function buildBreadcrumbSchema(pathname: string, currentLabel?: string) {
  const segments = pathname.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);
  const normalizedSegments = segments.length > 0 ? segments : ["home"];

  const items = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Inicio",
      item: `${SITE_URL}/home`,
    },
  ];

  let accumulatedPath = "";
  normalizedSegments.forEach((segment, index) => {
    if (segment === "home") return;

    accumulatedPath += `/${segment}`;
    const isLast = index === normalizedSegments.length - 1;

    items.push({
      "@type": "ListItem",
      position: items.length + 1,
      name: labelFromSegment(segment, isLast ? currentLabel : undefined),
      item: `${SITE_URL}${accumulatedPath}`,
    });
  });

  return {
    "@type": "BreadcrumbList",
    "@id": `${SITE_URL}${pathname === "/" ? "/home" : pathname}#breadcrumb`,
    itemListElement: items,
  };
}

function updateJsonLd(graph: JsonLd[]) {
  let script = document.getElementById(JSON_LD_ID) as HTMLScriptElement | null;

  if (!script) {
    script = document.createElement("script");
    script.id = JSON_LD_ID;
    script.type = "application/ld+json";
    document.head.appendChild(script);
  }

  script.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": graph,
  }).replace(/<\/script/gi, "<\\/script");
}

export function Seo({
  breadcrumbTitle,
  canonicalPath,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  imageAlt = "Fundación MTM - Mujeres Trabajando por una Meta",
  jsonLd,
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

    const extraJsonLd = typeof jsonLd === "function"
      ? jsonLd({ canonical, description, imageUrl, title })
      : jsonLd;
    const extraGraph = Array.isArray(extraJsonLd)
      ? extraJsonLd
      : extraJsonLd
        ? [extraJsonLd]
        : [];

    updateJsonLd([
      buildOrganizationSchema(),
      buildWebsiteSchema(),
      buildBreadcrumbSchema(new URL(canonical).pathname, breadcrumbTitle),
      ...extraGraph,
    ]);
  }, [breadcrumbTitle, canonical, description, imageAlt, imageUrl, jsonLd, noIndex, title, type]);

  return null;
}
