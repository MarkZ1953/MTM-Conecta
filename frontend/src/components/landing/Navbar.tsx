import { useState, useEffect } from 'react'

interface NavLink {
  label: string
  href: string
}

interface NavbarProps {
  onDonate: () => void
}

const NAV_LINKS: NavLink[] = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Nosotros', href: '#nosotros' },
  { label: 'Qué Hacemos', href: '#que-hacemos' },
  { label: 'Proyectos', href: '#proyectos' },
  { label: 'Cómo Ayudar', href: '#como-ayudar' },
  { label: 'Contacto', href: '#contacto' },
]

export default function Navbar({ onDonate }: NavbarProps) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md py-3'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        {/* Logo */}
        <a href="#inicio" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-primary-gradient flex items-center justify-center shadow-md">
            <i className="pi pi-heart text-white text-sm" />
          </div>
          <span
            className={`font-display text-xl font-bold transition-colors ${
              scrolled ? 'text-primary' : 'text-white'
            }`}
          >
            Fundación <span className={scrolled ? 'text-gold' : 'text-amber-300'}>MTM</span>
          </span>
        </a>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-amber-400 ${
                scrolled ? 'text-foreground/70' : 'text-white/85'
              }`}
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={onDonate}
            className="ml-2 inline-flex items-center gap-2 bg-accent text-accent-foreground hover:bg-amber-500 px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg shadow-amber-400/20 transition-all"
          >
            <i className="pi pi-heart text-xs" />
            Donar
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          className={`lg:hidden p-2 rounded-full ${scrolled ? 'text-primary' : 'text-white'}`}
          onClick={() => setOpen(!open)}
        >
          <i className={`pi ${open ? 'pi-times' : 'pi-bars'} text-xl`} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-white border-t border-border shadow-xl">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block px-6 py-3.5 text-foreground/80 hover:text-primary hover:bg-secondary text-sm font-medium border-b border-border/40"
            >
              {link.label}
            </a>
          ))}
          <div className="px-6 py-4">
            <button
              onClick={() => { setOpen(false); onDonate() }}
              className="w-full inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground px-5 py-3 rounded-full text-sm font-semibold"
            >
              <i className="pi pi-heart text-xs fill-current" /> Hacer una donación
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
