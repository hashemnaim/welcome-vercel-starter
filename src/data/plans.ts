import {
  Rocket,
  Zap,
  Crown,
  Sparkles,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

export type PlanId =
  "free" | "start-6m" | "start-1y" | "growth-6m" | "growth-1y";

export interface PlanDef {
  id: PlanId;
  icon: LucideIcon;
  name: { en: string; ar: string };
  /** Short marketing description shown on landing pricing cards. */
  desc: { en: string; ar: string };
  price: { en: string; ar: string };
  /** Optional original (strike-through) price shown next to price. */
  originalPrice?: { en: string; ar: string };
  /** Small text right after the price (e.g. "/ month", "per order"). */
  priceNote: { en: string; ar: string };
  /** Highlight as the "most popular" plan. */
  highlight?: boolean;
  badge?: { en: string; ar: string };
  features: { en: string; ar: string }[];
}

/**
 * Single source of truth for vendor plans.
 * Used by both the landing Pricing section and the VendorApply step.
 */
export const PLANS: PlanDef[] = [
  {
    id: "free",
    icon: Rocket,
    name: { en: "Free Plan", ar: "الباقة المجانية" },
    desc: {
      en: "All platform features, pay only when you sell.",
      ar: "جميع مميزات المنصة، ادفع فقط عندما تبيع.",
    },
    price: { en: "Free", ar: "مجاناً" },
    priceNote: { en: "1% commission on sales", ar: "عمولة 1% على المبيعات" },
    features: [
      {
        en: "All platform features included",
        ar: "جميع خصائص المنصة متاحة بالكامل",
      },
      { en: "Ready online store", ar: "متجر أونلاين جاهز" },
      { en: "Merchant app", ar: "تطبيق التاجر" },
      { en: "Products & pricing management", ar: "إدارة المنتجات والأسعار" },
      { en: "Unlimited orders", ar: "طلبات غير محدودة" },
      { en: "Technical support", ar: "دعم فني" },
      { en: "Commission: 1% on sales", ar: "العمولة: 1% على المبيعات" },
    ],
  },
  {
    id: "start-6m",
    icon: Sparkles,
    name: { en: "Start — 6 Months", ar: "ستارت — 6 شهور" },
    desc: {
      en: "Launch-ready store for 6 months",
      ar: "متجر جاهز للإطلاق لمدة 6 شهور",
    },
    price: { en: "3,000 EGP", ar: "3000 جنيه" },
    originalPrice: { en: "3,600 EGP", ar: "3600 جنيه" },
    priceNote: {
      en: "/ 6 months — no commission",
      ar: "/ 6 شهور — بدون عمولة",
    },
    features: [
      { en: "Launch-ready online store", ar: "متجر أونلاين جاهز للإطلاق" },
      {
        en: "Products & categories pre-loaded",
        ar: "جميع المنتجات والتصنيفات جاهزة مسبقًا",
      },
      {
        en: "Instant price & product updates",
        ar: "تحديث فوري للأسعار والمنتجات",
      },
      {
        en: "Unlimited orders, no commission",
        ar: "طلبات غير محدودة بدون عمولة",
      },
      { en: "Professional merchant app", ar: "تطبيق احترافي للتاجر" },
      { en: "Marketing consultations", ar: "استشارات تسويقية" },
      { en: "24/7 technical support", ar: "دعم فني 24/7" },
    ],
  },
  {
    id: "start-1y",
    icon: Zap,
    name: { en: "Start — 1 Year", ar: "ستارت — سنة" },
    desc: { en: "Full year of stable operation", ar: "تشغيل مستقر لسنة كاملة" },
    price: { en: "6,000 EGP", ar: "6000 جنيه" },
    originalPrice: { en: "7,200 EGP", ar: "7200 جنيه" },
    priceNote: { en: "/ year — no commission", ar: "/ سنوياً — بدون عمولة" },
    highlight: true,
    badge: { en: "Best value", ar: "الأفضل قيمة" },
    features: [
      { en: "All Start features", ar: "جميع مميزات ستارت" },
      {
        en: "Full year of stable operation",
        ar: "تشغيل واستقرار لمدة سنة كاملة",
      },
      { en: "Priority technical support", ar: "أولوية في الدعم الفني" },
      {
        en: "Continuous platform updates",
        ar: "تحديثات وتحسينات مستمرة للمنصة",
      },
      { en: "No commission", ar: "بدون أي عمولة" },
    ],
  },
  {
    id: "growth-6m",
    icon: TrendingUp,
    name: { en: "Growth — 6 Months", ar: "نمو — 6 شهور" },
    desc: { en: "Advanced design & marketing", ar: "تصميم متقدم ودعم تسويقي" },
    price: { en: "6,000 EGP", ar: "6000 جنيه" },
    originalPrice: { en: "7,200 EGP", ar: "7200 جنيه" },
    priceNote: {
      en: "/ 6 months — no commission",
      ar: "/ 6 شهور — بدون عمولة",
    },
    features: [
      { en: "All Start features", ar: "جميع مميزات ستارت" },
      {
        en: "Custom store design & branding",
        ar: "تخصيص تصميم المتجر والهوية البصرية",
      },
      { en: "Professional offer pages", ar: "صفحات عروض احترافية" },
      { en: "Advanced marketing support", ar: "دعم تسويقي متقدم" },
      { en: "Advanced reports & analytics", ar: "تقارير وإحصائيات متقدمة" },
      { en: "Top-priority support", ar: "أولوية قصوى في الدعم الفني" },
      { en: "No commission", ar: "بدون عمولة" },
    ],
  },
  {
    id: "growth-1y",
    icon: Crown,
    name: { en: "Growth — 1 Year", ar: "نمو — سنة" },
    desc: { en: "Full growth partnership", ar: "شراكة نمو كاملة" },
    price: { en: "12,000 EGP", ar: "12000 جنيه" },
    originalPrice: { en: "14,400 EGP", ar: "14400 جنيه" },
    priceNote: { en: "/ year — no commission", ar: "/ سنوياً — بدون عمولة" },
    features: [
      { en: "All Growth features", ar: "جميع مميزات باقة نمو" },
      { en: "Store growth & marketing plan", ar: "خطة نمو وتسويق للمتجر" },
      {
        en: "Ad campaign operation support",
        ar: "دعم في تشغيل الحملات الإعلانية",
      },
      {
        en: "Continuous updates & improvements",
        ar: "تحديثات وتطويرات مستمرة",
      },
      {
        en: "Advanced professional customer experience",
        ar: "تجربة احترافية متقدمة للعملاء",
      },
      { en: "Growth partnership with merchant", ar: "شراكة نمو مع التاجر" },
      { en: "No commission", ar: "بدون أي عمولة" },
    ],
  },
];

export const getPlanById = (id: PlanId) => PLANS.find((p) => p.id === id)!;
