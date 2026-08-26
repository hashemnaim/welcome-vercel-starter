import { useLanguage } from "@/i18n/LanguageContext";
import { Link } from "@/lib/router-compat";
import { ChevronLeft, ChevronRight } from "lucide-react";
import phoneAsset from "@/assets/cta/iphone-cta.webp";

export const FinalCTA = () => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const Chevron = isAr ? ChevronLeft : ChevronRight;

  const badges = isAr
    ? ["دعم فني 24/7", "بدون رسوم إعداد"]
    : ["24/7 support", "No setup fees"];

  return (
    <section className="bg-background px-4 pb-10 pt-12 sm:px-6 sm:pb-16 sm:pt-20 md:pt-28">
      <div className="container-page">
        <div
          dir={isAr ? "rtl" : "ltr"}
          className="relative flex flex-col items-center overflow-hidden rounded-3xl shadow-elevated sm:rounded-[2rem] md:flex-row md:rounded-[2.5rem]"
          style={{ backgroundColor: "#2C5282" }}
        >
          {/* Decorative rings + glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 overflow-hidden"
          >
            <div className="absolute -top-24 -end-24 h-64 w-64 rounded-full border border-white/10 sm:h-96 sm:w-96" />
            <div className="absolute -top-32 -end-32 h-64 w-64 rounded-full border border-white/5 sm:h-96 sm:w-96" />
            <div className="absolute -bottom-40 -start-40 h-[320px] w-[320px] rounded-full bg-gradient-to-tr from-[#1a365d]/50 to-transparent sm:h-[500px] sm:w-[500px]" />
          </div>

          {/* Phone mockup — upright, flush to the card bottom */}
          <div className="relative flex w-full items-end justify-center self-stretch px-6 pt-8 sm:pt-10 md:min-h-[560px] md:w-1/2 md:px-8 md:pt-0">
            {/* soft stage behind the device */}
            <div
              aria-hidden
              className="absolute bottom-0 h-[70%] w-[78%] max-w-[420px] rounded-t-[3rem] bg-gradient-to-b from-white/12 to-white/0"
            />
            <div
              aria-hidden
              className="absolute bottom-[6%] h-40 w-48 rounded-full bg-white/25 blur-[90px] sm:h-64 sm:w-72 sm:blur-[120px]"
            />
            <div className="group/phone relative z-10 w-full max-w-[250px] sm:max-w-[300px] md:max-w-[340px]">
              <img
                src={phoneAsset}
                alt=""
                loading="lazy"
                className="block h-auto w-full origin-bottom object-contain object-bottom drop-shadow-[0_28px_60px_rgba(0,0,0,0.45)] transition-transform duration-700 ease-out md:translate-y-2 md:group-hover/phone:-translate-y-1"
              />
              {/* screen sheen */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-60 mix-blend-overlay"
              />
            </div>
          </div>

          {/* Text */}
          <div
            className={`relative z-10 w-full min-w-0 px-5 pb-10 text-center sm:px-7 sm:pb-12 md:w-1/2 md:pb-0 md:pe-14 md:ps-4 md:text-start ${
              isAr ? "font-arabic" : ""
            }`}
          >
            <h2 className="text-balance text-[1.5rem] font-extrabold leading-snug text-white sm:text-3xl md:text-4xl lg:text-5xl">
              {isAr ? (
                <>
                  حوّل متجرك إلى تجربة بيع{" "}
                  <span className="text-[hsl(var(--brand-orange))]">
                    متكاملة
                  </span>
                </>
              ) : (
                <>
                  Turn your store into a{" "}
                  <span className="text-[hsl(var(--brand-orange))]">
                    complete
                  </span>{" "}
                  selling experience
                </>
              )}
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-pretty text-sm leading-relaxed text-blue-100/85 sm:mt-5 sm:text-base md:mx-0 md:mt-6 md:text-lg">
              {isAr
                ? "أنشئ متجرًا إلكترونيًا يعكس هوية علامتك التجارية، واعرض منتجاتك باحترافية، واستقبل طلباتك من مكان واحد بسهولة."
                : "Create an online store that reflects your brand, showcase your products professionally, and receive orders from one place with ease."}
            </p>

            <div className="mt-6 flex justify-center sm:mt-8 md:justify-start">
              <Link
                to="/vendor/apply"
                className="group inline-flex w-full max-w-xs items-center justify-center gap-3 rounded-2xl bg-white px-5 py-3.5 text-sm font-bold text-[#2C5282] shadow-xl transition-all duration-300 hover:bg-slate-50 hover:shadow-2xl sm:w-auto sm:max-w-none sm:px-7 sm:py-4 sm:text-base"
              >
                <span>
                  {isAr ? "ابدأ إنشاء متجرك" : "Start building your store"}
                </span>
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#2C5282] text-white transition-transform duration-300 group-hover:-translate-x-1 rtl:group-hover:translate-x-1">
                  <Chevron className="h-4 w-4" strokeWidth={3} />
                </span>
              </Link>
            </div>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 border-t border-white/10 pt-6 sm:mt-10 sm:pt-7 md:justify-start">
              {badges.map((b) => (
                <div key={b} className="flex items-center gap-2">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-green-400" />
                  <span className="text-xs text-blue-200 sm:text-sm">{b}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
