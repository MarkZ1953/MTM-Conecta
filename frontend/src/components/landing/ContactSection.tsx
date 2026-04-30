interface ContactInfo {
  icon: string
  label: string
  value: string
  color: string
}

interface ContactSectionProps {
  onOpenContact: () => void
}

const CONTACT_INFO: ContactInfo[] = [
  {
    icon: 'pi pi-map-marker',
    label: 'Ubicación',
    value: 'Villavicencio, Meta, Colombia',
    color: 'bg-rose/10 text-rose',
  },
  {
    icon: 'pi pi-phone',
    label: 'Teléfono',
    value: '+57 300 000 0000',
    color: 'bg-teal/10 text-teal',
  },
  {
    icon: 'pi pi-envelope',
    label: 'Email',
    value: 'contacto@fundacionmtm.org',
    color: 'bg-primary/10 text-primary',
  },
]

export default function ContactSection({ onOpenContact }: ContactSectionProps) {
  return (
    <section id="contacto" className="py-24 bg-secondary/40">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 reveal">
          <p className="section-label text-primary mb-3">Escríbenos</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
            Contáctanos
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            ¿Tienes preguntas, quieres colaborar o simplemente deseas saber más?
            Estamos aquí para escucharte.
          </p>
          <div className="w-16 h-1 bg-primary-gradient rounded-full mx-auto mt-6" />
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto reveal">
          {/* Info side */}
          <div className="space-y-6">
            <h3 className="font-display text-2xl font-bold text-foreground mb-6">
              Información de contacto
            </h3>
            {CONTACT_INFO.map((info) => (
              <div key={info.label} className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl ${info.color} flex items-center justify-center flex-shrink-0`}>
                  <i className={`${info.icon} text-lg`} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">
                    {info.label}
                  </p>
                  <p className="text-foreground font-medium">{info.value}</p>
                </div>
              </div>
            ))}

            {/* Social */}
            <div className="pt-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">
                Redes Sociales
              </p>
              <div className="flex gap-3">
                <a
                  href="https://www.instagram.com/fundacionmtm?igsh=bHVnN3N4cWR5ZnVv"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-10 h-10 rounded-xl bg-rose/10 flex items-center justify-center hover:bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 transition-all duration-300 overflow-hidden"
                  title="Instagram"
                >
                  <svg
                    className="w-5 h-5 text-rose group-hover:text-white transition-colors duration-300"
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
                  className="group w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center hover:bg-blue-600 transition-all duration-300 font-bold text-sm overflow-hidden"
                  title="Facebook"
                >
                  <span className="text-primary group-hover:text-white transition-colors duration-300">f</span>
                </a>
              </div>
              <p className="text-xs text-muted-foreground mt-3">@fundacionmtm</p>
            </div>

            {/* Hashtag */}
            <div className="bg-primary-gradient rounded-2xl p-5 text-white text-center mt-6">
              <p className="font-display text-xl font-bold tracking-wide">
                #JUNTOSXUNMUNDOSINCÁNCER
              </p>
              <p className="text-white/70 text-xs mt-1">Únete al movimiento</p>
            </div>
          </div>

          {/* CTA side */}
          <div className="bg-white rounded-3xl p-8 shadow-xl shadow-primary/5 border border-border/50 flex flex-col justify-center">
            <h3 className="font-display text-2xl font-bold text-foreground mb-3">
              ¿Listo para escribirnos?
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-8">
              Completa el formulario y nos pondremos en contacto lo antes posible. Tu mensaje es importante para nosotros.
            </p>
            <button
              onClick={onOpenContact}
              className="w-full inline-flex items-center justify-center gap-2 bg-primary text-white py-3.5 rounded-full font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              <i className="pi pi-envelope text-sm" /> Abrir formulario
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
