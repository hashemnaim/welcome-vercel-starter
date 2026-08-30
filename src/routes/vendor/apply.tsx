import { createFileRoute } from "@tanstack/react-router";
import VendorApplyV2 from "@/pages/VendorApplyV2";
import { pageHead, SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/vendor/apply")({
  head: () =>
    pageHead({
      title: "افتح متجرك — انضم كتاجر على شوب لانسر",
      description:
        "خطوات بسيطة لتسجيل متجرك على شوب لانسر: اختر الباقة، جهّز هويتك التجارية، وابدأ باستقبال الطلبات اليوم.",
      path: "/vendor/apply",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "افتح متجرك على شوب لانسر",
        description: "صفحة تسجيل التجار لإنشاء متجر إلكتروني على شوب لانسر.",
        url: `${SITE_URL}/vendor/apply`,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: {
          "@type": "Service",
          name: "إنشاء متجر إلكتروني للتجار",
          provider: { "@id": `${SITE_URL}/#organization` },
          areaServed: "EG",
        },
        inLanguage: "ar",
      },
    }),
  component: VendorApplyV2,
});
