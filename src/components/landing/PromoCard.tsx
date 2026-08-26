import { useLanguage } from "@/i18n/LanguageContext";
import { useNavigate } from "@/lib/router-compat";
import { Play, ShoppingBag } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import cartAsset from "@/assets/promo/cart.webp";

export const PromoCard = () => {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const isAr = lang === "ar";
  const navy = "hsl(var(--brand-navy))";

  const cardRef = useRef<HTMLDivElement | null>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const reduce = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) {
      setDrawn(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setDrawn(true);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="bg-background py-10 md:py-16">
      <div className="container-page">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Dark navy card */}
          <div
            ref={cardRef}
            className="relative overflow-hidden rounded-[2rem] p-8 md:p-10 shadow-elevated"
            style={{ backgroundColor: navy }}
          >
            {/* yellow loop scribble — animated SVG */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-4 flex justify-center md:top-6"
              style={{ contain: "paint" }}
            >
              <svg
                viewBox="0 0 400 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-24 w-[85%] max-w-[420px] md:h-32"
                style={{
                  transform: `${isAr ? "scaleX(-1) " : ""}translateZ(0)`,
                  shapeRendering: "geometricPrecision",
                }}
              >
                <path
                  d="M20 90 C 60 40, 110 20, 140 55 C 160 80, 130 100, 110 80 C 95 65, 120 40, 155 45 C 210 52, 260 75, 320 55 C 360 42, 385 55, 395 75"
                  stroke="#F5C518"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  pathLength={1}
                  style={{
                    strokeDasharray: 1,
                    strokeDashoffset: drawn ? 0 : 1,
                    transition:
                      "stroke-dashoffset 1.2s cubic-bezier(0.65, 0, 0.35, 1)",
                    willChange: drawn ? "auto" : "stroke-dashoffset",
                  }}
                />
              </svg>
            </div>

            <div
              className={`relative pt-24 md:pt-28 ${isAr ? "font-arabic text-start" : "text-start"}`}
            >
              <h3 className="text-3xl font-extrabold leading-[1.25] text-white md:text-[2.5rem]">
                {isAr ? (
                  <>
                    ح<span className="tracking-[0.35em]">ـــو</span>ّل متجرك
                    <br />ل
                    <span className="tracking-[0.35em]">ـــوجهة للبيــــ</span>
                    ـع
                    <br />
                    أونلاي<span className="tracking-[0.35em]">ـــــ</span>ن
                  </>
                ) : (
                  <>
                    Turn your store into an
                    <br />
                    online-selling destination
                  </>
                )}
              </h3>

              <p className="mt-5 max-w-md text-sm leading-relaxed text-white/70 md:text-base">
                {isAr
                  ? "ابدأ اليوم في إنشاء متجرك الإلكتروني، وامنح عملاءك تجربة تسوّق احترافية تساعدك على الوصول إلى المزيد من المبيعات، دون أي تعقيد."
                  : "Start today by creating your online store and give your customers a professional shopping experience that helps you reach more sales without any complexity."}
              </p>

              <button
                onClick={() => navigate("/vendor/apply")}
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold shadow-card transition-transform hover:scale-[1.03]"
                style={{ color: navy }}
              >
                <ShoppingBag className="h-4 w-4" />
                {isAr ? "أنشئ متجرك الآن" : "Create your store now"}
              </button>
            </div>
          </div>

          {/* Image card with play overlay */}
          <div className="relative overflow-hidden rounded-[2rem] shadow-elevated">
            <img
              src={cartAsset}
              alt=""
              loading="lazy"
              className="h-full min-h-[340px] w-full object-cover md:min-h-[440px]"
            />
            <button
              aria-label={isAr ? "شغّل الفيديو" : "Play video"}
              className="absolute inset-0 flex items-center justify-center transition-transform hover:scale-105"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/85 shadow-elevated backdrop-blur md:h-20 md:w-20">
                <Play
                  className="h-6 w-6 md:h-7 md:w-7 fill-current"
                  style={{ color: navy }}
                />
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
