import { createFileRoute } from "@tanstack/react-router";
import Contact from "@/pages/Contact";
import { pageHead, SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/contact")({
  head: () =>
    pageHead({
      title: "تواصل معنا — شوب لانسر",
      description:
        "تواصل مع فريق شوب لانسر عبر الهاتف أو واتساب أو البريد الإلكتروني، أو أرسل طلب دعم مباشرة من الموقع.",
      path: "/contact",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        name: "تواصل معنا — شوب لانسر",
        description:
          "طرق التواصل مع فريق شوب لانسر للدعم الفني واستفسارات المتاجر والاشتراكات.",
        url: `${SITE_URL}/contact`,
        about: { "@id": `${SITE_URL}/#organization` },
        inLanguage: "ar",
      },
    }),
  component: Contact,
});
