import { createFileRoute } from "@tanstack/react-router";
import StorePage from "@/pages/StorePage";
import { getStoreBySlug } from "@/data/stores";
import { absoluteUrl, pageHead, SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/store/$slug")({
  head: ({ params }) => {
    const store = getStoreBySlug(params.slug);
    if (!store) {
      return pageHead({
        title: "المتجر غير موجود — شوب لانسر",
        description: "لم نتمكن من العثور على هذا المتجر على شوب لانسر.",
        path: `/store/${params.slug}`,
      });
    }
    const name = store.name.ar;
    const description = `${store.tagline.ar} — ${store.products}+ منتج في ${store.city.ar}. اطلب الآن من ${name} على شوب لانسر.`;
    return pageHead({
      title: `${name} — شوب لانسر`,
      description,
      path: `/store/${store.slug}`,
      image: store.avatar ? absoluteUrl(store.avatar) : undefined,
      imageAlt: `${name} على شوب لانسر`,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "Store",
        name,
        description: store.tagline.ar,
        url: `${SITE_URL}/store/${store.slug}`,
        image: store.avatar ? absoluteUrl(store.avatar) : undefined,
        address: { "@type": "PostalAddress", addressLocality: store.city.ar },
        parentOrganization: { "@id": `${SITE_URL}/#organization` },
      },
    });
  },
  component: StorePage,
});
