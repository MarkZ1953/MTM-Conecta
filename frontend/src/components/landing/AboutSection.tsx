interface Value {
  icon: string
  label: string
  desc: string
  color: string
}

const VALUES: Value[] = [
  { icon: 'pi pi-heart', label: 'Amor', desc: 'Todo lo que hacemos nace del corazón y la voluntad propia.', color: 'bg-rose/10 text-rose' },
  { icon: 'pi pi-star', label: 'Transparencia', desc: 'Cada recurso es utilizado con total responsabilidad.', color: 'bg-amber-100 text-amber-600' },
  { icon: 'pi pi-users', label: 'Comunidad', desc: 'Somos un colectivo que crece junto a quienes ayudamos.', color: 'bg-teal/10 text-teal' },
  { icon: 'pi pi-check-circle', label: 'Compromiso', desc: 'Nuestra labor social no tiene límites ni condiciones.', color: 'bg-primary/10 text-primary' },
]

export default function AboutSection() {
  return (
    <section id="nosotros" className="py-24 bg-secondary/40">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16 reveal">
          <p className="section-label text-teal mb-3">Nuestra Historia</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
            Sobre la Fundación MTM
          </h2>
          <div className="w-16 h-1 bg-accent rounded-full mx-auto" />
        </div>

        {/* Origin story */}
        <div className="max-w-4xl mx-auto mb-20 reveal">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-primary/5 border border-border/50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-primary-gradient rounded-l-3xl" />
            <div className="pl-4">
              <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                Este proyecto nació en <strong className="text-primary">2017</strong>, impulsado por la necesidad urgente
                de la comunidad oncológica de la región de contar con una organización de apoyo.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                El primer impulso vino del <strong className="text-primary">Grupo Emprendedoras del Meta</strong>,
                un colectivo de mujeres comerciantes que iniciaron esta labor social desde el corazón y por
                voluntad propia.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Fue en ese camino donde nació la{' '}
                <strong className="text-primary">Fundación Mujeres Trabajando por el Meta</strong>,
                con el propósito de hacer labor social, aportar a nuestra región y dejar nuestro
                granito de arena en el mundo.
              </p>
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-20 reveal">
          <div className="bg-white rounded-3xl p-8 shadow-lg shadow-primary/5 border border-border/50 card-hover">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
              <i className="pi pi-bullseye text-primary text-2xl" />
            </div>
            <h3 className="font-display text-2xl font-bold text-foreground mb-4">Misión</h3>
            <p className="text-muted-foreground leading-relaxed">
              Mejorar la calidad de vida de niños y jóvenes con cáncer y sus familias, brindando
              apoyo integral, bienestar y oportunidades para su desarrollo.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-lg shadow-primary/5 border border-border/50 card-hover">
            <div className="w-14 h-14 rounded-2xl bg-teal/10 flex items-center justify-center mb-6">
              <i className="pi pi-eye text-teal text-2xl" />
            </div>
            <h3 className="font-display text-2xl font-bold text-foreground mb-4">Visión</h3>
            <p className="text-muted-foreground leading-relaxed">
              Ser un referente en Colombia en el apoyo a niños con cáncer, ampliando nuestra
              cobertura y fortaleciendo programas que mejoren su calidad de vida.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="reveal">
          <p className="text-center section-label text-muted-foreground mb-8">Nuestros Valores</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {VALUES.map((v) => (
              <div key={v.label} className="text-center group">
                <div
                  className={`w-16 h-16 rounded-2xl ${v.color} flex items-center justify-center mx-auto mb-4 transition-transform group-hover:scale-110`}
                >
                  <i className={`${v.icon} text-2xl`} />
                </div>
                <h4 className="font-semibold text-foreground mb-1">{v.label}</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
