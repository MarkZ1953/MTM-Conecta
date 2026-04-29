interface HeroSectionProps {
  onDonate: () => void
  onVolunteer: () => void
}

export default function HeroSection({ onDonate, onVolunteer }: HeroSectionProps) {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-primary-gradient" />
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-white/5 translate-x-1/2 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-white/5 -translate-x-1/3 translate-y-1/4" />
        <div className="absolute top-1/2 left-1/4 w-2 h-2 rounded-full bg-amber-300/60" />
        <div className="absolute top-1/3 right-1/4 w-3 h-3 rounded-full bg-rose/40" />
        <div className="absolute bottom-1/3 right-1/3 w-2 h-2 rounded-full bg-teal/50" />
        {/* Pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center py-28">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-8 animate-fade-in">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse" />
          <span className="text-white/90 text-xs font-medium tracking-widest uppercase">
            #JuntosXUnMundoSinCáncer
          </span>
        </div>

        {/* Heading */}
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.05] mb-6 animate-fade-up">
          Transformando{' '}
          <em className="not-italic text-gold block md:inline">vidas</em>
          <span className="block text-white/90 text-3xl md:text-4xl lg:text-5xl font-light mt-2">
            con amor y esperanza
          </span>
        </h1>

        <p className="text-white/75 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-up animate-delay-100 font-light">
          Apoyamos a niños y jóvenes con cáncer y sus familias en el Meta,
          brindando acompañamiento integral para mejorar su calidad de vida.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up animate-delay-200">
          <button
            onClick={onDonate}
            className="inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground hover:bg-amber-400 px-8 py-4 rounded-full text-base font-semibold shadow-2xl shadow-amber-500/30 transition-all hover:scale-105"
          >
            <i className="pi pi-heart text-sm" />
            Hacer una donación
          </button>
          <button
            onClick={onVolunteer}
            className="inline-flex items-center justify-center gap-2 border-2 border-white/40 text-white hover:bg-white/10 px-8 py-4 rounded-full text-base font-medium transition-all"
          >
            <i className="pi pi-users text-sm" />
            Ser voluntario
          </button>
          <a
            href="#nosotros"
            className="inline-flex items-center justify-center gap-2 bg-white/15 text-white hover:bg-white/25 px-8 py-4 rounded-full text-base font-medium transition-all"
          >
            Conócenos
          </a>
        </div>

        {/* Stats */}
        <div className="mt-20 flex justify-center animate-fade-up animate-delay-300">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl">
            {[
              { num: '2017', label: 'Año de fundación' },
              { num: 'Meta', label: 'Región de impacto' },
              { num: '100%', label: 'Voluntad propia' },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-white/10 border border-white/15 rounded-2xl p-4 backdrop-blur-sm"
              >
                <p className="font-display text-2xl font-bold text-white">{s.num}</p>
                <p className="text-white/60 text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <a href="#nosotros">
          <i className="pi pi-chevron-down text-white/40 text-2xl block" />
        </a>
      </div>
    </section>
  )
}
