import { useEffect, useMemo, useState } from "react";
import { Link } from "@/lib/router-compat";

import { useLanguage } from "@/i18n/LanguageContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import {
  Search,
  Mic,
  MicOff,
  MapPin,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  fetchModules,
  fetchStoresByModule,
  fetchZones,
  getStoreName,
  getStoreAddress,
  type ApiModule,
  type ApiStore,
} from "@/lib/shoplanserApi";

const NAVY = "hsl(var(--brand-navy))";

const moduleLabel = (m: ApiModule) => m.module_name || m.name || `#${m.id}`;

const Marketplace = () => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";

  const [modules, setModules] = useState<ApiModule[]>([]);
  const [modulesLoading, setModulesLoading] = useState(true);
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null); // null = all
  const [zoneIds, setZoneIds] = useState<number[]>([1]);

  // stores per module — cached so we can show counts and switch instantly
  const [storesByModule, setStoresByModule] = useState<
    Record<number, ApiStore[]>
  >({});
  const [loadingModuleIds, setLoadingModuleIds] = useState<Set<number>>(
    new Set(),
  );

  const [query, setQuery] = useState("");

  const { listening, supported, toggle } = useSpeechRecognition({
    lang: isAr ? "ar-SA" : "en-US",
    onResult: (text) => setQuery(text),
  });

  // Load modules + zones once
  useEffect(() => {
    let alive = true;
    setModulesLoading(true);
    Promise.all([fetchModules(), fetchZones().catch(() => [])])
      .then(([mods, zones]) => {
        if (!alive) return;
        setModules(mods);
        const ids = (zones as { id: number }[])
          .map((z) => z.id)
          .filter((n) => typeof n === "number");
        if (ids.length > 0) setZoneIds(ids);
      })
      .catch(() => alive && setModules([]))
      .finally(() => alive && setModulesLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  // Fetch stores for every module once modules are loaded (so we can show counts + "all")
  useEffect(() => {
    if (modules.length === 0) return;
    let alive = true;
    setLoadingModuleIds(new Set(modules.map((m) => m.id)));
    modules.forEach((m) => {
      fetchStoresByModule(m.id, { zoneId: zoneIds })
        .then((list) => {
          if (!alive) return;
          setStoresByModule((prev) => ({ ...prev, [m.id]: list }));
        })
        .catch(() => {
          if (!alive) return;
          setStoresByModule((prev) => ({ ...prev, [m.id]: [] }));
        })
        .finally(() => {
          if (!alive) return;
          setLoadingModuleIds((prev) => {
            const next = new Set(prev);
            next.delete(m.id);
            return next;
          });
        });
    });
    return () => {
      alive = false;
    };
  }, [modules, zoneIds]);

  const allStores = useMemo<ApiStore[]>(() => {
    const map = new Map<number, ApiStore>();
    Object.values(storesByModule).forEach((list) =>
      list.forEach((s) => map.set(s.id, s)),
    );
    return Array.from(map.values());
  }, [storesByModule]);

  const activeStores: ApiStore[] = useMemo(
    () =>
      selectedModuleId == null
        ? allStores
        : (storesByModule[selectedModuleId] ?? []),
    [allStores, selectedModuleId, storesByModule],
  );

  const isLoading =
    selectedModuleId == null
      ? modulesLoading || loadingModuleIds.size > 0
      : loadingModuleIds.has(selectedModuleId);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return activeStores;
    return activeStores.filter((s) => {
      const n = getStoreName(s, isAr).toLowerCase();
      const a = getStoreAddress(s, isAr).toLowerCase();
      return n.includes(q) || a.includes(q);
    });
  }, [activeStores, query, isAr]);

  const pageTitle = isAr ? "متاجرنا" : "Our stores";
  const pageDesc = isAr
    ? "تصفّح المتاجر النشطة على شوب لانسر، فلتر حسب القسم وابحث عن متجرك المفضل."
    : "Browse active stores on Shoplanser. Filter by category and find your favorite shop.";

  return (
    <div
      className="min-h-screen bg-background pt-16"
      dir={isAr ? "rtl" : "ltr"}
    >
      <Header />

      <main>
        {/* Content */}
        <section className="bg-background py-12">
          <div className="container-page">
            <div
              className={`mx-auto max-w-2xl text-center ${isAr ? "font-arabic" : ""}`}
            >
              <h1
                className="text-3xl font-extrabold sm:text-4xl"
                style={{ color: NAVY }}
              >
                {pageTitle}
              </h1>
              <p className="mt-3 text-sm text-muted-foreground md:text-base">
                {pageDesc}
              </p>
            </div>

            {/* Filter + search row */}
            <div
              className={`mt-8 flex flex-col-reverse items-stretch gap-4 lg:items-center lg:justify-between ${isAr ? "lg:flex-row-reverse" : "lg:flex-row"}`}
            >
              {/* Search */}
              <div
                className={`flex items-center gap-2 ${isAr ? "flex-row-reverse" : ""}`}
              >
                <div className="flex flex-1 items-center gap-2 rounded-full border border-border bg-card px-4 py-2 shadow-sm lg:w-80">
                  <Search className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={isAr ? "ابحث عن متجر…" : "Search stores…"}
                    aria-label={isAr ? "بحث" : "Search"}
                    className={`h-8 flex-1 border-0 bg-transparent p-0 focus-visible:ring-0 ${isAr ? "text-right font-arabic" : ""}`}
                  />
                </div>
                <button
                  type="button"
                  onClick={toggle}
                  disabled={!supported}
                  aria-pressed={listening}
                  aria-label={isAr ? "بحث صوتي" : "Voice search"}
                  className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full transition-colors ${
                    listening
                      ? "mic-pulse bg-destructive text-destructive-foreground"
                      : "border border-border bg-card text-foreground hover:bg-muted"
                  }`}
                >
                  {listening ? (
                    <MicOff className="h-4 w-4" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </button>
                <button
                  type="button"
                  className={`inline-flex h-11 items-center justify-center rounded-full px-6 text-sm font-bold text-white shadow-lg transition hover:opacity-90 ${isAr ? "font-arabic" : ""}`}
                  style={{ backgroundColor: NAVY }}
                  onClick={() => {
                    /* search is live */
                  }}
                >
                  {isAr ? "بحث" : "Search"}
                </button>
              </div>

              {/* Module chips */}
              <div
                className={`flex flex-wrap items-center gap-2 ${isAr ? "lg:justify-start font-arabic" : "lg:justify-end"}`}
              >
                <FilterChip
                  active={selectedModuleId == null}
                  onClick={() => setSelectedModuleId(null)}
                  label={isAr ? "كل المتاجر" : "All stores"}
                />
                {modulesLoading
                  ? Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} className="h-10 w-24 rounded-full" />
                    ))
                  : modules.map((m) => (
                      <FilterChip
                        key={m.id}
                        active={selectedModuleId === m.id}
                        onClick={() => setSelectedModuleId(m.id)}
                        label={moduleLabel(m)}
                        count={storesByModule[m.id]?.length ?? 0}
                      />
                    ))}
              </div>
            </div>

            {/* Results grid */}
            <div className="mt-10">
              {isLoading && visible.length === 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="overflow-hidden rounded-3xl border border-border bg-card p-3 shadow-card"
                    >
                      <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
                      <div className="space-y-2 p-3">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : visible.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-border bg-card p-10 text-center">
                  <p
                    className={`text-base font-semibold text-foreground ${isAr ? "font-arabic" : ""}`}
                  >
                    {isAr ? "لا توجد متاجر مطابقة" : "No matching stores"}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {isAr
                      ? "جرب قسماً آخر أو بحثاً مختلفاً."
                      : "Try another category or a different search."}
                  </p>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {visible.map((s) => (
                    <StoreCard key={s.id} store={s} isAr={isAr} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

const FilterChip = ({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count?: number;
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={`inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-bold transition-colors ${
      active
        ? "text-white shadow-md"
        : "border border-border bg-card text-foreground hover:bg-muted"
    }`}
    style={active ? { backgroundColor: NAVY } : undefined}
  >
    <span>{label}</span>
    {typeof count === "number" && (
      <span
        className={`inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-[11px] font-bold ${
          active ? "bg-white/15 text-white" : "bg-muted text-muted-foreground"
        }`}
      >
        {count}
      </span>
    )}
  </button>
);

const StoreCard = ({ store, isAr }: { store: ApiStore; isAr: boolean }) => {
  const name = getStoreName(store, isAr);
  const address = getStoreAddress(store, isAr);
  const image = store.logo_full_url || store.cover_photo_full_url;

  return (
    <a
      href={`https://store.shoplanser.com/${store.slug}`}
      target="_blank"
      rel="noreferrer"
      className={`group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card p-3 shadow-card transition-all hover:-translate-y-1 hover:border-transparent hover:shadow-elevated hover:text-white ${
        isAr ? "font-arabic text-right" : "text-left"
      }`}
      style={{ ["--hover-navy" as never]: NAVY }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = NAVY)}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "")}
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
            style={{ backgroundColor: store.website_color || NAVY }}
          >
            <span className="line-clamp-3 break-words">{name}</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-3">
        <h3 className="text-lg font-extrabold text-foreground group-hover:text-white">
          {name}
        </h3>

        {address && (
          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground group-hover:text-white/70">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="line-clamp-1">{address}</span>
          </p>
        )}

        <div className={`mt-4 flex ${isAr ? "justify-start" : "justify-end"}`}>
          <span
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold text-white transition-colors group-hover:bg-white group-hover:text-[color:hsl(var(--brand-navy))]"
            style={{ backgroundColor: NAVY }}
          >
            <ArrowLeft className={`h-3.5 w-3.5 ${isAr ? "" : "rotate-180"}`} />
            {isAr ? "زيارة المتجر" : "Visit store"}
          </span>
        </div>
      </div>
    </a>
  );
};

export default Marketplace;
