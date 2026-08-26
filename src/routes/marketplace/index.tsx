import { createFileRoute } from "@tanstack/react-router";
import Marketplace from "@/pages/Marketplace";
import { pageHead, SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/marketplace/")({
  head: () =>
    pageHead({
      title: "متاجرنا — تصفّح المتاجر على شوب لانسر",
      description:
        "تصفّح متاجر شوب لانسر: بقالات، صيدليات، مخابز، مطاعم وأزياء. اطلب أونلاين من متجرك المحلي المفضل.",
      path: "/marketplace",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "متاجرنا",
        description:
          "تصفح المتاجر المحلية النشطة على شوب لانسر حسب القسم والمدينة.",
        url: `${SITE_URL}/marketplace`,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        inLanguage: "ar",
      },
    }),
  component: Marketplace,
});
