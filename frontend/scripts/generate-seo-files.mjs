import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const publicDir = path.join(root, "public");

const envFiles = [".env", ".env.local", `.env.${process.env.NODE_ENV || ""}`].filter(Boolean);

for (const file of envFiles) {
  const filePath = path.join(root, file);
  if (!fs.existsSync(filePath)) continue;

  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;

    const [key, ...valueParts] = trimmed.split("=");
    if (!process.env[key]) {
      process.env[key] = valueParts.join("=").trim();
    }
  }
}

const siteUrl = (process.env.VITE_SITE_URL || "http://localhost:5173").replace(/\/+$/, "");

const routes = [
  { path: "/home", priority: "1.0", changefreq: "weekly" },
  { path: "/nosotros", priority: "0.9", changefreq: "monthly" },
  { path: "/programas", priority: "0.9", changefreq: "monthly" },
  { path: "/como-ayudar", priority: "0.9", changefreq: "monthly" },
  { path: "/como-ayudar/labor-social", priority: "0.8", changefreq: "monthly" },
  { path: "/como-ayudar/voluntariado-presencial", priority: "0.8", changefreq: "monthly" },
  { path: "/como-ayudar/voluntariado-empresarial", priority: "0.8", changefreq: "monthly" },
  { path: "/como-ayudar/aportes-en-especie", priority: "0.8", changefreq: "monthly" },
  { path: "/donar", priority: "0.9", changefreq: "monthly" },
  { path: "/donar/tarjeta-credito-debito", priority: "0.7", changefreq: "monthly" },
  { path: "/donar/pse", priority: "0.7", changefreq: "monthly" },
  { path: "/donar/paypal", priority: "0.7", changefreq: "monthly" },
  { path: "/bono-donacion", priority: "0.7", changefreq: "monthly" },
  { path: "/padrino-permanente", priority: "0.8", changefreq: "monthly" },
  { path: "/eventos-publicos", priority: "0.8", changefreq: "weekly" },
  { path: "/blog", priority: "0.8", changefreq: "weekly" },
  { path: "/noticias", priority: "0.8", changefreq: "weekly" },
  { path: "/testimonios", priority: "0.7", changefreq: "monthly" },
  { path: "/preguntas-frecuentes", priority: "0.6", changefreq: "monthly" },
  { path: "/contacto", priority: "0.8", changefreq: "monthly" },
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${siteUrl}${route.path}</loc>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

const robots = `User-agent: *
Allow: /

Disallow: /login
Disallow: /register
Disallow: /mi-cuenta
Disallow: /users
Disallow: /beneficiaries
Disallow: /events
Disallow: /donations
Disallow: /campaigns
Disallow: /subscribers
Disallow: /blog-posts
Disallow: /cap-collection

Sitemap: ${siteUrl}/sitemap.xml
`;

fs.mkdirSync(publicDir, { recursive: true });
fs.writeFileSync(path.join(publicDir, "sitemap.xml"), xml);
fs.writeFileSync(path.join(publicDir, "robots.txt"), robots);

console.log(`SEO files generated for ${siteUrl}`);
