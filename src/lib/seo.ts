export const SITE_URL = "https://shoplanser.com";
export const SITE_NAME = "شوب لانسر";
export const SITE_NAME_EN = "Shoplanser";
export const DEFAULT_TITLE = "شوب لانسر — أطلق متجرك الإلكتروني في دقيقة";
export const DEFAULT_DESCRIPTION =
  "شوب لانسر يساعد التجار المحليين على إطلاق متجر إلكتروني احترافي في دقيقة، بدون برمجة أو رسوم تأسيس.";
export const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;
export const LOGO_URL = `${SITE_URL}/logo.png`;
export const GOOGLE_ANALYTICS_ID = (
  import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined
)?.trim();
export const GOOGLE_TAG_MANAGER_ID = (
  import.meta.env.VITE_GTM_CONTAINER_ID as string | undefined
)?.trim();
export const GOOGLE_SITE_VERIFICATION =
  (
    import.meta.env.VITE_GOOGLE_SITE_VERIFICATION as string | undefined
  )?.trim() || "iA58eTWAl0bG3Rtk94uokNkoZWhWrQ7Tmyq1rvQUPqk";

export interface PageHeadOptions {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  /** Absolute or root-relative URL of a meaningful page image. */
  image?: string;
  imageAlt?: string;
  robots?: string;
  jsonLd?: unknown;
}

export const absoluteUrl = (url: string) => {
  if (/^https?:\/\//i.test(url)) return url;
  return `${SITE_URL}${url.startsWith("/") ? url : `/${url}`}`;
};

export const organizationJsonLd = {
  "@type": "OnlineStore",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  alternateName: [SITE_NAME_EN, "SHOPLANCER"],
  url: SITE_URL,
  logo: LOGO_URL,
  image: DEFAULT_IMAGE,
  description: DEFAULT_DESCRIPTION,
  telephone: "+201036850264",
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+201036850264",
    contactType: "customer support",
    areaServed: "EG",
    availableLanguage: ["ar", "en"],
  },
};

export const websiteJsonLd = {
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: SITE_NAME,
  alternateName: [SITE_NAME_EN, "SHOPLANCER"],
  url: SITE_URL,
  inLanguage: ["ar", "en"],
  publisher: { "@id": `${SITE_URL}/#organization` },
};

/**
 * Builds the SSR head config for a leaf route.
 * Used inside `createFileRoute(...)({ head: () => pageHead({...}) })`.
 */
export function pageHead({
  title,
  description,
  path,
  type = "website",
  image = DEFAULT_IMAGE,
  imageAlt = SITE_NAME,
  robots = "index, follow",
  jsonLd,
}: PageHeadOptions) {
  const url = `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const resolvedImage = absoluteUrl(image);

  const meta: Array<Record<string, string>> = [
    { title },
    { name: "description", content: description },
    { name: "robots", content: robots },
    { property: "og:type", content: type },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:url", content: url },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: resolvedImage },
    { property: "og:image:alt", content: imageAlt },
    { property: "og:locale", content: "ar_AR" },
    { property: "og:locale:alternate", content: "en_US" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: resolvedImage },
    { name: "twitter:image:alt", content: imageAlt },
  ];

  void jsonLd;

  return {
    meta,
    links: [{ rel: "canonical", href: url }],
  };
}
