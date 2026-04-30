interface Area {
  icon: string
  title: string
  desc: string
  color: string
  iconColor: string
}

const AREAS: Area[] = [
  {
    icon: 'pi pi-heart',
    title: 'Apoyo Oncológico',
    desc: 'Acompañamiento directo a niños y jóvenes en tratamiento de cáncer y a sus familias.',
    color: 'bg-rose/10 border-rose/20',
    iconColor: 'text-rose',
  },
  {
    icon: 'pi pi-heart',
    title: 'Salud Integral',
    desc: 'Jornadas médicas y apoyo en gestiones de salud para la comunidad más vulnerable.',
    color: 'bg-teal/10 border-teal/20',
    iconColor: 'text-teal',
  },
  {
    icon: 'pi pi-heart',
    title: 'Bienestar Familiar',
    desc: 'Soporte emocional y social para las familias que enfrentan la enfermedad.',
    color: 'bg-primary/10 border-primary/20',
    iconColor: 'text-primary',
  },
  {
    icon: 'pi pi-book',
    title: 'Educación',
    desc: 'Programas y recursos educativos para niños en tratamiento y convalecencia.',
    color: 'bg-amber-50 border-amber-200',
    iconColor: 'text-amber-600',
  },
  {
    icon: 'pi pi-shopping-bag',
    title: 'Alimentación',
    desc: 'Apoyo nutricional y kits alimentarios para familias en situación de vulnerabilidad.',
    color: 'bg-teal/10 border-teal/20',
    iconColor: 'text-teal',
  },
  {
    icon: 'pi pi-home',
    title: 'Ayuda Social',
    desc: 'Atención a necesidades básicas: vivienda, ropa, útiles y apoyo en emergencias.',
    color: 'bg-rose/10 border-rose/20',
    iconColor: 'text-rose',
  },
]

export default function WhatWeDoSection() {
  return (
    <section id="que-hacemos" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 reveal">
          <p className="section-label text-rose mb-3">Nuestro Trabajo</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
            Qué Hacemos
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Trabajamos en múltiples frentes para garantizar que ningún niño ni familia
            enfrente el cáncer sin apoyo.
          </p>
          <div className="w-16 h-1 bg-rose rounded-full mx-auto mt-6" />
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {AREAS.map((area, i) => (
            <div
              key={area.title}
              className={`reveal bg-white rounded-2xl p-7 border-2 ${area.color} shadow-sm card-hover`}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div
                className={`w-12 h-12 rounded-xl ${area.color.split(' ')[0]} ${area.iconColor} flex items-center justify-center mb-5`}
              >
                <i className={`${area.icon} text-xl`} />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-3">{area.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{area.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
