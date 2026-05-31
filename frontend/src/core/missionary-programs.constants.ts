// ────────────────────────────────────────────────────────────────────────────
// Programas Misionales — constante estática para la vista pública (Home)
// Estos 8 programas son fijos para el año vigente y NO se consultan desde BD.
// ────────────────────────────────────────────────────────────────────────────

export interface MissionaryProgram {
    id: number;
    name: string;
    icon: string;
    piIcon: string;
    description: string;
}

export const MISSIONARY_PROGRAMS: readonly MissionaryProgram[] = [
    {
        id: 1,
        name: "Hogar de Paso Victoria",
        icon: "🏠",
        piIcon: "pi-home",
        description:
            "Alojamiento temporal y seguro para beneficiarios y sus familias durante el proceso de tratamiento, brindando un espacio digno fuera de su municipio de origen.",
    },
    {
        id: 2,
        name: "Educando Ángeles",
        icon: "📚",
        piIcon: "pi-book",
        description:
            "Acompañamiento educativo y refuerzo escolar para niños y adolescentes beneficiarios, garantizando la continuidad de su formación académica.",
    },
    {
        id: 3,
        name: "Apoyo psicosocial",
        icon: "🧠",
        piIcon: "pi-heart",
        description:
            "Atención psicológica y social integral para el beneficiario y su núcleo familiar, incluyendo terapias individuales y grupales.",
    },
    {
        id: 4,
        name: "Apoyo jurídico",
        icon: "⚖️",
        piIcon: "pi-shield",
        description:
            "Orientación y asistencia legal para las familias en trámites relacionados con el sistema de salud, derechos y protección del menor.",
    },
    {
        id: 5,
        name: "Sueños de Arena",
        icon: "🏖️",
        piIcon: "pi-sun",
        description:
            "Programa recreativo y de esparcimiento que ofrece experiencias lúdicas para los beneficiarios, fomentando su bienestar emocional.",
    },
    {
        id: 6,
        name: "Carrito de la felicidad",
        icon: "🛒",
        piIcon: "pi-shopping-cart",
        description:
            "Entrega periódica de kits de alimentos, productos de aseo e insumos básicos a las familias en situación de vulnerabilidad.",
    },
    {
        id: 7,
        name: "Programa de reciclaje",
        icon: "♻️",
        piIcon: "pi-replay",
        description:
            "Iniciativa de sostenibilidad ambiental que vincula a la comunidad en actividades de reciclaje y genera recursos para la fundación.",
    },
    {
        id: 8,
        name: "Programa SePuede",
        icon: "💪",
        piIcon: "pi-star",
        description:
            "Empoderamiento y emprendimiento dirigido a cuidadores y familias, promoviendo habilidades productivas para la autonomía económica.",
    },
] as const;
