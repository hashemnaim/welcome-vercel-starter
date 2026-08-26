import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "@/lib/router-compat";
import QRCode from "qrcode";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Check,
  Copy,
  Download,
  ExternalLink,
  Smartphone,
  Store,
  Truck,
  UserCheck,
} from "lucide-react";

interface SuccessState {
  slug: string;
  storeName: string;
  ownerEmail?: string;
  apiResult?: { id?: number; message?: string };
}

const MARKET_STORE_BASE = "https://store.shoplanser.com";
const VENDOR_ANDROID_URL =
  "https://play.google.com/store/apps/details?id=com.zahed.shoplanser";
const VENDOR_IOS_URL =
  "https://apps.apple.com/app/shoplanser-vendor/id0000000000";
const DELIVERY_ANDROID_URL =
  "https://play.google.com/store/apps/details?id=com.zahed.delivery";
const DELIVERY_IOS_URL =
  "https://apps.apple.com/app/shoplanser-delivery/id0000000001";

const tx = (lang: "en" | "ar", en: string, ar: string) =>
  lang === "ar" ? ar : en;

const VendorSuccess = () => {
  const { lang, dir } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const state = (location.state ?? null) as SuccessState | null;

  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const downloadRef = useRef<HTMLAnchorElement>(null);

  // Public storefront lives on the marketplace domain, NOT on this app.
  const storefrontUrl = useMemo(() => {
    if (!state?.slug) return "";
    return `${MARKET_STORE_BASE}/${state.slug}`;
  }, [state?.slug]);

  useEffect(() => {
    if (!state?.slug) {
      navigate("/vendor/apply", { replace: true });
    }
  }, [state, navigate]);

  useEffect(() => {
    if (!storefrontUrl) return;
    QRCode.toDataURL(storefrontUrl, {
      margin: 1,
      width: 480,
      color: { dark: "#0f172a", light: "#ffffff" },
    })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(""));
  }, [storefrontUrl]);

  if (!state?.slug) return null;

  const copy = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast({ title: tx(lang, "Copied", "تم النسخ"), description: label });
    } catch {
      toast({
        title: tx(lang, "Copy failed", "تعذّر النسخ"),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background via-muted/30 to-background pt-16">
      <Header />
      <main className="flex-1 pt-28 pb-16">
        <div className="container-page">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-primary">
              <Check className="h-7 w-7" />
            </div>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
              {tx(lang, "Your store is live 🎉", "متجرك أصبح متاحاً 🎉")}
            </h1>
            <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
              {tx(
                lang,
                `“${state.storeName}” has been registered. Scan the QR or share the link.`,
                `تم تسجيل "${state.storeName}". شارك رابط المتجر أو اطبع الـ QR.`,
              )}
            </p>
            {state.apiResult?.message && (
              <p className="mx-auto mt-2 max-w-xl text-xs text-muted-foreground">
                {state.apiResult.message}
              </p>
            )}
          </div>

          <div className="mx-auto mt-10 grid max-w-5xl gap-6 lg:grid-cols-[360px_1fr]">
            {/* QR Card */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-elevated">
              <div className="text-sm font-bold text-foreground">
                {tx(lang, "Storefront QR code", "رمز QR للمتجر")}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {tx(
                  lang,
                  "Print or share. Scanning opens your shop.",
                  "اطبعه أو شاركه — يفتح متجرك مباشرة عند المسح.",
                )}
              </p>
              <div className="mt-4 flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border border-border bg-white p-3">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="storefront QR"
                    className="h-full w-full object-contain"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className="text-xs text-muted-foreground">
                    {tx(lang, "Generating…", "جارٍ التوليد…")}
                  </div>
                )}
              </div>
              <div className="mt-4 flex gap-2">
                <a
                  ref={downloadRef}
                  href={qrDataUrl || "#"}
                  download={`${state.slug}-qr.png`}
                  className="flex-1"
                >
                  <Button
                    type="button"
                    className="w-full gap-2"
                    disabled={!qrDataUrl}
                  >
                    <Download className="h-4 w-4" />
                    {tx(lang, "Download", "تنزيل")}
                  </Button>
                </a>
                <Button
                  type="button"
                  variant="outline"
                  className="gap-2"
                  onClick={() => copy(storefrontUrl, storefrontUrl)}
                >
                  <Copy className="h-4 w-4" />
                  {tx(lang, "Copy link", "نسخ")}
                </Button>
              </div>
            </div>

            {/* Links + actions */}
            <div className="space-y-4">
              {/* Account created banner */}
              <div className="rounded-3xl border border-primary/30 bg-primary/5 p-5">
                <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <UserCheck className="h-5 w-5 text-primary" />
                  {tx(lang, "Your account is ready", "تم إنشاء حسابك")}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {tx(
                    lang,
                    "Use the same credentials to sign in to the vendor app and the delivery app.",
                    "استخدم نفس بيانات الدخول لتسجيل الدخول إلى تطبيق التاجر وتطبيق التوصيل.",
                  )}
                </p>
                {state.ownerEmail && (
                  <p className="mt-2 text-[11px] font-medium text-primary">
                    {state.ownerEmail}
                  </p>
                )}
              </div>

              <LinkCard
                icon={<Store className="h-5 w-5" />}
                title={tx(lang, "Your store is ready", "متجرك جاهز")}
                description={storefrontUrl}
                primaryLabel={tx(lang, "Open store", "افتح المتجر")}
                onPrimary={() =>
                  window.open(storefrontUrl, "_blank", "noopener")
                }
                onCopy={() => copy(storefrontUrl, storefrontUrl)}
              />

              <AppCard
                icon={<Smartphone className="h-5 w-5 text-primary" />}
                title={tx(lang, "Vendor mobile app", "تطبيق التاجر")}
                description={tx(
                  lang,
                  "Manage your store and orders on the go. Sign in with the same credentials.",
                  "أدِر متجرك وطلباتك من جوالك. سجّل الدخول بنفس البيانات.",
                )}
                androidUrl={VENDOR_ANDROID_URL}
                iosUrl={VENDOR_IOS_URL}
              />

              <AppCard
                icon={<Truck className="h-5 w-5 text-primary" />}
                title={tx(lang, "Delivery app", "تطبيق التوصيل")}
                description={tx(
                  lang,
                  "For your delivery drivers — accept and complete delivery tasks.",
                  "لمندوبي التوصيل لديك — لقبول مهام التوصيل وإنجازها.",
                )}
                androidUrl={DELIVERY_ANDROID_URL}
                iosUrl={DELIVERY_IOS_URL}
              />
            </div>
          </div>

          <div className="mx-auto mt-10 max-w-3xl text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft
                className={`h-3.5 w-3.5 ${dir === "rtl" ? "rotate-180" : ""}`}
              />
              {tx(lang, "Back to home", "العودة للرئيسية")}
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const LinkCard = ({
  icon,
  title,
  description,
  primaryLabel,
  onPrimary,
  onCopy,
  hint,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  primaryLabel: string;
  onPrimary: () => void;
  onCopy: () => void;
  hint?: string;
}) => (
  <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
    <div className="flex items-center gap-2 text-sm font-bold text-foreground">
      <span className="text-primary">{icon}</span>
      {title}
    </div>
    <p
      className="mt-1 truncate text-xs text-muted-foreground"
      title={description}
    >
      {description}
    </p>
    {hint && <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>}
    <div className="mt-4 flex gap-2">
      <Button type="button" className="flex-1 gap-2" onClick={onPrimary}>
        <ExternalLink className="h-4 w-4" />
        {primaryLabel}
      </Button>
      <Button
        type="button"
        variant="outline"
        className="gap-2"
        onClick={onCopy}
      >
        <Copy className="h-4 w-4" />
      </Button>
    </div>
  </div>
);

const AppCard = ({
  icon,
  title,
  description,
  androidUrl,
  iosUrl,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  androidUrl: string;
  iosUrl: string;
}) => (
  <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
    <div className="flex items-center gap-2 text-sm font-bold text-foreground">
      {icon}
      {title}
    </div>
    <p className="mt-1 text-xs text-muted-foreground">{description}</p>
    <div className="mt-4 flex flex-wrap gap-2">
      <a
        href={androidUrl}
        target="_blank"
        rel="noopener"
        className="flex-1 min-w-[160px]"
      >
        <Button type="button" variant="outline" className="w-full gap-2">
          <ExternalLink className="h-4 w-4" />
          Google Play
        </Button>
      </a>
      <a
        href={iosUrl}
        target="_blank"
        rel="noopener"
        className="flex-1 min-w-[160px]"
      >
        <Button type="button" variant="outline" className="w-full gap-2">
          <ExternalLink className="h-4 w-4" />
          App Store
        </Button>
      </a>
    </div>
  </div>
);

export default VendorSuccess;
