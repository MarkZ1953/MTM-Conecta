interface FooterLink {
  label: string
  href: string
}

interface FooterProps {
  onDonate: () => void
}

const FOOTER_LINKS: FooterLink[] = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Nosotros', href: '#nosotros' },
  { label: 'Qué Hacemos', href: '#que-hacemos' },
  { label: 'Proyectos', href: '#proyectos' },
  { label: 'Cómo Ayudar', href: '#como-ayudar' },
  { label: 'Contacto', href: '#contacto' },
]

export default function Footer({ onDonate }: FooterProps) {
  return (
    <footer className="bg-primary-gradient text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
                <i className="pi pi-heart text-amber-300 text-sm" />
              </div>
              <span className="font-display text-xl font-bold">
                Fundación <span className="text-amber-300">MTM</span>
              </span>
            </div>
            <p className="text-white/65 text-sm leading-relaxed mb-4">
              Fundación Mujeres Trabajando por el Meta. Mejorando la calidad de vida
              de niños y jóvenes con cáncer desde 2017.
            </p>
            <p className="text-amber-300 text-xs font-semibold tracking-widest">
              #JUNTOSXUNMUNDOSINCÁNCER
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-white mb-5 text-sm uppercase tracking-widest">
              Navegación
            </h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="font-semibold text-white mb-5 text-sm uppercase tracking-widest">
              Conéctate
            </h4>
            <div className="space-y-3 mb-6">
              <a
                href="mailto:contacto@fundacionmtm.org"
                className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors"
              >
                <i className="pi pi-envelope text-sm" /> contacto@fundacionmtm.org
              </a>
              <p className="text-white/60 text-sm">Villavicencio, Meta, Colombia</p>
            </div>
            <div className="flex gap-3 mb-6">
              <a
                href="https://www.instagram.com/fundacionmtm?igsh=bHVnN3N4cWR5ZnVv"
                target="_blank"
                rel="noopener noreferrer"
                className="group w-9 h-9 rounded-full bg-white/10 hover:bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 flex items-center justify-center transition-all duration-300 overflow-hidden"
                title="Instagram"
              >
                <svg
                  className="w-5 h-5 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <circle cx="17.5" cy="6.5" r="1.5" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/mujerestrabajandoporelmeta/"
                target="_blank"
                rel="noopener noreferrer"
                className="group w-9 h-9 rounded-full bg-white/10 hover:bg-blue-600 flex items-center justify-center transition-all duration-300 font-bold text-xs overflow-hidden"
                title="Facebook"
              >
                <span className="text-white">f</span>
              </a>
            </div>
            <button
              onClick={onDonate}
              className="inline-flex items-center gap-2 bg-accent text-accent-foreground hover:bg-amber-400 px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-lg shadow-amber-400/20"
            >
              <i className="pi pi-heart text-sm fill-current" /> Donar ahora
            </button>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-xs">
            © {new Date().getFullYear()} Fundación MTM — Mujeres Trabajando por el Meta.
            Todos los derechos reservados.
          </p>
          <p className="text-white/40 text-xs">
            Hecho con <i className="pi pi-heart inline text-xs fill-current" /> por el equipo MTM
          </p>
        </div>
      </div>
    </footer>
  )
}
