import { createFileRoute } from "@tanstack/react-router";
import Marketplace from "@/pages/Marketplace";
import { pageHead, SITE_URL } from "@/lib/seo";

const CATEGORY_LABELS: Record<string, string> = {
  grocery: "بقالات",
  pharmacy: "صيدليات",
  bakery: "مخابز",
  fashion: "أزياء",
  electronics: "إلكترونيات",
  restaurants: "مطاعم",
  supermarket: "سوبر ماركت",
  beauty: "تجميل وعناية",
  cafe: "كافيهات",
  flowers: "ورود وهدايا",
};

export const Route = createFileRoute("/marketplace/$category")({
  head: ({ params }) => {
    const label = CATEGORY_LABELS[params.category] ?? params.category;
    const known = params.category in CATEGORY_LABELS;
    return pageHead({
      title: `${label} — متاجر شوب لانسر`,
      description: `تصفّح متاجر ${label} على شوب لانسر واطلب أونلاين من أقرب متجر محلي إليك.`,
      path: `/marketplace/${params.category}`,
      robots: known ? "index, follow" : "noindex, follow",
      jsonLd: known
        ? {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: `${label} — متاجر شوب لانسر`,
            description: `تصفح متاجر ${label} على شوب لانسر.`,
            url: `${SITE_URL}/marketplace/${params.category}`,
            inLanguage: "ar",
          }
        : undefined,
    });
  },
  component: Marketplace,
});
