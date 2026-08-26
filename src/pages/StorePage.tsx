import { Link, useParams } from "@/lib/router-compat";
import { useLanguage } from "@/i18n/LanguageContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, ArrowLeft } from "lucide-react";
import { getStoreBySlug } from "@/data/stores";
import { VerifiedBadge } from "@/components/VerifiedBadge";

const StorePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const store = slug ? getStoreBySlug(slug) : undefined;

  if (!store) {
    return (
      <div className="flex min-h-screen flex-col bg-background pt-16">
        <Header />
        <main className="flex flex-1 items-center justify-center p-6 text-center">
          <div>
            <h1 className="text-2xl font-bold">
              {isAr ? "المتجر غير موجود" : "Store not found"}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {isAr
                ? "لم نتمكن من العثور على هذا المتجر."
                : "We couldn't find this store."}
            </p>
            <Button asChild className="mt-6">
              <Link to="/marketplace">
                {isAr ? "تصفح المتاجر" : "Browse stores"}
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const Icon = store.icon;
  const storeName = store.name[lang];
  const storeDesc = `${store.tagline[lang]} — ${store.products}+ ${isAr ? "منتج في" : "products in"} ${store.city[lang]}. ${isAr ? "اطلب الآن من" : "Order now from"} ${storeName} ${isAr ? "على شوب لانسر." : "on SHOPLANCER."}`;
  const storeJsonLd = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: storeName,
    description: store.tagline[lang],
    url: `https://shoplanser.com/store/${store.slug}`,
    address: { "@type": "PostalAddress", addressLocality: store.city[lang] },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: store.rating,
      bestRating: 5,
      ratingCount: store.products,
    },
  };

  return (
    <div className="flex min-h-screen flex-col bg-background pt-16">
      <Header />
      <main className="flex-1">
        <section className="border-b bg-muted/30">
          <div className="container mx-auto px-4 py-8">
            <Link
              to="/marketplace"
              className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
              {isAr ? "العودة للمتاجر" : "Back to marketplace"}
            </Link>
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border bg-background">
                {store.avatar ? (
                  <img
                    src={store.avatar}
                    alt={store.name[lang]}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <Icon className="h-10 w-10 text-primary" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold sm:text-3xl">
                    {store.name[lang]}
                  </h1>
                  <VerifiedBadge />
                </div>
                <p className="mt-1 text-muted-foreground">
                  {store.tagline[lang]}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    {store.rating}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {store.city[lang]}
                  </span>
                  <Badge variant="secondary">
                    {store.products} {isAr ? "منتج" : "products"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-8">
          <h2 className="mb-4 text-xl font-semibold">
            {isAr ? "المنتجات" : "Products"}
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {store.catalog.map((p) => (
              <div
                key={p.id}
                className="rounded-xl border bg-card p-4 transition hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="truncate font-medium">{p.name[lang]}</h3>
                    <p className="text-xs text-muted-foreground">
                      {p.unit[lang]}
                    </p>
                  </div>
                  {p.tag && (
                    <Badge
                      variant={p.tag === "offer" ? "destructive" : "default"}
                      className="shrink-0"
                    >
                      {p.tag === "offer"
                        ? isAr
                          ? "عرض"
                          : "Offer"
                        : isAr
                          ? "جديد"
                          : "New"}
                    </Badge>
                  )}
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-lg font-bold text-primary">
                    {p.price} {isAr ? "ج.م" : "EGP"}
                  </span>
                  {p.oldPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      {p.oldPrice}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default StorePage;
