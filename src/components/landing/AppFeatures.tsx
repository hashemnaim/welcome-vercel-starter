import { useState, useEffect } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import appStoreIcon from "@/assets/stores/app-store-icon.jpg";
import googlePlayIcon from "@/assets/stores/google-play-icon.png";
import phoneMenu from "@/assets/app/phone-menu.webp";
import phoneOrders from "@/assets/app/phone-orders.webp";
import { fetchConfig, type ApiConfig } from "@/lib/shoplanserApi";

export const AppFeatures = () => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const navy = "hsl(var(--brand-navy))";

  const [config, setConfig] = useState<ApiConfig | null>(null);

  useEffect(() => {
    fetchConfig().then(setConfig);
  }, []);

  const defaultPlayStoreUrl =
    "https://play.google.com/store/apps/details?id=com.zahed.shoplanser";
  const defaultAppleStoreUrl =
    "https://apps.apple.com/us/app/%D8%B4%D9%88%D8%A8-%D9%84%D8%A7%D9%86%D8%B3%D8%B1-%D8%A7%D9%84%D8%AA%D8%A7%D8%AC%D8%B1/id6788907378";

  const playStoreUrl = config
    ? config.download_user_app_links?.playstore_url_status === "1" &&
      config.download_user_app_links?.playstore_url
      ? config.download_user_app_links.playstore_url
      : defaultPlayStoreUrl
    : defaultPlayStoreUrl;

  const appleStoreUrl = config
    ? config.download_user_app_links?.apple_store_url_status === "1" &&
      config.download_user_app_links?.apple_store_url
      ? config.download_user_app_links.apple_store_url
      : defaultAppleStoreUrl
    : defaultAppleStoreUrl;

  const bullets = isAr
    ? [
        "تحكم كامل للمتجر من خلال التطبيق",
        "إدارة المخزون بسهولة من خلال لوحة التحكم",
        "متابعة المبيعات وتحليل الأداء بدقة",
        "دعم العملاء المباشر عبر المحادثة الفورية",
        "تخصيص العروض والخصومات لجذب العملاء",
        "تتبع طلبات الشحن والتوصيل في الوقت الحقيقي",
      ]
    : [
        "Full store control from the app",
        "Effortless inventory management from the dashboard",
        "Track sales and analyze performance accurately",
        "Live customer support through instant chat",
        "Custom offers and discounts to attract customers",
        "Real-time shipping and delivery tracking",
      ];

  return (
    <section className="bg-background py-10 md:py-16">
      <div
        className="container-page grid items-center gap-12 md:grid-cols-2"
        dir={isAr ? "rtl" : "ltr"}
      >
        {/* Text column */}
        <div
          className={`${isAr ? "font-arabic text-start" : "text-start"} order-2 md:order-1`}
        >
          <h2
            className="text-3xl font-extrabold sm:text-4xl md:text-5xl"
            style={{ color: navy }}
          >
            {isAr ? "مزايا تطبيق التاجر" : "Merchant app features"}
          </h2>

          <ul className="mt-8 space-y-4">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center"
                  style={{ color: navy }}
                >
                  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                    <path
                      d="M4 12l5 5L20 6"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M4 16l5 5L20 10"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity="0.55"
                    />
                  </svg>
                </span>
                <span className="text-base text-foreground/90 md:text-lg">
                  {b}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-4" dir="ltr">
            {appleStoreUrl && (
              <a
                href={appleStoreUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="App Store"
                className="group inline-flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
              >
                <img
                  src={appStoreIcon}
                  alt="App Store"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </a>
            )}
            {playStoreUrl && (
              <a
                href={playStoreUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Google Play"
                className="group inline-flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-white p-2 shadow-lg ring-1 ring-border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
              >
                <img
                  src={googlePlayIcon}
                  alt="Google Play"
                  className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-110"
                />
              </a>
            )}
          </div>
        </div>

        {/* Phones column */}
        <div className="relative order-1 min-h-[440px] md:order-2 md:min-h-[560px]">
          <img
            src={phoneMenu}
            alt=""
            loading="lazy"
            className="hero-float-slow absolute left-2 top-0 w-[58%] max-w-[300px] drop-shadow-2xl md:left-6"
            style={{ transform: "rotate(-10deg)" }}
          />
          <img
            src={phoneOrders}
            alt=""
            loading="lazy"
            className="hero-float-slow absolute bottom-0 right-2 w-[58%] max-w-[300px] drop-shadow-2xl md:right-6"
            style={{ transform: "rotate(10deg)", animationDelay: "0.6s" }}
          />
        </div>
      </div>
    </section>
  );
};
