const optimize = (url: string, transform: string) =>
  url.replace("/image/upload/", `/image/upload/${transform}/`);

const raw = {
  logo: "https://res.cloudinary.com/djee0c2fs/image/upload/v1779827430/Logo_fundacio%CC%81n_mtm_vkzbwq.png",
  heartLogo: "https://res.cloudinary.com/djee0c2fs/image/upload/v1779827263/Logo_corazo%CC%81n_bugzof.png",
  login: "https://res.cloudinary.com/djee0c2fs/image/upload/login_f9ucra",
  heroPrincipal: "https://res.cloudinary.com/djee0c2fs/image/upload/heroprincipal_y6uo4u",
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
};

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
};
