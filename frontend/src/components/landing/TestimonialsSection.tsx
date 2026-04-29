interface Testimonial {
  name: string
  role: string
  text: string
  initial: string
  color: string
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: 'María González',
    role: 'Mamá de paciente oncológico',
    text: 'La Fundación MTM fue un pilar fundamental en nuestro proceso. No solo con apoyo material, sino con ese acompañamiento humano que tanto necesitamos en momentos tan difíciles.',
    initial: 'M',
    color: 'bg-rose/20 text-rose',
  },
  {
    name: 'Carlos Rodríguez',
    role: 'Voluntario desde 2020',
    text: 'Ser voluntario en MTM cambió mi perspectiva de vida. Ver la sonrisa de los niños y sentir que marcamos una diferencia real es algo que no tiene precio.',
    initial: 'C',
    color: 'bg-teal/20 text-teal',
  },
  {
    name: 'Empresas Unidas del Meta',
    role: 'Aliado empresarial',
    text: 'Nuestra alianza con Fundación MTM nos ha permitido cumplir nuestra responsabilidad social de manera genuina y transparente. Los resultados hablan por sí solos.',
    initial: 'E',
    color: 'bg-amber-100 text-amber-600',
  },
]

export default function TestimonialsSection() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 reveal">
          <p className="section-label text-rose mb-3">Voces de Cambio</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Lo que dicen de nosotros
          </h2>
          <div className="w-16 h-1 bg-rose rounded-full mx-auto mt-4" />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={t.name}
              className="reveal bg-secondary/40 rounded-3xl p-8 relative border border-border/40 card-hover"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <i className="pi pi-quote text-primary/20 absolute top-6 right-6 text-4xl" />
              <p className="text-foreground/80 leading-relaxed mb-6 italic text-sm">
                "{t.text}"
              </p>
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center font-display font-bold text-sm`}
                >
                  {t.initial}
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{t.name}</p>
                  <p className="text-muted-foreground text-xs">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
