import { useLanguage } from "@/i18n/LanguageContext";
import { useNavigate } from "@/lib/router-compat";
import { Rocket } from "lucide-react";
import ipadAsset from "@/assets/hero/ipad.webp";
import phoneAsset from "@/assets/hero/phone.webp";
import markAsset from "@/assets/hero/mark-logo.webp";
import gridAsset from "@/assets/hero/grid.webp";

export const HeroFigma = () => {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const isAr = lang === "ar";

  const words = isAr ? ["شوب", "لانسر"] : ["Shoplanser"];
  const line2 = isAr ? "متجرك في دقيقة" : "your store in a minute";

  return (
    <section
      dir={isAr ? "rtl" : "ltr"}
      className="relative overflow-hidden bg-background pt-12 pb-2 md:pt-24 md:pb-14"
    >
      {/* grid background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage: `url(${gridAsset})`,
          backgroundSize: "auto",
          backgroundRepeat: "repeat",
          maskImage:
            "radial-gradient(ellipse at center, black 55%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 55%, transparent 100%)",
        }}
      />

      <div className="container-page relative grid items-center gap-6 md:grid-cols-2 md:gap-10">
        {/* Text column */}
        <div
          className={`relative order-2 md:order-1 ${isAr ? "font-arabic" : ""}`}
        >
          <h1
            className="relative text-4xl font-extrabold leading-[1.15] text-foreground sm:text-5xl md:text-6xl"
            style={{ letterSpacing: isAr ? "-0.5px" : "-1.5px" }}
          >
            <span className="inline-flex items-center gap-4">
              <img
                src={markAsset}
                alt=""
                width={96}
                height={96}
                className="hero-anim-mark logo-wobble inline-block h-16 w-16 object-contain drop-shadow-[0_10px_25px_hsl(var(--brand-navy)/0.35)] md:h-24 md:w-24"
              />
              <span className="inline-flex flex-wrap gap-x-3">
                {words.map((w, i) => (
                  <span
                    key={i}
                    className="hero-anim-fade-up inline-block"
                    style={{ animationDelay: `${0.7 + i * 0.08}s` }}
                  >
                    {w}
                  </span>
                ))}
              </span>
            </span>
            <span
              className="hero-anim-fade-up mt-2 block"
              style={{
                animationDelay: "0.95s",
                color: "hsl(var(--brand-navy))",
              }}
            >
              {line2}
            </span>
          </h1>

          <p
            className="hero-anim-fade-up mt-5 max-w-md text-base text-muted-foreground md:text-lg"
            style={{ animationDelay: "1.15s" }}
          >
            {isAr
              ? "أطلق متجرك الإلكتروني في دقيقة — مصمّم للسوبر ماركت والصيدليات ومحلات الأزياء والمطاعم، بدون كود، وبدون تعقيد."
              : "Launch your online store in a minute — built for grocery, pharmacy, fashion, and restaurants. No code, no setup fees."}
          </p>

          <div
            className="hero-anim-fade-up mt-8 flex flex-wrap items-center gap-3"
            style={{ animationDelay: "1.3s" }}
          >
            <button
              onClick={() => navigate("/vendor/apply")}
              className="btn-shine inline-flex h-12 items-center gap-2 rounded-full px-7 text-sm font-bold text-white shadow-elevated transition-all hover:scale-105 hover:shadow-[0_20px_40px_-15px_hsl(var(--brand-navy)/0.5)]"
              style={{ backgroundColor: "hsl(var(--brand-navy))" }}
            >
              <Rocket className="h-5 w-5" />
              {isAr ? "ابدأ متجرك الآن" : "Start your store"}
            </button>
            <button
              onClick={() => navigate("/marketplace")}
              className="inline-flex h-12 items-center gap-2 rounded-full border-2 bg-background px-7 text-sm font-bold transition-colors hover:bg-muted"
              style={{
                borderColor: "hsl(var(--brand-navy))",
                color: "hsl(var(--brand-navy))",
              }}
            >
              {isAr ? "كيف تعمل المنصة" : "How it works"}
            </button>
          </div>
        </div>

        {/* Devices column — iPad drives intrinsic height, phone overlays it */}
        <div className="relative order-1 mx-auto w-full max-w-[720px] md:order-2">
          <img
            src={ipadAsset}
            alt=""
            className="hero-anim-ipad hero-float-slow block h-auto w-full drop-shadow-2xl"
            style={{ ["--r" as never]: "-6deg" }}
            loading="eager"
          />
          <img
            src={phoneAsset}
            alt=""
            className="hero-anim-phone hero-float-slow absolute bottom-[-4%] start-[48%] w-[38%] max-w-[280px] drop-shadow-2xl"
            style={{ ["--r" as never]: "6deg", animationDelay: "0.6s" }}
            loading="eager"
          />
        </div>
      </div>
    </section>
  );
};
