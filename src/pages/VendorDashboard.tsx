import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useNavigate, Link } from "@/lib/router-compat";
import { useLanguage } from "@/i18n/LanguageContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { fetchVendorProfile } from "@/lib/shoplanserApi";
import { vendorSignOut } from "@/lib/vendorAuth";
import {
  Store,
  Link as LinkIcon,
  Palette,
  Tag,
  Crown,
  ExternalLink,
  Smartphone,
  LayoutDashboard,
  CheckCircle2,
  Copy,
  LogOut,
  ShoppingBag,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const VENDOR_DASHBOARD_URL = "https://dashboard.shoplanser.com/login";
const VENDOR_APP_URL =
  "https://play.google.com/store/apps/details?id=com.zahed.shoplanser";

interface StoreRow {
  id: string;
  slug: string;
  store_name: string;
  store_url: string | null;
  color: string | null;
  module_name: string | null;
  category_names: string[];
  plan_name: string | null;
  plan_price: string | null;
  owner_name: string | null;
  owner_email: string | null;
  owner_phone: string | null;
  created_at: string;
  total_items?: number;
}

interface ApiVendorStore {
  id: number | string;
  slug: string;
  name: string;
  website_color?: string | null;
  module?: { module_name?: string | null } | null;
  store_business_model?: string | null;
  delivery_price?: string | number | null;
  created_at?: string | null;
  total_items?: number | null;
}

const VendorDashboard = () => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const tx = useCallback((en: string, ar: string) => (isAr ? ar : en), [isAr]);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [stores, setStores] = useState<StoreRow[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const token = localStorage.getItem("shoplanser_vendor_token");
      if (!token) {
        navigate("/vendor/login", {
          replace: true,
          state: { from: "/vendor/dashboard" },
        });
        return;
      }

      try {
        const profile = await fetchVendorProfile(token);
        if (cancelled) return;

        const rawStores = (profile.stores || []) as ApiVendorStore[];
        const normalized: StoreRow[] = rawStores.map((s) => ({
          id: String(s.id),
          slug: s.slug,
          store_name: s.name,
          store_url: `https://store.shoplanser.com/${s.slug}`,
          color: s.website_color ?? null,
          module_name: s.module?.module_name || null,
          category_names: [],
          plan_name:
            s.store_business_model === "commission"
              ? tx("Commission", "بالعمولة")
              : tx("Subscription", "اشتراك"),
          plan_price: s.delivery_price ? `${s.delivery_price} EGP` : null,
          owner_name:
            `${profile.f_name || ""} ${profile.l_name || ""}`.trim() || null,
          owner_email: profile.email || null,
          owner_phone: profile.phone || null,
          created_at: s.created_at || "",
          total_items: s.total_items ?? 0,
        }));

        setStores(normalized);
        setSelectedId(normalized[0]?.id ?? null);
        setLoading(false);
      } catch (err) {
        console.error("load vendor_stores from profile failed:", err);
        navigate("/vendor/login", { replace: true });
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [navigate, tx]);

  const selected = useMemo(
    () => stores.find((s) => s.id === selectedId) ?? null,
    [stores, selectedId],
  );

  const handleLogout = async () => {
    await vendorSignOut();
    toast({ title: tx("Signed out", "تم تسجيل الخروج") });
    navigate("/vendor/login", { replace: true });
  };

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast({ title: tx("Link copied", "تم نسخ الرابط") });
    } catch {
      /* noop */
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (stores.length === 0) {
    return (
      <div
        dir={isAr ? "rtl" : "ltr"}
        className="flex min-h-screen flex-col items-center justify-center bg-background gap-4 p-6"
      >
        <p className="text-center text-muted-foreground">
          {tx(
            "No stores yet for this account.",
            "لا توجد متاجر مسجلة لهذا الحساب بعد.",
          )}
        </p>
        <div className="flex gap-2">
          <Button asChild>
            <Link to="/vendor/apply">
              {tx("Create your first store", "أنشئ متجرك الأول")}
            </Link>
          </Button>
          <Button variant="outline" onClick={handleLogout}>
            {tx("Sign out", "تسجيل الخروج")}
          </Button>
        </div>
      </div>
    );
  }

  const accent = selected?.color ?? "#4f46e5";
  const storeUrl =
    selected?.store_url ??
    `https://store.shoplanser.com/${selected?.slug ?? ""}`;

  return (
    <div
      dir={isAr ? "rtl" : "ltr"}
      className={`flex min-h-screen flex-col bg-gradient-to-b from-background via-muted/30 to-background pt-16 ${
        isAr ? "text-right" : "text-left"
      }`}
    >
      <Header />

      <main className="flex-1 pt-28 pb-16">
        <div className="container-page space-y-6">
          {/* Top bar: store switcher + actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4 shadow-card">
            <div
              className={`flex flex-wrap items-center gap-2 ${isAr ? "flex-row-reverse" : ""}`}
            >
              <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                {tx("Your stores", "متاجرك")}
              </span>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
                {stores.length}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleLogout}
                className="gap-1.5"
              >
                <LogOut className="h-4 w-4" />
                {tx("Sign out", "تسجيل الخروج")}
              </Button>
            </div>
          </div>

          {/* Store cards (selector) */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {stores.map((s) => {
              const active = s.id === selectedId;
              const color = s.color ?? "#4f46e5";
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedId(s.id)}
                  className={`group relative overflow-hidden rounded-2xl border bg-card p-4 text-start transition-all hover:shadow-elevated ${
                    active
                      ? "border-primary ring-2 ring-primary/30"
                      : "border-border"
                  } ${isAr ? "text-right" : "text-left"}`}
                >
                  <div
                    className={`flex items-center gap-3 ${isAr ? "flex-row-reverse" : ""}`}
                  >
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg font-extrabold text-white"
                      style={{ backgroundColor: color }}
                    >
                      {s.store_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-bold text-foreground">
                        {s.store_name}
                      </div>
                      <div
                        className="truncate text-[11px] text-muted-foreground"
                        dir="ltr"
                      >
                        /{s.slug}
                      </div>
                    </div>
                    {active && (
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                    )}
                  </div>
                  <div
                    className={`mt-3 flex flex-wrap gap-1.5 ${isAr ? "justify-end" : ""}`}
                  >
                    {s.module_name && (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                        {s.module_name}
                      </span>
                    )}
                    {s.plan_name && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                        {s.plan_name}
                      </span>
                    )}
                    {typeof s.total_items === "number" && (
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
                        {s.total_items} {tx("products", "منتج")}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {selected && (
            <>
              {/* Hero */}
              <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-elevated">
                <div className="px-6 py-6 sm:px-8 sm:py-8">
                  <div className="flex flex-wrap items-center gap-4">
                    <div
                      className="flex h-20 w-20 items-center justify-center rounded-2xl text-3xl font-extrabold text-white shadow-elevated"
                      style={{ backgroundColor: accent }}
                    >
                      {selected.store_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-600">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {tx("Store live", "المتجر مفعّل")}
                      </div>
                      <h1 className="mt-2 truncate text-2xl font-extrabold tracking-tight sm:text-3xl">
                        {selected.store_name}
                      </h1>
                      <a
                        href={storeUrl}
                        target="_blank"
                        rel="noreferrer"
                        dir="ltr"
                        className="mt-1 inline-flex max-w-full items-center gap-1 truncate text-sm font-semibold text-primary hover:underline"
                      >
                        <LinkIcon className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{storeUrl}</span>
                      </a>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyUrl(storeUrl)}
                        className="gap-1.5"
                      >
                        <Copy className="h-4 w-4" />
                        {tx("Copy link", "نسخ الرابط")}
                      </Button>
                      <Button asChild size="sm" className="gap-1.5">
                        <a href={storeUrl} target="_blank" rel="noreferrer">
                          <ExternalLink className="h-4 w-4" />
                          {tx("Visit store", "زيارة المتجر")}
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-3">
                <div className="rounded-2xl border border-border bg-card p-6 shadow-card lg:col-span-2">
                  <div
                    className={`flex items-center gap-2 ${isAr ? "flex-row-reverse" : ""}`}
                  >
                    <Store className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-bold">
                      {tx("Store information", "بيانات المتجر")}
                    </h2>
                  </div>

                  <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                    <InfoRow
                      icon={Store}
                      label={tx("Store name", "اسم المتجر")}
                      value={selected.store_name}
                      isAr={isAr}
                    />
                    <InfoRow
                      icon={LinkIcon}
                      label={tx("Store URL", "رابط المتجر")}
                      value={
                        <a
                          href={storeUrl}
                          target="_blank"
                          rel="noreferrer"
                          dir="ltr"
                          className="break-all text-primary hover:underline"
                        >
                          {storeUrl}
                        </a>
                      }
                      isAr={isAr}
                    />
                    <InfoRow
                      icon={Palette}
                      label={tx("Store color", "لون المتجر")}
                      value={
                        <span
                          className={`flex items-center gap-2 ${isAr ? "flex-row-reverse" : ""}`}
                        >
                          <span
                            className="h-5 w-5 rounded-md ring-1 ring-border"
                            style={{ backgroundColor: accent }}
                          />
                          <span dir="ltr" className="font-mono text-xs">
                            {accent}
                          </span>
                        </span>
                      }
                      isAr={isAr}
                    />
                    <InfoRow
                      icon={Tag}
                      label={tx("Module", "نوع النشاط")}
                      value={selected.module_name || "—"}
                      isAr={isAr}
                    />
                    <InfoRow
                      icon={Tag}
                      label={tx("Categories", "الأصناف")}
                      value={
                        selected.category_names.length > 0 ? (
                          <span className="flex flex-wrap gap-1.5">
                            {selected.category_names.map((c) => (
                              <span
                                key={c}
                                className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary"
                              >
                                {c}
                              </span>
                            ))}
                          </span>
                        ) : (
                          "—"
                        )
                      }
                      isAr={isAr}
                    />
                    <InfoRow
                      icon={Crown}
                      label={tx("Plan", "الباقة")}
                      value={
                        <span
                          className={`flex flex-wrap items-baseline gap-1.5 ${isAr ? "flex-row-reverse" : ""}`}
                        >
                          <span className="font-bold">
                            {selected.plan_name || "—"}
                          </span>
                          {selected.plan_price && (
                            <span className="text-xs text-muted-foreground">
                              · {selected.plan_price}
                            </span>
                          )}
                        </span>
                      }
                      isAr={isAr}
                    />
                    <InfoRow
                      icon={ShoppingBag}
                      label={tx("Total products", "إجمالي المنتجات")}
                      value={selected.total_items ?? 0}
                      isAr={isAr}
                    />
                  </dl>
                </div>

                <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
                  <div
                    className={`flex items-center gap-2 ${isAr ? "flex-row-reverse" : ""}`}
                  >
                    <LayoutDashboard className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-bold">
                      {tx("Quick links", "روابط سريعة")}
                    </h2>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {tx(
                      "Use these tools to manage your store and stock.",
                      "استخدم هذه الأدوات لإدارة متجرك ومنتجاتك.",
                    )}
                  </p>

                  <div className="mt-5 space-y-3">
                    <QuickLink
                      href={VENDOR_DASHBOARD_URL}
                      icon={LayoutDashboard}
                      title={tx("Vendor dashboard", "لوحة تحكم البائع")}
                      desc={tx(
                        "Manage products, orders, and settings.",
                        "إدارة المنتجات والطلبات والإعدادات.",
                      )}
                      isAr={isAr}
                    />
                    <QuickLink
                      href={VENDOR_APP_URL}
                      icon={Smartphone}
                      title={tx("Vendor mobile app", "تطبيق البائع للجوال")}
                      desc={tx(
                        "Manage your store on the go from Google Play.",
                        "أدر متجرك من تطبيق الجوال على متجر Google Play.",
                      )}
                      isAr={isAr}
                    />
                    <Link
                      to="/"
                      className={`flex items-center gap-3 rounded-xl border border-dashed border-border bg-muted/30 p-3 text-sm font-semibold text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary ${
                        isAr ? "flex-row-reverse text-right" : ""
                      }`}
                    >
                      <ExternalLink className="h-4 w-4" />
                      {tx("Back to homepage", "العودة للرئيسية")}
                    </Link>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

const InfoRow = ({
  icon: Icon,
  label,
  value,
  isAr,
}: {
  icon: typeof Store;
  label: string;
  value: ReactNode;
  isAr: boolean;
}) => (
  <div className="rounded-xl border border-border bg-muted/20 p-3">
    <div
      className={`flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground ${isAr ? "flex-row-reverse" : ""}`}
    >
      <Icon className="h-3.5 w-3.5" />
      <span>{label}</span>
    </div>
    <div className="mt-1.5 text-sm font-medium text-foreground">{value}</div>
  </div>
);

const QuickLink = ({
  href,
  icon: Icon,
  title,
  desc,
  isAr,
}: {
  href: string;
  icon: typeof Store;
  title: string;
  desc: string;
  isAr: boolean;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className={`group flex items-start gap-3 rounded-xl border border-border bg-card p-3 transition-all hover:border-primary/40 hover:shadow-card ${
      isAr ? "flex-row-reverse text-right" : ""
    }`}
  >
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
      <Icon className="h-5 w-5" />
    </div>
    <div className="min-w-0 flex-1">
      <div className="flex items-center gap-1 text-sm font-bold text-foreground">
        <span className="truncate">{title}</span>
        <ExternalLink className="h-3 w-3 text-muted-foreground" />
      </div>
      <div className="mt-0.5 text-xs text-muted-foreground">{desc}</div>
    </div>
  </a>
);

export default VendorDashboard;
