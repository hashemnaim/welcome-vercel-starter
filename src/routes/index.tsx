import { createFileRoute } from "@tanstack/react-router";
import Index from "@/pages/Index";
import { DEFAULT_IMAGE, pageHead, SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () =>
    pageHead({
      title: "شوب لانسر — أطلق متجرك الإلكتروني في دقيقة",
      description:
        "شوب لانسر يساعد التجار المحليين على إطلاق متجر إلكتروني احترافي في دقيقة — بدون برمجة، بدون رسوم تأسيس، وابدأ مجانًا.",
      path: "/",
      image: DEFAULT_IMAGE,
      imageAlt: "شوب لانسر — منصة إنشاء المتاجر الإلكترونية",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "شوب لانسر",
        description:
          "منصة تساعد التجار المحليين على إطلاق متجر إلكتروني احترافي بسرعة.",
        url: SITE_URL,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${SITE_URL}/#organization` },
        inLanguage: "ar",
      },
    }),
  component: Index,
});
