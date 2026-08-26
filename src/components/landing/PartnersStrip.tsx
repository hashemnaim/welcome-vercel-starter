import { useLanguage } from "@/i18n/LanguageContext";
import stripAsset from "@/assets/partners/strip-clean.webp";

export const PartnersStrip = () => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";

  // Strip image is 996×150. Render it as a repeating marquee so the row loops
  // end-to-end with original colors and no visible gaps.
  return (
    <section className="border-y border-border bg-background py-6">
      <div className="container-page">
        <p
          className={`text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground ${
            isAr ? "font-arabic" : ""
          }`}
        >
          {isAr ? "شركاء نجاحنا" : "Trusted by leading merchants"}
        </p>
      </div>

      <div className="mt-6 overflow-hidden px-2 sm:px-4">
        <div
          className="partners-strip-bg h-10 sm:h-12 md:h-14 lg:h-16"
          style={{
            width: "200%",
            backgroundImage: `url(${stripAsset})`,
            ["--strip-loop" as string]: "-1798px",
          }}
        />
      </div>
    </section>
  );
};
