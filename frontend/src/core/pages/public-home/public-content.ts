import { publicAssets } from "./cloudinary-assets";

export const publicPrograms = [
  {
    icon: "pi-heart",
    title: "Hogar de Paso Victoria",
    text: "",
  },
  {
    icon: "pi-book",
    title: "Educando Ángeles",
    text: "Restituye el derecho a la educación de niñas, niños y adolescentes durante ausencias escolares causadas por el tratamiento, incluyendo aulas hospitalarias.",
  },
  {
    icon: "pi-comments",
    title: "Apoyo psicosocial",
    text: "Herramientas de afrontamiento para pacientes, cuidadores y familias durante las etapas del diagnóstico y tratamiento.",
  },
  {
    icon: "pi-verified",
    title: "Apoyo jurídico",
    text: "Derechos de petición y tutelas para disminuir barreras invisibles y evitar tratamientos tardíos.",
  },
  {
    icon: "pi-sun",
    title: "Sueños de Arena",
    text: "Una experiencia de esperanza que lleva familias oncológicas a conocer el mar durante procesos prolongados de tratamiento.",
  },
  {
    icon: "pi-car",
    title: "Carrito de la felicidad",
    text: "Espacios de esparcimiento, humanización y apoyo psicosocial para cuidadores en entornos intrahospitalarios.",
  },
  {
    icon: "pi-refresh",
    title: "Programa de reciclaje",
    text: "Recolección de tapitas plásticas y material reciclable para apoyar necesidades básicas del tratamiento.",
  },
  {
    icon: "pi-briefcase",
    title: "Programa SePuede",
    text: "Fortalece emprendimientos de cuidadores para recuperar estabilidad laboral y sustento familiar.",
  },
];

export const publicHelpOptions = [
  {
    icon: "pi-briefcase",
    title: "Voluntariado Empresarial",
    text: "Equipos de empresas pueden vincularse con jornadas de acompañamiento, actividades recreativas, campañas internas y donaciones para niñas, niños y familias.",
    path: "/contacto",
    label: "Coordinar jornada",
    tone: "teal",
    items: ["Jornadas corporativas", "Campañas internas", "Apoyo logístico en eventos"],
  },
  {
    icon: "pi-users",
    title: "Voluntariado Presencial",
    text: "Personas que donan su tiempo para apoyar actividades lúdicas, educativas, recreativas y de bienestar con pacientes, cuidadores y familias.",
    path: "/voluntariado",
    label: "Ser voluntario",
    tone: "rose",
    items: ["Actividades con familias", "Acompañamiento en programas", "Apoyo en encuentros institucionales"],
  },
  {
    icon: "pi-book",
    title: "Labor Social",
    text: "Colegios, universidades y grupos estudiantiles pueden cumplir procesos de servicio social aportando tiempo, creatividad y apoyo organizado.",
    path: "/contacto",
    label: "Vincular institución",
    tone: "lime",
    items: ["Servicio social estudiantil", "Proyectos educativos", "Actividades solidarias"],
  },
  {
    icon: "pi-gift",
    title: "Aportes en especie",
    text: "Recibimos elementos útiles para el bienestar diario de las familias y para actividades de cuidado, aprendizaje y recreación.",
    path: "/contacto",
    label: "Coordinar entrega",
    tone: "teal",
    items: ["Mercados", "Juguetes", "Útiles escolares", "Artículos para el hogar", "Objetos de aseo"],
  },
];

export const publicNews = [
  {
    title: "Padrinos permanentes de aportes mensuales",
    tag: "Padrinos",
    image: publicAssets.sponsor,
  },
  {
    title: "Bono Donación y campañas solidarias",
    tag: "Campaña",
    image: publicAssets.toys,
  },
  {
    title: "Señales de alarma, actividades y encuentros",
    tag: "Eventos",
    image: publicAssets.bingo,
  },
];

export const publicFaqs = [
  {
    question: "¿Cómo puedo donar?",
    answer: "Cualquier persona puede donar. El flujo en línea se habilitará con registro de usuario y validación segura de pagos.",
  },
  {
    question: "¿Qué es un padrino permanente?",
    answer: "Es una persona natural, familia o empresa que decide apoyar mensualmente los programas de bienestar de la fundación.",
  },
  {
    question: "¿Puedo vincular mi empresa?",
    answer: "Sí. Las empresas pueden apoyar con donaciones, voluntariado corporativo, campañas, ecoaportes o puntos de recolección de tapas.",
  },
  {
    question: "¿Cómo se usan las donaciones?",
    answer: "Los aportes ayudan a sostener hospedaje, alimentación, educación, apoyo psicosocial, acompañamiento jurídico y actividades de bienestar.",
  },
];
