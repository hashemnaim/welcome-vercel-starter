import { useState, useEffect, useMemo } from "react";
import { Link } from "@/lib/router-compat";
import { useLanguage } from "@/i18n/LanguageContext";
import { THEMES } from "@/data/themes";
import { ArrowLeft, MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  fetchModules,
  fetchStoresByModule,
  fetchZones,
  getStoreName,
  getStoreAddress,
  type ApiStore,
} from "@/lib/shoplanserApi";

export const StoresGrid = () => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const navy = "hsl(var(--brand-navy))";

  const [stores, setStores] = useState<ApiStore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);

    const loadAll = async () => {
      try {
        const [mods, zones] = await Promise.all([
          fetchModules(),
          fetchZones().catch(() => []),
        ]);

        if (!alive) return;

        const zoneIds = zones
          .map((z) => z.id)
          .filter((n) => typeof n === "number");
        const activeZones = zoneIds.length > 0 ? zoneIds : [1];

        // Fetch stores for each module concurrently
        const fetchPromises = mods.map((m) =>
          fetchStoresByModule(m.id, { zoneId: activeZones }).catch(
            () => [] as ApiStore[],
          ),
        );

        const results = await Promise.all(fetchPromises);
        if (!alive) return;

        // Deduplicate stores by ID
        const map = new Map<number, ApiStore>();
        results.forEach((list) => list.forEach((s) => map.set(s.id, s)));
        const allStores = Array.from(map.values());

        setStores(allStores);
      } catch (err) {
        console.error("Failed to fetch stores for grid:", err);
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    };

    loadAll();

    return () => {
      alive = false;
    };
  }, []);

  const displayStores = useMemo(() => {
    if (stores.length > 0) {
      return stores.slice(0, 6);
    }
    // Fallback to static themes mapped to ApiStore shape
    return THEMES.slice(0, 4).map((t) => ({
      id:
        parseInt(t.id.replace(/\D/g, "")) || Math.floor(Math.random() * 100000),
      name: t.name,
      slug: t.url, // store theme URL in slug for fallback link check
      address: isAr ? t.description.ar : t.description.en,
      cover_photo_full_url: t.image,
      translations: [
        { locale: "ar", key: "name", value: t.name },
        { locale: "ar", key: "address", value: t.description.ar },
      ],
    })) as ApiStore[];
  }, [stores, isAr]);

  return (
    <section
      className="bg-background py-10 md:py-16"
      dir={isAr ? "rtl" : "ltr"}
    >
      <div className="container-page">
        {/* Header */}
        <div className="flex flex-col items-stretch gap-4 md:flex-row md:items-start md:justify-between md:gap-6">
          <div className={`${isAr ? "font-arabic text-right" : "text-left"}`}>
            <h2
              className="text-3xl font-extrabold sm:text-4xl md:text-5xl"
              style={{ color: navy }}
            >
              {isAr ? "تعرّف على متاجرنا" : "Meet our stores"}
            </h2>
            <p className="mt-3 max-w-xl text-sm text-muted-foreground md:text-base">
              {isAr
                ? "تصفّح المتاجر النشطة على شوب لانسر، فلتر حسب القسم وابحث عن متجرك المفضل."
                : "Browse active stores on Shoplanser, filter by category and find your favorite."}
            </p>
          </div>
          <Link
            to="/marketplace"
            className={`inline-flex shrink-0 self-end items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:opacity-90 md:self-auto ${isAr ? "font-arabic" : ""}`}
            style={{ backgroundColor: navy }}
          >
            {isAr ? "عرض المزيد" : "View more"}
            <ArrowLeft className={`h-4 w-4 ${isAr ? "" : "rotate-180"}`} />
          </Link>
        </div>

        {/* Cards row */}
        {loading ? (
          <div
            className="mt-12 flex gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            dir={isAr ? "rtl" : "ltr"}
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="group relative flex w-[280px] shrink-0 flex-col overflow-hidden rounded-3xl p-3 border border-border shadow-card bg-white"
              >
                <Skeleton className="relative aspect-[4/3] overflow-hidden rounded-2xl w-full h-[180px]" />
                <div
                  className={`flex flex-1 flex-col p-3 ${isAr ? "text-right" : "text-left"}`}
                >
                  <Skeleton className="h-5 w-3/4 mb-2 mt-2" />
                  <Skeleton className="h-3.5 w-1/2 mb-4" />
                  <div
                    className={`mt-4 flex ${isAr ? "justify-start" : "justify-end"}`}
                  >
                    <Skeleton className="h-8 w-24 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            className="mt-12 flex gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            dir={isAr ? "rtl" : "ltr"}
          >
            {displayStores.map((s, i) => {
              const highlighted = i === 1;
              const name = getStoreName(s, isAr);
              const address = getStoreAddress(s, isAr);
              const url = s.slug.startsWith("http")
                ? s.slug
                : `https://store.shoplanser.com/${s.slug}`;
              const image = s.logo_full_url || s.cover_photo_full_url;

              return (
                <a
                  key={s.id}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className={`group relative flex w-[280px] shrink-0 flex-col overflow-hidden rounded-3xl p-3 transition-all hover:-translate-y-1 ${
                    highlighted
                      ? "shadow-elevated"
                      : "border border-border shadow-card"
                  }`}
                  style={{
                    backgroundColor: highlighted ? navy : "white",
                  }}
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
                    {image ? (
                      <img
                        src={image}
                        alt={name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div
                        className="flex h-full w-full items-center justify-center px-4 text-center text-xl font-black leading-tight text-white sm:text-2xl"
                        style={{ backgroundColor: s.website_color || navy }}
                      >
                        <span className="line-clamp-3 break-words">{name}</span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div
                    className={`flex flex-1 flex-col p-3 ${isAr ? "font-arabic text-right" : "text-left"}`}
                  >
                    <h3
                      className={`text-lg font-extrabold ${highlighted ? "text-white" : "text-foreground"}`}
                    >
                      {name}
                    </h3>
                    {address && (
                      <p
                        className={`mt-1 flex items-center gap-1 text-[11px] ${
                          highlighted
                            ? "text-white/70"
                            : "text-muted-foreground"
                        } ${isAr ? "flex-row-reverse justify-end" : ""}`}
                      >
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span className="line-clamp-1">{address}</span>
                      </p>
                    )}

                    <div
                      className={`mt-4 flex ${isAr ? "justify-start" : "justify-end"}`}
                    >
                      <span
                        className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold text-white transition-colors"
                        style={{
                          backgroundColor: highlighted ? "white" : navy,
                          color: highlighted ? navy : "white",
                        }}
                      >
                        <ArrowLeft
                          className={`h-3.5 w-3.5 ${isAr ? "" : "rotate-180"}`}
                        />
                        {isAr ? "زيارة المتجر" : "Visit store"}
                      </span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
