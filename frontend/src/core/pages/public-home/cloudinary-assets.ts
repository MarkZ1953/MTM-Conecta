const optimize = (url: string, transform: string) =>
  url.replace("/image/upload/", `/image/upload/${transform}/`);

const cloudinaryImage = (publicId: string, transform: string) =>
  `https://res.cloudinary.com/djee0c2fs/image/upload/${transform}/${publicId}`;

const raw = {
  logo: "https://res.cloudinary.com/djee0c2fs/image/upload/v1779827430/Logo_fundacio%CC%81n_mtm_vkzbwq.png",
  heartLogo: "https://res.cloudinary.com/djee0c2fs/image/upload/v1779827263/Logo_corazo%CC%81n_bugzof.png",
  login: "https://res.cloudinary.com/djee0c2fs/image/upload/login_f9ucra",
  heroPrincipal: "https://res.cloudinary.com/djee0c2fs/image/upload/heroprincipal_y6uo4u",
  vinculate: "https://res.cloudinary.com/djee0c2fs/image/upload/VinculateFundacionMTM_i33q4n",
  aboutButton: "ConocerLaFundacionBoton_gaifk9",
  sponsorBackground: "https://res.cloudinary.com/djee0c2fs/image/upload/FondoP-1_b02iz4",
  sponsorCta: "https://res.cloudinary.com/djee0c2fs/image/upload/Ni%C3%B1aMTM_kiuwob",
  cancerTypes: "https://res.cloudinary.com/djee0c2fs/image/upload/tiposdecancer3_liwmor",
  hero: "https://res.cloudinary.com/djee0c2fs/image/upload/v1779826037/DSC01934_ghl4qy.jpg",
  heroAlt: "https://res.cloudinary.com/djee0c2fs/image/upload/v1779826030/DSC01916_tguppe.jpg",
  careOne: "https://res.cloudinary.com/djee0c2fs/image/upload/v1779826037/DSC01937_arqymg.jpg",
  careTwo: "https://res.cloudinary.com/djee0c2fs/image/upload/v1779826036/DSC01933_taeuqn.jpg",
  careThree: "https://res.cloudinary.com/djee0c2fs/image/upload/v1779826032/DSC01921_wvvyak.jpg",
  sponsor: "https://res.cloudinary.com/djee0c2fs/image/upload/v1779826777/fundacion_de_mujeres-03_dgawgs.jpg",
  donate: "https://res.cloudinary.com/djee0c2fs/image/upload/v1779826180/ayudanos-04_cx7j4w.jpg",
  toys: "https://res.cloudinary.com/djee0c2fs/image/upload/v1779826965/ROPA_Y_JUGUETES_POST_gogdag.jpg",
  bingo: "https://res.cloudinary.com/djee0c2fs/image/upload/v1779826937/BINGO_HISTORIA_qdczwi.jpg",
  childrenInfo: "https://res.cloudinary.com/djee0c2fs/image/upload/v1779826961/QUE_NIN%CC%83OS_POST_uycvyg.jpg",
  banner: "https://res.cloudinary.com/djee0c2fs/image/upload/v1779826335/portada_fb_MTM_nkgfsz.jpg",
  notFound: "404_ubfp3n",
};

const aboutGallery = [
  {
    publicId: "SobreNosotrosPrincipal_pnncn1",
    alt: "Presentación institucional de la Fundación MTM",
  },
  {
    publicId: "SobreNosotrosSegunda_hmu2nn",
    alt: "Sobre nosotros Fundación MTM",
  },
  {
    publicId: "SobreNosotrosTercera_fhahin",
    alt: "Acompañamiento integral de la Fundación MTM",
  },
  {
    publicId: "SobreNosotros4_pcq1tz",
    alt: "Programas y apoyo familiar de la Fundación MTM",
  },
  {
    publicId: "SobreNosotros5_i4jzmq",
    alt: "Impacto institucional de la Fundación MTM",
  },
];

