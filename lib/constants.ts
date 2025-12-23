export const ARTICLE_PER_PAGE = 12;

export const PRODUCTION_DOMAIN = "https://cloud-hosting-cyan.vercel.app";
export const DEVELOPMENT_DOMAIN = "http://localhost:3000";
export const DEVELOPMENT_DOMAIN_PHONE = "http://172.20.10.2:3000";

// Better detection
export const DOMAIN =
  process.env.NODE_ENV === "production"
    ? PRODUCTION_DOMAIN
    : typeof window !== "undefined" &&
      !window.location.hostname.includes("localhost")
    ? `http://${window.location.hostname}:3000`
    : DEVELOPMENT_DOMAIN;
