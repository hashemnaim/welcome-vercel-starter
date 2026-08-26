import { useLanguage } from "@/i18n/LanguageContext";
import { useNavigate } from "@/lib/router-compat";
import { Check, ShieldCheck } from "lucide-react";

type Card = {
  id: string;
  name: { ar: string; en: string };
  price: { ar: string; en: string };
  priceUnit: { ar: string; en: string };
  badge: { ar: string; en: string };
  features: { ar: string; en: string }[];
  highlighted?: boolean;
  cta: { ar: string; en: string };
  businessPlan: "commission" | "subscription";
};

const CARDS: Card[] = [
  {
    id: "commission",
    name: { ar: "باقة العمولة", en: "Commission Plan" },
    price: { ar: "مجاناً", en: "Free" },
    priceUnit: { ar: "ج.م", en: "EGP" },
    badge: { ar: "1% عمولة علي المبيعات", en: "1% sales commission" },
    features: [
      { ar: "متجر أونلاين جاهز للإطلاق", en: "Launch-ready online store" },
      {
        ar: "جميع المنتجات والتصنيفات جاهزة مسبقًا",
        en: "Products & categories pre-loaded",
      },
      {
        ar: "تحديث فوري للأسعار والمنتجات",
        en: "Instant price & product updates",
      },
      { ar: "تطبيق احترافي للتاجر", en: "Professional merchant app" },
      { ar: "استشارات تسويقية", en: "Marketing consultations" },
      { ar: "دعم فني 24/7", en: "24/7 technical support" },
      { ar: "عمولة 1% علي المبيعات", en: "1% sales commission" },
    ],
    cta: { ar: "اشترك الأن", en: "Subscribe now" },
    businessPlan: "commission",
  },
  {
    id: "subscription",
    name: { ar: "باقة الاشتراك", en: "Subscription Plan" },
    price: { ar: "800 ج.م", en: "EGP 800" },
    priceUnit: { ar: "/ شهر", en: "/ month" },
    badge: { ar: "بدون عمولة علي المبيعات", en: "No sales commission" },
    features: [
      { ar: "متجر أونلاين جاهز للإطلاق", en: "Launch-ready online store" },
      {
        ar: "جميع المنتجات والتصنيفات جاهزة مسبقًا",
        en: "Products & categories pre-loaded",
      },
      {
        ar: "تحديث فوري للأسعار والمنتجات",
        en: "Instant price & product updates",
      },
      { ar: "تطبيق احترافي للتاجر", en: "Professional merchant app" },
      { ar: "استشارات تسويقية", en: "Marketing consultations" },
      { ar: "دعم فني 24/7", en: "24/7 technical support" },
      { ar: "أقل مدة اشتراك 6 شهور", en: "Minimum 6-month subscription" },
      { ar: "بدون عمولة علي المبيعات", en: "No sales commission" },
    ],
    highlighted: true,
    cta: { ar: "اشترك الأن", en: "Subscribe now" },
    businessPlan: "subscription",
  },
];

export const PricingFigma = () => {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const isAr = lang === "ar";
  const tr = (v: { en: string; ar: string }) => (isAr ? v.ar : v.en);

  const displayCards = CARDS;

  return (
    <section
      id="pricing"
      dir={isAr ? "rtl" : "ltr"}
      className="bg-background py-12 md:py-20 scroll-mt-20"
    >
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            className={`text-4xl font-extrabold sm:text-5xl ${isAr ? "font-arabic" : ""}`}
          >
            {isAr ? "اختر الباقة" : "Choose your plan"}
          </h2>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2 items-stretch">
          {displayCards.map((card) => {
            const highlighted = card.highlighted;
            return (
              <div
                key={card.id}
                className={`relative flex flex-col rounded-3xl p-7 transition-all hover:-translate-y-1 ${
                  highlighted
                    ? "text-white shadow-elevated lg:-translate-y-4 lg:scale-105"
                    : "bg-card border border-border shadow-card"
                }`}
                style={
                  highlighted
                    ? {
                        background:
                          "linear-gradient(180deg, hsl(var(--brand-navy)) 0%, #05070f 100%)",
                      }
                    : undefined
                }
              >
                <div className="text-start">
                  <h3
                    className={`text-2xl font-bold ${isAr ? "font-arabic" : ""} ${
                      highlighted
                        ? "text-white"
                        : "text-[hsl(var(--brand-navy))]"
                    }`}
                  >
                    {tr(card.name)}
                  </h3>
                  <div className="mt-6 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <span className="text-4xl font-extrabold tracking-tight text-[hsl(var(--brand-orange))]">
                      {tr(card.price)}
                    </span>
                    <span
                      className={`text-sm ${highlighted ? "text-white/70" : "text-muted-foreground"}`}
                    >
                      {tr(card.priceUnit)}
                    </span>
                  </div>
                </div>

                <div
                  className={`mt-5 flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold ${
                    highlighted
                      ? "bg-white/5 text-white"
                      : "bg-muted/60 text-foreground"
                  }`}
                >
                  <ShieldCheck
                    className={`h-4 w-4 shrink-0 ${
                      highlighted
                        ? "text-white"
                        : "text-[hsl(var(--brand-navy))]"
                    }`}
                  />
                  <span className="flex-1 text-start">{tr(card.badge)}</span>
                </div>

                <ul className="mt-5 flex-1 space-y-3">
                  {card.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--brand-orange))]" />
                      <span
                        className={`flex-1 text-start ${
                          highlighted ? "text-white/90" : "text-foreground/90"
                        }`}
                      >
                        {tr(f)}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => {
                    const isCommission = card.id === "commission";
                    const isStaticStart = card.id === "start";
                    const isStaticGrowth = card.id === "growth";

                    if (isStaticStart || isStaticGrowth) {
                      // Fallback navigation for static plans (unfetched API)
                      navigate("/vendor/apply", {
                        state: {
                          planId: isStaticStart ? "start-6m" : "growth-6m",
                          businessPlan: "subscription",
                        },
                      });
                    } else {
                      // Standard dynamic package navigation
                      navigate("/vendor/apply", {
                        state: {
                          businessPlan: card.businessPlan,
                          packageId: isCommission ? "" : card.id,
                        },
                      });
                    }
                  }}
                  className={`mt-7 inline-flex h-12 items-center justify-center rounded-2xl font-bold transition-transform hover:scale-[1.02] ${
                    highlighted
                      ? "bg-white text-[hsl(var(--brand-navy))]"
                      : "bg-[hsl(var(--brand-navy))] text-white"
                  }`}
                >
                  {tr(card.cta)}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