const helpGallery = [
  {
    publicId: "Fondo_rvft9n",
    alt: "Fondo institucional de formas de ayudar MTM",
  },
  {
    publicId: "LaborSocial_twgjtq",
    alt: "Grupo de labor social apoyando a la Fundación MTM",
  },
  {
    publicId: "VoluntariadoPresencial_rxlezr",
    alt: "Voluntariado presencial en actividades de la Fundación MTM",
  },
  {
    publicId: "VoluntariadoEmpresarial_ycbbv7",
    alt: "Voluntariado empresarial aliado de la Fundación MTM",
  },
  {
    publicId: "AporteDonacion_pag7kj",
    alt: "Aportes en especie para familias de la Fundación MTM",
  },
];

const eventsGallery = [
  {
    publicId: "Evento1_yiykfd",
    alt: "Jornada solidaria de la Fundación MTM",
  },
  {
    publicId: "Evento2_w1vqcy",
    alt: "Bazar con causa de la Fundación MTM",
  },
  {
    publicId: "Evento3_te0vru",
    alt: "Encuentro de familias de la Fundación MTM",
  },
];

export const publicAssets = {
  logo: optimize(raw.logo, "f_auto,q_auto,w_240"),
  logoCompact:
    "https://res.cloudinary.com/djee0c2fs/image/upload/f_auto,q_auto,e_trim,w_360/v1779827430/Logo_fundacio%CC%81n_mtm_vkzbwq.png",
  logoHero: optimize(raw.heartLogo, "f_auto,q_auto,w_220"),
  logoFullHero:
    "https://res.cloudinary.com/djee0c2fs/image/upload/f_auto,q_auto,c_crop,g_auto,w_760,h_330/v1779827254/Logo_FmTMt_inhuni.png",
  heartLogo: optimize(raw.heartLogo, "f_auto,q_auto,w_180"),
  login: optimize(raw.login, "f_auto,q_auto,w_1800"),
  heroPrincipal: optimize(raw.heroPrincipal, "f_auto,q_auto,w_1800"),
  vinculate: optimize(raw.vinculate, "f_auto,q_auto,w_1600"),
  aboutButtonNormal: cloudinaryImage(raw.aboutButton, "c_crop,x_285,y_175,w_1205,h_230/f_auto,q_auto,w_760"),
  aboutButtonHover: cloudinaryImage(raw.aboutButton, "c_crop,x_205,y_485,w_1365,h_250/f_auto,q_auto,w_860"),
  sponsorBackground: optimize(raw.sponsorBackground, "f_auto,q_auto,w_1800"),
  sponsorCta: optimize(raw.sponsorCta, "f_auto,q_auto,w_420"),
  cancerTypes: optimize(raw.cancerTypes, "f_auto,q_auto,w_1800"),
  hero: optimize(raw.hero, "f_auto,q_auto,w_1800"),
  heroAlt: optimize(raw.heroAlt, "f_auto,q_auto,w_1200"),
  careOne: optimize(raw.careOne, "f_auto,q_auto,w_800"),
  careTwo: optimize(raw.careTwo, "f_auto,q_auto,w_800"),
  careThree: optimize(raw.careThree, "f_auto,q_auto,w_800"),
  sponsor: optimize(raw.sponsor, "f_auto,q_auto,w_900"),
  donate: optimize(raw.donate, "f_auto,q_auto,w_900"),
  toys: optimize(raw.toys, "f_auto,q_auto,w_700"),
  bingo: optimize(raw.bingo, "f_auto,q_auto,w_700"),
  childrenInfo: optimize(raw.childrenInfo, "f_auto,q_auto,w_700"),
  banner: optimize(raw.banner, "f_auto,q_auto,w_1400"),
  notFound: cloudinaryImage(raw.notFound, "f_auto,q_auto,w_1800"),
};

export const publicAboutGallerySlides = aboutGallery.map((slide) => ({
  ...slide,
  src: cloudinaryImage(slide.publicId, "f_auto,q_auto,w_1800"),
}));

export const publicHelpGallerySlides = helpGallery.map((slide) => ({
  ...slide,
  src: cloudinaryImage(slide.publicId, "f_auto,q_auto,w_1600"),
}));

export const publicEventsGallerySlides = eventsGallery.map((slide) => ({
  ...slide,
  src: cloudinaryImage(slide.publicId, "f_auto,q_auto,w_1600"),
}));
