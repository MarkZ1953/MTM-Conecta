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
    title: "Bono Donación",
    text: "Aporte único para apoyar los programas de atención y acompañamiento a niñas, niños, adolescentes y sus familias.",
    path: "/donar",
    label: "Vincúlate",
    tone: "rose",
  },
  {
    title: "Padrino permanente",
    text: "Realiza aportes mensuales y recibe información de actividades, eventos e impacto de la fundación.",
    path: "/padrino-permanente",
    label: "Haz parte ya",
    tone: "teal",
  },
  {
    title: "Ecoaporte",
    text: "Aporte anual o campaña institucional para vincular empresas y aliados a iniciativas de sostenibilidad y apoyo social.",
    path: "/contacto",
    label: "Quiero participar",
    tone: "lime",
  },
  {
    title: "Recolección de tapas",
    text: "Las empresas pueden registrar un punto de recolección para coordinar la entrega o recogida de tapas.",
    path: "/contacto",
    label: "Registrar punto",
    tone: "teal",
  },
  {
    title: "Voluntariado",
    text: "Dona tu tiempo y talento para transformar servicio en esperanza y felicidad.",
    path: "/voluntariado",
    label: "Ser voluntario",
    tone: "lime",
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
