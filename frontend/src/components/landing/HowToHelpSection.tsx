interface Option {
  id: string
  icon: string
  title: string
  desc: string
  btnText: string
  accent: string
  bg: string
  border: string
  btnClass: string
}

interface HowToHelpSectionProps {
  onOpenModal: (type: string) => void
}

const OPTIONS: Option[] = [
  {
    id: 'donate',
    icon: 'pi pi-heart',
    title: 'Donar',
    desc: 'Tu aporte económico o en especie llega directamente a los niños y familias que más lo necesitan.',
    btnText: 'Hacer una donación',
    accent: 'text-rose',
    bg: 'bg-rose/10',
    border: 'border-rose/20',
    btnClass: 'bg-rose text-white hover:bg-rose/90 shadow-lg shadow-rose/20',
  },
  {
    id: 'volunteer',
    icon: 'pi pi-users',
    title: 'Ser Voluntario',
    desc: 'Únete a nuestra red de voluntarias y dona tu tiempo, talento y corazón para transformar vidas.',
    btnText: 'Quiero ser voluntario',
    accent: 'text-teal',
    bg: 'bg-teal/10',
    border: 'border-teal/20',
    btnClass: 'bg-teal text-white hover:bg-teal/90 shadow-lg shadow-teal/20',
  },
  {
    id: 'partner',
    icon: 'pi pi-building',
    title: 'Alianza Empresarial',
    desc: 'Tu empresa puede ser parte del cambio. Creamos alianzas de impacto social compartido.',
    btnText: 'Ser aliado empresarial',
    accent: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    btnClass: 'bg-accent text-accent-foreground hover:bg-amber-500 shadow-lg shadow-amber-400/20',
  },
]

export default function HowToHelpSection({ onOpenModal }: HowToHelpSectionProps) {
  return (
    <section id="como-ayudar" className="py-24 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-primary/3 translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full bg-rose/5 -translate-x-1/3 translate-y-1/3" />

      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <div className="text-center mb-16 reveal">
          <p className="section-label text-primary mb-3">Únete al Cambio</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
            Cómo Puedes Ayudar
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Hay muchas formas de ser parte de esta misión. Elige la que más se adapte a ti
            y juntos hagamos la diferencia.
          </p>
          <div className="w-16 h-1 bg-primary-gradient rounded-full mx-auto mt-6" />
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {OPTIONS.map((opt, i) => (
            <div
              key={opt.id}
              className={`reveal bg-white rounded-3xl p-8 border-2 ${opt.border} shadow-sm card-hover flex flex-col`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div
                className={`w-16 h-16 rounded-2xl ${opt.bg} ${opt.accent} flex items-center justify-center mb-6`}
              >
                <i className={`${opt.icon} text-2xl`} />
              </div>
              <h3 className="font-display text-2xl font-bold text-foreground mb-4">
                {opt.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-8 flex-1">{opt.desc}</p>
              <button
                onClick={() => onOpenModal(opt.id)}
                className={`inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-full text-sm font-semibold transition-all ${opt.btnClass}`}
              >
                {opt.btnText}
                <i className="pi pi-arrow-right text-sm" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
