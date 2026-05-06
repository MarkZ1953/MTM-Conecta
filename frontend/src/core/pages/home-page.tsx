import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import "./home-page.css";

/* ── Imágenes placeholder — reemplazar con fotos reales de la fundación ── */
const HERO_IMG =
  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80";
const GALLERY = [
  "https://images.unsplash.com/photo-1594708767771-a7502209ff51?w=600&q=80",
  "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=600&q=80",
  "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=600&q=80",
];

export const HomePage = () => {
  const navigate = useNavigate();
  const [navScrolled, setNavScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="landing">
      {/* ─── Navbar ─── */}
      <nav className={`landing-nav ${navScrolled ? "scrolled" : ""}`}>
        <a href="#" className="landing-nav__brand" onClick={() => scrollTo("hero")}>
          🎗️ MTM-Conecta
        </a>

        <button
          className="landing-nav__hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <i className={`pi ${menuOpen ? "pi-times" : "pi-bars"}`} />
        </button>

        <ul className={`landing-nav__links ${menuOpen ? "open" : ""}`}>
          <li><a href="#nosotros" onClick={() => scrollTo("nosotros")}>Nosotros</a></li>
          <li><a href="#mision" onClick={() => scrollTo("mision")}>Misión y Visión</a></li>
          <li><a href="#servicios" onClick={() => scrollTo("servicios")}>Programas</a></li>
          <li><a href="#donar" onClick={() => scrollTo("donar")}>Donar</a></li>
          <li>
            <Button
              label="Iniciar Sesión"
              className="landing-nav__cta"
              icon="pi pi-sign-in"
              onClick={() => navigate("/login")}
            />
          </li>
        </ul>
      </nav>

      {/* ─── Hero ─── */}
      <section className="landing-hero" id="hero">
        <div className="landing-hero__bg-shape landing-hero__bg-shape--1" />
        <div className="landing-hero__bg-shape landing-hero__bg-shape--2" />
        <div className="landing-hero__bg-shape landing-hero__bg-shape--3" />

        <div className="landing-hero__inner">
          <div>
            <div className="landing-hero__badge">
              🎗️ Fundación Mujeres Trabajando por el Meta
            </div>
            <h1 className="landing-hero__title">
              <span>Conectando mujeres,</span> transformando vidas
            </h1>
            <p className="landing-hero__subtitle">
              Somos una fundación compuesta por mujeres comprometidas con el
              acompañamiento a niños con cáncer y sus familias. Brindamos apoyo,
              conexión y esperanza.
            </p>
            <div className="landing-hero__actions">
              <Button
                label="Quiero Donar"
                icon="pi pi-heart"
                onClick={() => scrollTo("donar")}
              />
              <Button
                label="Conócenos"
                icon="pi pi-arrow-down"
                className="p-button-outlined"
                onClick={() => scrollTo("nosotros")}
              />
            </div>
            <p className="landing-script" style={{ marginTop: "1.5rem", fontSize: "1.2rem", color: "var(--mtm-primary)" }}>
              Juntas crecemos 💜
            </p>
          </div>

          <div className="landing-hero__image-wrapper">
            <img src={HERO_IMG} alt="Fundación MTM-Conecta — mujeres y niños" loading="lazy" />
            <div className="landing-hero__float-card landing-hero__float-card--1">
              <div className="landing-hero__float-icon" style={{ background: "var(--mtm-rose)" }}>
                <i className="pi pi-heart-fill" />
              </div>
              <div className="landing-hero__float-text">
                <strong>+500 Familias</strong>
                <span>Acompañadas</span>
              </div>
            </div>
            <div className="landing-hero__float-card landing-hero__float-card--2">
              <div className="landing-hero__float-icon" style={{ background: "var(--mtm-accent)" }}>
                🎗️
              </div>
              <div className="landing-hero__float-text">
                <strong>Lazo Dorado</strong>
                <span>Cáncer infantil</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Stats ─── */}
      <div className="landing-stats">
        {[
          { num: "500+", label: "Familias Acompañadas" },
          { num: "200+", label: "Niños Apoyados" },
          { num: "50+", label: "Mujeres Voluntarias" },
          { num: "100%", label: "Compromiso y Amor" },
        ].map((s) => (
          <div className="landing-stats__card" key={s.label}>
            <div className="landing-stats__number">{s.num}</div>
            <div className="landing-stats__label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ─── Misión / Visión / Valores ─── */}
      <section className="landing-section" id="mision">
        <div className="landing-section__header">
          <span className="landing-section__tag">Nuestra Esencia</span>
          <h2 className="landing-section__title">Misión, Visión y Valores</h2>
          <p className="landing-section__subtitle">
            Los pilares que guían nuestro trabajo con los niños con cáncer y sus
            familias en el departamento del Meta.
          </p>
        </div>

        <div className="landing-mvv">
          <div className="landing-mvv__card landing-mvv__card--mision">
            <div className="landing-mvv__icon">
              <i className="pi pi-flag" />
            </div>
            <h3 className="landing-mvv__title">Misión</h3>
            <p className="landing-mvv__text">
              Acompañar integralmente a niños diagnosticados con cáncer y a sus
              familias, brindando apoyo emocional, social y económico a través de
              una red de mujeres comprometidas con la vida y la esperanza.
            </p>
          </div>

          <div className="landing-mvv__card landing-mvv__card--vision">
            <div className="landing-mvv__icon">
              <i className="pi pi-eye" />
            </div>
            <h3 className="landing-mvv__title">Visión</h3>
            <p className="landing-mvv__text">
              Ser la fundación líder en el Meta en el acompañamiento a la niñez
              con cáncer, reconocida por su modelo de sororidad, transparencia y
              empoderamiento femenino al servicio de la comunidad.
            </p>
          </div>

          <div className="landing-mvv__card landing-mvv__card--valores">
            <div className="landing-mvv__icon">
              <i className="pi pi-star" />
            </div>
            <h3 className="landing-mvv__title">Valores</h3>
            <p className="landing-mvv__text">
              Humanidad, sororidad, inclusión, transparencia, confianza y
              compromiso social. Cada acción nace del amor y la convicción de que
              juntas podemos transformar vidas.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Sobre Nosotros (con galería) ─── */}
      <section className="landing-about" id="nosotros">
        <div className="landing-about__inner">
          <div className="landing-about__gallery">
            <img src={GALLERY[0]} alt="Voluntarias de la fundación" loading="lazy" />
            <img src={GALLERY[1]} alt="Acompañamiento a familias" loading="lazy" />
            <img src={GALLERY[2]} alt="Actividades con los niños" loading="lazy" />
          </div>

          <div className="landing-about__content">
            <span className="landing-section__tag">Sobre Nosotros</span>
            <h2>
              Mujeres unidas por una <span>causa de vida</span>
            </h2>
            <p>
              La Fundación Mujeres Trabajando por el Meta (MTM-Conecta) nació
              del deseo de un grupo de mujeres de generar un impacto real en su
              comunidad. Nos dedicamos al acompañamiento de niños con cáncer y
              sus familias, ofreciendo apoyo integral durante su proceso.
            </p>
            <p>
              Creemos en el poder de la conexión, la empatía y la sororidad.
              Nuestra plataforma digital facilita la gestión de recursos, la
              comunicación y la transparencia para que cada aporte llegue a
              donde más se necesita.
            </p>

            <div className="landing-about__features">
              {[
                "Apoyo Emocional",
                "Sororidad y Unión",
                "Transparencia Total",
                "Empoderamiento Femenino",
              ].map((f) => (
                <div className="landing-about__feature" key={f}>
                  <i className="pi pi-check-circle" />
                  {f}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Programas / Servicios ─── */}
      <section className="landing-section" id="servicios">
        <div className="landing-section__header">
          <span className="landing-section__tag">Lo Que Hacemos</span>
          <h2 className="landing-section__title">Nuestros Programas</h2>
          <p className="landing-section__subtitle">
            Programas diseñados con amor para acompañar a los niños y sus
            familias en cada etapa de su proceso.
          </p>
        </div>

        <div className="landing-services">
          {[
            {
              icon: "pi-heart",
              title: "Acompañamiento Oncológico",
              desc: "Apoyo integral a niños diagnosticados con cáncer durante su tratamiento médico y recuperación.",
            },
            {
              icon: "pi-users",
              title: "Red de Mujeres",
              desc: "Una comunidad de mujeres voluntarias que brindan escucha, empatía y acompañamiento a las familias.",
            },
            {
              icon: "pi-home",
              title: "Apoyo a Familias",
              desc: "Asistencia social y económica para familias que enfrentan el diagnóstico de cáncer infantil.",
            },
            {
              icon: "pi-book",
              title: "Educación y Talleres",
              desc: "Talleres de empoderamiento, crecimiento personal y desarrollo para las mujeres de la fundación.",
            },
            {
              icon: "pi-megaphone",
              title: "Comunicación y Difusión",
              desc: "Historias que inspiran y mensajes que transforman. Visibilizamos la lucha contra el cáncer infantil.",
            },
            {
              icon: "pi-shield",
              title: "Gestión Transparente",
              desc: "Control y seguimiento de donaciones y recursos con total transparencia y trazabilidad.",
            },
          ].map((s) => (
            <div className="landing-service-card" key={s.title}>
              <div className="landing-service-card__icon">
                <i className={`pi ${s.icon}`} />
              </div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA Donaciones ─── */}
      <section className="landing-donate" id="donar">
        <div className="landing-donate__inner">
          <div className="landing-donate__icon">🎗️</div>
          <h2>Tu Donación Transforma Vidas</h2>
          <p>
            Cada aporte nos permite seguir acompañando a niños con cáncer y a
            sus familias. Tu generosidad se convierte en medicina, en
            transporte, en alimento y sobre todo, en esperanza. Únete a nuestra
            causa.
          </p>
          <Button
            label="Hacer una Donación"
            icon="pi pi-heart-fill"
            className="landing-donate__btn"
            onClick={() => navigate("/donar")}
          />
          <p style={{ marginTop: "1.5rem", opacity: 0.8, fontSize: "0.95rem" }}>
            Apoyo · Conexión · Transformación
          </p>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="landing-footer">
        <div className="landing-footer__inner">
          <div>
            <div className="landing-footer__brand">
              🎗️ MTM-<span>Conecta</span>
            </div>
            <p className="landing-footer__desc">
              Fundación Mujeres Trabajando por el Meta. Conectando mujeres,
              transformando vidas. Una red que impulsa tu camino.
            </p>
            <div className="landing-footer__social">
              <a href="#" aria-label="Facebook"><i className="pi pi-facebook" /></a>
              <a href="#" aria-label="Instagram"><i className="pi pi-instagram" /></a>
              <a href="#" aria-label="Twitter"><i className="pi pi-twitter" /></a>
              <a href="#" aria-label="LinkedIn"><i className="pi pi-linkedin" /></a>
            </div>
          </div>

          <div>
            <h4>Enlaces</h4>
            <ul>
              <li><a href="#" onClick={() => scrollTo("hero")}>Inicio</a></li>
              <li><a href="#" onClick={() => scrollTo("nosotros")}>Nosotros</a></li>
              <li><a href="#" onClick={() => scrollTo("mision")}>Misión y Visión</a></li>
              <li><a href="#" onClick={() => scrollTo("servicios")}>Programas</a></li>
            </ul>
          </div>

          <div>
            <h4>Comunidad</h4>
            <ul>
              <li><a href="#" onClick={() => scrollTo("donar")}>Donar</a></li>
              <li><a href="#">Voluntariado</a></li>
              <li><a href="#">Eventos</a></li>
              <li><a href="#">Testimonios</a></li>
            </ul>
          </div>

          <div>
            <h4>Contacto</h4>
            <ul>
              <li><a href="mailto:contacto@mtmconecta.org">contacto@mtmconecta.org</a></li>
              <li><a href="#">Villavicencio, Meta</a></li>
              <li><a href="#">Colombia 🇨🇴</a></li>
            </ul>
          </div>
        </div>

        <div className="landing-footer__bottom">
          © {new Date().getFullYear()} MTM-Conecta — Fundación Mujeres Trabajando por el Meta. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
};
