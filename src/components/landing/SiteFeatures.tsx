import { useLanguage } from "@/i18n/LanguageContext";
import { Grid2X2, Percent, Rocket, ShoppingCart, Sparkles } from "lucide-react";
import macbook from "@/assets/site/macbook.webp";
import phone from "@/assets/site/phone.webp";

export const SiteFeatures = () => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";

  const content = isAr
    ? {
        badge: "مزايا المتجر",
        heading: "منصة متكاملة تنمو",
        headingAccent: "مع طموح تجارتك",
        description:
          "نوفر لك كافة الأدوات التقنية واللوجستية التي تحتاجها لإطلاق متجرك الإلكتروني وإدارته بنجاح من مكان واحد.",
        cta: "أنشئ متجرك الآن",
      }
    : {
        badge: "Store features",
        heading: "A complete platform that grows",
        headingAccent: "with your business ambition",
        description:
          "We provide all the technical and logistical tools you need to launch and manage your online store successfully from one place.",
        cta: "Create your store now",
      };

  const features = isAr
    ? [
        {
          title: "عرض المنتجات بشكل احترافي",
          desc: "تصميم جذاب للمنتجات مع صور عالية الجودة وتفاصيل واضحة.",
          icon: Grid2X2,
        },
        {
          title: "بحث في AI",
          desc: "بحث ذكي يساعد العملاء على إيجاد منتجاتهم بسرعة وسهولة.",
          icon: Sparkles,
        },
        {
          title: "العروض والبنر",
          desc: "إدارة العروض والبنرات الترويجية بكل مرونة لجذب المزيد من العملاء.",
          icon: Percent,
        },
        {
          title: "سهولة طلب والسلة",
          desc: "تجربة شراء سلسة وسلة تسوق سهلة لإتمام الطلبات بسرعة.",
          icon: ShoppingCart,
        },
      ]
    : [
        {
          title: "Professional product display",
          desc: "Attractive product design with high-quality images and clear details.",
          icon: Grid2X2,
        },
        {
          title: "AI-powered search",
          desc: "Smart search helps customers find products quickly and easily.",
          icon: Sparkles,
        },
        {
          title: "Promotions and banners",
          desc: "Manage promotions and banners flexibly to attract more customers.",
          icon: Percent,
        },
        {
          title: "Easy cart and checkout",
          desc: "Smooth shopping experience and easy cart for fast checkout.",
          icon: ShoppingCart,
        },
      ];

  return (
    <section
      dir={isAr ? "rtl" : "ltr"}
      className="relative overflow-hidden bg-muted/40 py-16 md:py-24"
    >
      <div className="container-page relative">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Text + cards */}
          <div className="order-2 lg:order-1">
            <div className="mb-8 space-y-5">
              <span className="inline-flex items-center rounded-full bg-[hsl(var(--brand-navy)/0.08)] px-4 py-1.5 text-sm font-semibold text-[hsl(var(--brand-navy))] ring-1 ring-[hsl(var(--brand-navy)/0.15)]">
                {content.badge}
              </span>

              <h2
                className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-5xl"
                style={{
                  fontFamily: isAr
                    ? "Cairo, sans-serif"
                    : "'Space Grotesk', Inter, sans-serif",
                }}
              >
                {content.heading}{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, hsl(var(--brand-navy)) 0%, hsl(var(--brand-navy-deep)) 100%)",
                  }}
                >
                  {content.headingAccent}
                </span>
              </h2>

              <p className="max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
                {content.description}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[hsl(var(--brand-navy)/0.25)] hover:shadow-md"
                  >
                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[hsl(var(--brand-navy)/0.08)] text-[hsl(var(--brand-navy))] transition-transform duration-300 group-hover:scale-110">
                      <Icon className="h-5 w-5" strokeWidth={2} />
                    </div>
                    <h3 className="mb-1 text-sm font-bold text-card-foreground sm:text-base">
                      {feature.title}
                    </h3>
                    <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
                      {feature.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-8">
              <a
                href="#"
                className="inline-flex items-center gap-2 rounded-full bg-[hsl(var(--brand-navy))] px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-[hsl(var(--brand-navy-deep))]"
              >
                <Rocket className="h-4 w-4" />
                {content.cta}
              </a>
            </div>
          </div>

          {/* Mockups */}
          <div className="relative order-1 flex justify-center lg:order-2 lg:justify-end">
            {/* Soft glow */}
            <div
              className="absolute top-1/2 left-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
              style={{ background: "hsl(var(--brand-navy) / 0.08)" }}
            />

            <div className="relative w-full max-w-[520px]">
              <img
                src={macbook}
                alt=""
                loading="lazy"
                className="relative z-10 w-full object-contain drop-shadow-2xl"
              />
              <img
                src={phone}
                alt=""
                loading="lazy"
                className="absolute -bottom-6 -right-4 z-20 w-[34%] object-contain drop-shadow-2xl md:-bottom-8 md:-right-6 md:w-[36%]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
