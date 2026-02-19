export type Language = "en" | "fr" | "ar";

export const translations = {
  en: {
    // navbar
    navbarLogo: "Cars For Rent",
    navbarHome: "Home",
    navbarMarketCars: "Market Cars",
    navbarService: "Service",
    navbarYourOrders: "Your Orders",
    navbarLanguageLabel: "Language:",
    navbarSocialMediaLabel: "Social Media:",

    // Auth Toggle
    authToggleTitleCreateCompte: "Create Account :",
    authToggleButtonLogin: "Login",
    authToggleButtonRegister: "Register",

    // hero
    heroTitle: "Rent Your Dream Car",
    heroTitleHighlighted: "Today",
    heroSubtitle:
      "Find the perfect car for your journey. Fast, easy, and reliable.",
    heroExploreCars: "Explore Cars",
    heroRentCar: "Rent a Car",

    // footer
    footerBrandDescription:
      "Streamline your rental process with ease and flexibility.",
    footerQuickLinksTitle: "Quick Links",
    footerQuickLinksHome: "Home",
    footerQuickLinksAbout: "About",
    footerQuickLinksServices: "Services",
    footerQuickLinksContact: "Contact",
    footerResourcesTitle: "Resources",
    footerResourcesFaq: "FAQ",
    footerResourcesBlog: "Blog",
    footerResourcesSupport: "Support",
    footerResourcesPrivacy: "Privacy Policy",
    footerFollowUsTitle: "Follow Us",
    footerCopyright: "All rights reserved.",

    // features
    featuresTitle: "Rent",
    featuresTitleHighlighted: "Your Dream Car",
    featuresSubtitle:
      "Choose your car, select duration, and enjoy premium features.",
    featuresMaxRentalLabel: "Max Rental:",
    featuresFeaturesLabel: "Features:",
    featuresPriceLabel: "Price:",

    // Popular
    popularTitle: "New Cars Available",
    popularTitleHighlighted: "For Rent",

    // auth
    authEmailLabel: "Email:",
    authEmailPlaceholder: "john.doe@example.com",
    authPasswordLabel: "Password:",
    authPasswordPlaceholder: "********",
    authNameLabel: "Name:",
    authNamePlaceholder: "John Doe",

    authLoginHeader: "Welcome Back",
    authLoginBackButtonLabel: "Don't have an account?",
    authLoginOauthError: "Email already in use with different provider!",
    authLoginSubmit: "Login",

    authRegisterHeader: "Create an account",
    authRegisterBackButtonLabel: "Already have an account?",
    authRegisterSubmit: "Create an account",

    authErrorTitle: "Oops! Something went wrong!",
    authErrorBackToLogin: "Back to login",

    // service
    serviceTitle: "Our Services",
    serviceSubtitle:
      "Enjoy premium car rental services designed for comfort and flexibility.",
    serviceCardWideSelectionTitle: "Wide Car Selection",
    serviceCardWideSelectionDescription:
      "Choose from a variety of vehicles for every need and budget.",
    serviceCardFlexibleRentalsTitle: "Flexible Rentals",
    serviceCardFlexibleRentalsDescription:
      "Rent by hour, day, or week according to your schedule.",
    serviceCardFullMaintenanceTitle: "Full Maintenance",
    serviceCardFullMaintenanceDescription:
      "All vehicles are fully serviced and maintained.",
    serviceCardCustomerSupportTitle: "Customer Support",
    serviceCardCustomerSupportDescription:
      "24/7 support for any questions or assistance.",
  },

  fr: {
    navbarLogo: "Location de Voitures",
    navbarHome: "Accueil",
    navbarMarketCars: "Voitures",
    navbarService: "Services",
    navbarYourOrders: "Vos Réservations",
    navbarLanguageLabel: "Langue :",
    navbarSocialMediaLabel: "Réseaux sociaux :",

    // Auth Toggle
    authToggleTitleCreateCompte: "Créer un compte :",
    authToggleButtonLogin: "Se connecter",
    authToggleButtonRegister: "S’inscrire",

    heroTitle: "Louez la Voiture de Vos Rêves",
    heroTitleHighlighted: "Aujourd'hui",
    heroSubtitle:
      "Trouvez la voiture parfaite pour votre voyage. Rapide, simple et fiable.",
    heroExploreCars: "Explorer les voitures",
    heroRentCar: "Louer une voiture",

    footerBrandDescription:
      "Simplifiez votre location de voiture avec flexibilité et confort.",
    footerQuickLinksTitle: "Liens rapides",
    footerQuickLinksHome: "Accueil",
    footerQuickLinksAbout: "À propos",
    footerQuickLinksServices: "Services",
    footerQuickLinksContact: "Contact",
    footerResourcesTitle: "Ressources",
    footerResourcesFaq: "FAQ",
    footerResourcesBlog: "Blog",
    footerResourcesSupport: "Support",
    footerResourcesPrivacy: "Politique de confidentialité",
    footerFollowUsTitle: "Suivez-nous",
    footerCopyright: "Tous droits réservés.",

    featuresTitle: "Louez",
    featuresTitleHighlighted: "Votre Voiture de Rêve",
    featuresSubtitle:
      "Choisissez votre voiture, la durée et profitez des meilleures options.",
    featuresMaxRentalLabel: "Location max :",
    featuresFeaturesLabel: "Options :",
    featuresPriceLabel: "Prix :",

    // Popular
    popularTitle: "Nouvelles voitures disponibles",
    popularTitleHighlighted: "à louer",

    authEmailLabel: "Email :",
    authEmailPlaceholder: "john.doe@example.com",
    authPasswordLabel: "Mot de passe :",
    authPasswordPlaceholder: "********",
    authNameLabel: "Nom :",
    authNamePlaceholder: "Jean Dupont",

    authLoginHeader: "Bon retour",
    authLoginBackButtonLabel: "Pas de compte ?",
    authLoginOauthError: "Email déjà utilisé avec un autre fournisseur !",
    authLoginSubmit: "Connexion",

    authRegisterHeader: "Créer un compte",
    authRegisterBackButtonLabel: "Vous avez déjà un compte ?",
    authRegisterSubmit: "Créer un compte",

    authErrorTitle: "Oups ! Une erreur est survenue !",
    authErrorBackToLogin: "Retour à la connexion",

    serviceTitle: "Nos Services",
    serviceSubtitle:
      "Profitez de services de location premium pour votre confort.",
    serviceCardWideSelectionTitle: "Large choix de voitures",
    serviceCardWideSelectionDescription:
      "Une variété de véhicules pour tous les besoins et budgets.",
    serviceCardFlexibleRentalsTitle: "Locations flexibles",
    serviceCardFlexibleRentalsDescription:
      "Louez à l'heure, au jour ou à la semaine.",
    serviceCardFullMaintenanceTitle: "Entretien complet",
    serviceCardFullMaintenanceDescription:
      "Tous les véhicules sont entièrement entretenus.",
    serviceCardCustomerSupportTitle: "Support client",
    serviceCardCustomerSupportDescription:
      "Assistance 24/7 pour toute question.",
  },

  ar: {
    navbarLogo: "تأجير السيارات",
    navbarHome: "الرئيسية",
    navbarMarketCars: "السيارات",
    navbarService: "الخدمات",
    navbarYourOrders: "حجوزاتي",
    navbarLanguageLabel: "اللغة:",
    navbarSocialMediaLabel: "وسائل التواصل:",

    // Auth Toggle
    authToggleTitleCreateCompte: "إنشاء حساب:",
    authToggleButtonLogin: "تسجيل الدخول",
    authToggleButtonRegister: "إنشاء حساب",

    heroTitle: "استأجر سيارة أحلامك",
    heroTitleHighlighted: "اليوم",
    heroSubtitle: "اعثر على السيارة المثالية لرحلتك بسهولة وسرعة.",
    heroExploreCars: "استكشف السيارات",
    heroRentCar: "استأجر سيارة",

    footerBrandDescription: "استمتع بخدمات تأجير سيارات مريحة ومرنة.",
    footerQuickLinksTitle: "روابط سريعة",
    footerQuickLinksHome: "الرئيسية",
    footerQuickLinksAbout: "من نحن",
    footerQuickLinksServices: "الخدمات",
    footerQuickLinksContact: "اتصل بنا",
    footerResourcesTitle: "الموارد",
    footerResourcesFaq: "الأسئلة الشائعة",
    footerResourcesBlog: "المدونة",
    footerResourcesSupport: "الدعم",
    footerResourcesPrivacy: "سياسة الخصوصية",
    footerFollowUsTitle: "تابعنا",
    footerCopyright: "جميع الحقوق محفوظة.",

    featuresTitle: "استأجر",
    featuresTitleHighlighted: "سيارة أحلامك",
    featuresSubtitle: "اختر سيارتك وحدد المدة واستمتع بالمزايا.",
    featuresMaxRentalLabel: "أقصى مدة:",
    featuresFeaturesLabel: "المزايا:",
    featuresPriceLabel: "السعر:",

    // Popular
    popularTitle: "سيارات جديدة متاحة",
    popularTitleHighlighted: "للإيجار",

    authEmailLabel: "البريد الإلكتروني:",
    authEmailPlaceholder: "example@mail.com",
    authPasswordLabel: "كلمة المرور:",
    authPasswordPlaceholder: "********",
    authNameLabel: "الاسم:",
    authNamePlaceholder: "محمد علي",

    authLoginHeader: "مرحباً بعودتك",
    authLoginBackButtonLabel: "ليس لديك حساب؟",
    authLoginOauthError: "البريد مستخدم مع مزود آخر!",
    authLoginSubmit: "تسجيل الدخول",

    authRegisterHeader: "إنشاء حساب",
    authRegisterBackButtonLabel: "لديك حساب بالفعل؟",
    authRegisterSubmit: "إنشاء حساب",

    authErrorTitle: "حدث خطأ ما!",
    authErrorBackToLogin: "العودة لتسجيل الدخول",

    serviceTitle: "خدماتنا",
    serviceSubtitle: "استمتع بخدمات تأجير سيارات مميزة لراحتك.",
    serviceCardWideSelectionTitle: "تشكيلة واسعة",
    serviceCardWideSelectionDescription: "مجموعة سيارات تناسب جميع الاحتياجات.",
    serviceCardFlexibleRentalsTitle: "إيجار مرن",
    serviceCardFlexibleRentalsDescription: "إيجار بالساعة أو اليوم أو الأسبوع.",
    serviceCardFullMaintenanceTitle: "صيانة كاملة",
    serviceCardFullMaintenanceDescription: "جميع السيارات بحالة ممتازة.",
    serviceCardCustomerSupportTitle: "دعم العملاء",
    serviceCardCustomerSupportDescription: "دعم متواصل 24/7.",
  },
} as const;
