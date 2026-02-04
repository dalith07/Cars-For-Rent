export type Language = "en" | "fr" | "ar";

export const translations = {
  en: {
    // navbar
    "navbar.logo": "Cars For Rent",
    "navbar.home": "Home",
    "navbar.marketCars": "Market Cars",
    "navbar.service": "Service",
    "navbar.yourOrders": "Your Orders",
    "navbar.languageLabel": "Language:",
    "navbar.socialMediaLabel": "Social Media:",

    // hero section
    "hero.title": "Rent Your Dream Car Today",
    "hero.subtitle":
      "Find the perfect car for your journey. Fast, easy, and reliable.",
    "hero.exploreCars": "Explore Cars",
    "hero.rentCar": "Rent a Car",

    // footer section
    "footer.brandDescription":
      "Streamline your repair process with AI-powered estimates and effortless collaboration between drivers and garages.",
    "footer.quickLinksTitle": "Quick Links",
    "footer.quickLinksHome": "Home",
    "footer.quickLinksAbout": "About",
    "footer.quickLinksServices": "Services",
    "footer.quickLinksContact": "Contact",
    "footer.resourcesTitle": "Resources",
    "footer.resourcesFaq": "FAQ",
    "footer.resourcesBlog": "Blog",
    "footer.resourcesSupport": "Support",
    "footer.resourcesPrivacy": "Privacy Policy",
    "footer.followUsTitle": "Follow Us",
    "footer.copyright": "All rights reserved.",

    // features / cars-for-rent section
    "features.title": "Rent",
    "features.titleHighlighted": "Your Dream Car",
    "features.subtitle":
      "Choose your car, see how long you can rent it, and enjoy exclusive features.",
    "features.maxRentalLabel": "Max Rental:",
    "features.featuresLabel": "Features:",
    "features.priceLabel": "Price:",

    // auth shared labels
    "auth.emailLabel": "Email:",
    "auth.emailPlaceholder": "john.doe@example.com",
    "auth.passwordLabel": "Password:",
    "auth.passwordPlaceholder": "********",
    "auth.nameLabel": "Name:",
    "auth.namePlaceholder": "John Doe",

    // auth login
    "auth.login.header": "Welcome Back",
    "auth.login.backButtonLabel": "Don't have an account?",
    "auth.login.oauthError": "Email already in use with different provider!",
    "auth.login.submit": "Login",

    // auth register
    "auth.register.header": "Creaet an account",
    "auth.register.backButtonLabel": "Already have an account?",
    "auth.register.submit": "Create an account",

    // auth error page
    "auth.error.title": "Oops! Something went wrong!",
    "auth.error.backToLogin": "Back to login",

    // service page
    "service.title": "Our Services",
    "service.subtitle":
      "Experience hassle-free car rentals with premium services designed for comfort, flexibility, and peace of mind.",
    "service.card.wideSelection.title": "Wide Car Selection",
    "service.card.wideSelection.description":
      "Choose from a variety of vehicles to suit your style, budget, and trip needs.",
    "service.card.flexibleRentals.title": "Flexible Rentals",
    "service.card.flexibleRentals.description":
      "Rent by hour, day, or week. Our rental plans adapt to your schedule.",
    "service.card.fullMaintenance.title": "Full Maintenance",
    "service.card.fullMaintenance.description":
      "All our cars are fully serviced and maintained for your safety and comfort.",
    "service.card.customerSupport.title": "Customer Support",
    "service.card.customerSupport.description":
      "Our support team is ready 24/7 to help you with any questions or emergencies.",
  },

  // You can fill these later
  fr: {},
  ar: {},
} as const;
