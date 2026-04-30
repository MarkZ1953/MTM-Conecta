interface Project {
  name: string
  desc: string
  status: string
  area: string
}

interface Stat {
  num: string
  label: string
}

const PROJECTS: Project[] = [
  { name: 'Apoyo Comunidad Oncológica', desc: 'Programa central de acompañamiento y apoyo integral a pacientes y familias afectadas por el cáncer en el Meta.', status: 'Activo', area: 'Salud' },
  { name: 'Jornadas de Amor', desc: 'Jornadas de atención médica, entrega de mercados y kits de aseo para familias vulnerables de la región.', status: 'Activo', area: 'Ayuda Social' },
  { name: 'Emprendedoras Solidarias', desc: 'Red de mujeres que trabajan colaborativamente para generar recursos y apoyar causas sociales.', status: 'Activo', area: 'Emprendimiento' },
  { name: 'Navidad con Amor', desc: 'Campaña navideña anual de donación de regalos, ropa y alimentos para niños y familias de escasos recursos.', status: 'Activo', area: 'Ayuda Social' },
  { name: 'Útiles Escolares', desc: 'Entrega de kits escolares a niños en situación de vulnerabilidad para garantizar su acceso a la educación.', status: 'Activo', area: 'Educación' },
  { name: 'Red de Voluntarias', desc: 'Construcción y fortalecimiento de una red de mujeres voluntarias comprometidas con el bienestar social.', status: 'Activo', area: 'Comunidad' },
]

const AREA_COLORS: Record<string, string> = {
  Salud: 'bg-rose/10 text-rose',
  'Ayuda Social': 'bg-teal/10 text-teal',
  Emprendimiento: 'bg-amber-100 text-amber-600',
  Educación: 'bg-primary/10 text-primary',
  Comunidad: 'bg-rose/10 text-rose',
}

const STATS: Stat[] = [
  { num: '2017', label: 'Desde' },
  { num: 'MTM', label: 'Identidad' },
  { num: 'Meta', label: 'Región' },
  { num: '❤️', label: 'Con amor' },
]

export default function ProjectsSection() {
  return (
    <section id="proyectos" className="py-24 bg-secondary/40">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 reveal">
          <p className="section-label text-teal mb-3">Impacto Real</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
            Nuestros Proyectos
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Cada iniciativa es una historia de transformación. Conoce cómo estamos
            cambiando realidades en el Meta.
          </p>
          <div className="w-16 h-1 bg-teal rounded-full mx-auto mt-6" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 reveal">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="bg-white rounded-2xl p-6 text-center shadow-sm border border-border/50"
            >
              <p className="font-display text-3xl font-bold text-rose mb-1">{s.num}</p>
              <p className="text-muted-foreground text-sm">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Projects grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROJECTS.map((p, i) => (
            <div
              key={p.name}
              className="reveal bg-white rounded-2xl p-6 border border-border/50 shadow-sm card-hover"
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${AREA_COLORS[p.area] || 'bg-muted text-muted-foreground'}`}
                >
                  {p.area}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs text-teal font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
                  {p.status}
                </span>
              </div>
              <h3 className="font-display text-lg font-bold text-foreground mb-2">{p.name}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
