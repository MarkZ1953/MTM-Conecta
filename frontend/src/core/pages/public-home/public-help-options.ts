export type PublicHelpWayKey =
  | "labor-social"
  | "voluntariado-presencial"
  | "voluntariado-empresarial"
  | "aportes-en-especie";

export type PublicHelpWayTone = "lime" | "rose" | "teal" | "purple";

export type PublicHelpWay = {
  accent: string;
  contactLabel: string;
  contactText: string;
  duration: string;
  eyebrow: string;
  frequency: string;
  heroText: string;
  icon: string;
  imageToken: string;
  intro: string;
  linkLabel: string;
  location: string;
  path: string;
  profile: string[];
  quote: string;
  steps: Array<{
    icon: string;
    text: string;
    title: string;
  }>;
  support: string[];
  title: string;
  tone: PublicHelpWayTone;
  valueCards: Array<{
    icon: string;
    text: string;
    title: string;
  }>;
};

export const publicHelpWays: PublicHelpWay[] = [
  {
    accent: "#8ba300",
    contactLabel: "Contacto",
    contactText: "310 342 3223",
    duration: "Según la actividad",
    eyebrow: "Comunidad",
    frequency: "Jornadas programadas",
    heroText:
      "Colegios, universidades y grupos estudiantiles pueden apoyar con actividades, campañas y proyectos que generan bienestar y esperanza.",
    icon: "pi-users",
    imageToken: "laborsocial",
    intro:
      "La labor social conecta comunidades educativas y grupos solidarios con acciones concretas para acompañar a nuestros niños, niñas y familias.",
    linkLabel: "Organiza tu actividad",
    location: "Villavicencio, Meta",
    path: "/como-ayudar/labor-social",
    profile: [
      "Colegios, universidades o grupos estudiantiles",
      "Equipos con disposición de servicio",
      "Acompañamiento responsable y respetuoso",
      "Actividad coordinada previamente con la fundación",
    ],
    quote: "Cada grupo puede sembrar esperanza con una acción bien hecha.",
    steps: [
      {
        icon: "pi-envelope",
        text: "Cuéntanos qué institución o grupo desea apoyar.",
        title: "Escríbenos",
      },
      {
        icon: "pi-list-check",
        text: "Definimos juntos el tipo de jornada o campaña.",
        title: "Planeamos",
      },
      {
        icon: "pi-calendar",
        text: "Acordamos fecha, lugar y necesidades logísticas.",
        title: "Coordinamos",
      },
      {
        icon: "pi-heart",
        text: "Tu comunidad participa y transforma vidas.",
        title: "Realizan la actividad",
      },
    ],
    support: [
      "Actividades lúdicas, educativas y recreativas",
      "Campañas solidarias institucionales",
      "Proyectos de bienestar para pacientes y familias",
      "Jornadas de recolección de elementos útiles",
    ],
    title: "Labor Social",
    tone: "lime",
    valueCards: [
      {
        icon: "pi-heart",
        text: "Tu comunidad acompaña procesos reales con cercanía y respeto.",
        title: "Acción con sentido",
      },
      {
        icon: "pi-users",
        text: "Los grupos aprenden sirviendo y aportando a una causa local.",
        title: "Aprendizaje solidario",
      },
      {
        icon: "pi-star",
        text: "Cada jornada suma bienestar, esperanza y redes de apoyo.",
        title: "Impacto comunitario",
      },
    ],
  },
  {
    accent: "#e63b7a",
    contactLabel: "Contacto",
    contactText: "310 342 3223",
    duration: "Desde 2 horas en adelante",
    eyebrow: "Tiempo y corazón",
    frequency: "Según la actividad",
    heroText:
      "Personas que donan su tiempo para apoyar actividades lúdicas, educativas y de bienestar con pacientes, cuidadores y familias.",
    icon: "pi-heart",
    imageToken: "voluntariadopresencial",
    intro:
      "El voluntariado presencial brinda compañía, alegría y apoyo humano en actividades que hacen más llevadero el camino de las familias.",
    linkLabel: "Quiero ser voluntario",
    location: "Instalaciones y actividades MTM",
    path: "/como-ayudar/voluntariado-presencial",
    profile: [
      "Mayores de 18 años",
      "Con empatía, respeto y compromiso",
      "Disponibilidad según la actividad",
      "No se requiere experiencia previa",
    ],
    quote: "Tu tiempo deja huellas de esperanza.",
    steps: [
      {
        icon: "pi-file-edit",
        text: "Completa el formulario de voluntariado.",
        title: "Inscríbete",
      },
      {
        icon: "pi-user",
        text: "Revisamos tu información y disponibilidad.",
        title: "Recibimos tus datos",
      },
      {
        icon: "pi-phone",
        text: "Nuestro equipo se comunica contigo para coordinar.",
        title: "Te contactamos",
      },
      {
        icon: "pi-users",
        text: "Vive la experiencia y transforma vidas con tu presencia.",
        title: "Participas en la actividad",
      },
    ],
    support: [
      "Actividades lúdicas y recreativas",
      "Acompañamiento a pacientes y familias",
      "Apoyo en jornadas y celebraciones",
      "Participación en campañas y encuentros institucionales",
    ],
    title: "Voluntariado Presencial",
    tone: "rose",
    valueCards: [
      {
        icon: "pi-heart",
        text: "Brindas compañía, escucha y apoyo emocional a quienes más lo necesitan.",
        title: "Acompañamiento humano",
      },
      {
        icon: "pi-sparkles",
        text: "Llevamos alegría, juego y aprendizaje que mejoran el día a día.",
        title: "Actividades recreativas",
      },
      {
        icon: "pi-users",
        text: "Tu presencia fortalece a los pacientes, cuidadores y sus familias.",
        title: "Impacto en familias",
      },
    ],
  },
  {
    accent: "#168f83",
    contactLabel: "Contacto",
    contactText: "310 342 3223",
    duration: "Medio día o jornada completa",
    eyebrow: "Empresas",
    frequency: "De común acuerdo",
    heroText:
      "Equipos empresariales que se vinculan a jornadas, campañas y donaciones para transformar vidas desde la responsabilidad social.",
    icon: "pi-briefcase",
    imageToken: "voluntariadoempresarial",
    intro:
      "El voluntariado empresarial permite que equipos de trabajo aporten tiempo, recursos y capacidades en acciones coordinadas con la fundación.",
    linkLabel: "Involucra tu empresa",
    location: "Empresa, fundación o punto acordado",
    path: "/como-ayudar/voluntariado-empresarial",
    profile: [
      "Empresas con interés social",
      "Equipos de talento humano o responsabilidad social",
      "Disposición para coordinar una jornada",
      "Compromiso con una experiencia respetuosa y organizada",
    ],
    quote: "Cuando una empresa se une, la solidaridad se vuelve cultura.",
    steps: [
      {
        icon: "pi-briefcase",
        text: "Nos cuentas el objetivo y el equipo que desea participar.",
        title: "Conectamos",
      },
      {
        icon: "pi-calendar-plus",
        text: "Definimos una jornada, campaña o aporte viable.",
        title: "Diseñamos la acción",
      },
      {
        icon: "pi-map-marker",
        text: "Acordamos logística, tiempos y recursos necesarios.",
        title: "Coordinamos",
      },
      {
        icon: "pi-heart-fill",
        text: "Tu empresa participa y recibe cierre de impacto.",
        title: "Transforman vidas",
      },
    ],
    support: [
      "Jornadas corporativas de voluntariado",
      "Campañas internas de recolección",
      "Donaciones y aportes en especie",
      "Alianzas para actividades institucionales",
    ],
    title: "Voluntariado Empresarial",
    tone: "teal",
    valueCards: [
      {
        icon: "pi-users",
        text: "Tu equipo vive una experiencia de servicio cercana y humana.",
        title: "Equipo con propósito",
      },
      {
        icon: "pi-gift",
        text: "Las campañas empresariales ayudan a cubrir necesidades concretas.",
        title: "Aportes útiles",
      },
      {
        icon: "pi-chart-line",
        text: "Cada acción puede documentarse para comunicar el impacto logrado.",
        title: "Impacto visible",
      },
    ],
  },
  {
    accent: "#8ba300",
    contactLabel: "Contacto",
    contactText: "310 342 3223",
    duration: "Entrega coordinada",
    eyebrow: "Donaciones",
    frequency: "Todo el año",
    heroText:
      "Recibimos mercados, juguetes, útiles escolares, artículos para el hogar y objetos de aseo para apoyar el bienestar diario de las familias.",
    icon: "pi-gift",
    imageToken: "aportedonacion",
    intro:
      "Los aportes en especie ayudan a responder necesidades cotidianas de niños, niñas y familias durante sus procesos de acompañamiento.",
    linkLabel: "Conoce qué donar",
    location: "Villavicencio, Meta",
    path: "/como-ayudar/aportes-en-especie",
    profile: [
      "Personas, familias, empresas o instituciones",
      "Elementos nuevos o en excelente estado",
      "Aportes acordes con las necesidades vigentes",
      "Entrega coordinada previamente con la fundación",
    ],
    quote: "Un aporte útil también abraza a una familia.",
    steps: [
      {
        icon: "pi-list",
        text: "Revisa los elementos que estamos recibiendo.",
        title: "Elige qué donar",
      },
      {
        icon: "pi-whatsapp",
        text: "Escríbenos para validar necesidades y cantidades.",
        title: "Contáctanos",
      },
      {
        icon: "pi-calendar",
        text: "Acordamos fecha, punto y condiciones de entrega.",
        title: "Coordinamos entrega",
      },
      {
        icon: "pi-heart",
        text: "Tu aporte llega a pacientes, cuidadores y familias.",
        title: "Entregamos apoyo",
      },
    ],
    support: [
      "Mercados y alimentos no perecederos",
      "Juguetes y útiles escolares",
      "Artículos para el hogar",
      "Objetos de aseo personal y familiar",
    ],
    title: "Aportes en especie",
    tone: "lime",
    valueCards: [
      {
        icon: "pi-shopping-bag",
        text: "Los mercados ayudan a aliviar cargas diarias de las familias.",
        title: "Alimentación",
      },
      {
        icon: "pi-gift",
        text: "Juguetes y útiles escolares sostienen momentos de alegría y aprendizaje.",
        title: "Bienestar infantil",
      },
      {
        icon: "pi-home",
        text: "Elementos de hogar y aseo fortalecen el cuidado cotidiano.",
        title: "Cuidado diario",
      },
    ],
  },
];

export const getPublicHelpWay = (key: PublicHelpWayKey) =>
  publicHelpWays.find((way) => way.path.endsWith(key)) ?? publicHelpWays[1];
