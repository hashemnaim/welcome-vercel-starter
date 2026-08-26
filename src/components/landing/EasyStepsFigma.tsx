import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import step1Asset from "@/assets/steps/step1-store-v2.png.asset.json";
import step2Asset from "@/assets/steps/step2-brand.png.asset.json";
import step3Asset from "@/assets/steps/step3-categories-v2.png.asset.json";
import step4Asset from "@/assets/steps/step4-pricing.png.asset.json";

export const EasyStepsFigma = () => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const navy = "hsl(var(--brand-navy))";

  const steps = [
    {
      n: "01",
      title: isAr ? "أطلق متجرك الإلكتروني" : "Launch your online store",
      desc: isAr
        ? "ابدأ في إنشاء متجرك خلال دقائق، وانقل نشاطك التجاري من المحل إلى الإنترنت بخطوات بسيطة وسريعة."
        : "Set up your store in minutes and take your business from offline to online with a simple, fast flow.",
      img: step1Asset.url,
      side: "right" as const,
    },
    {
      n: "02",
      title: isAr ? "ابنِ هوية علامتك التجارية" : "Build your brand identity",
      desc: isAr
        ? "خصص اسم المتجر، والشعار، والألوان، لتقديم تجربة احترافية تعكس هوية نشاطك وتزيد ثقة عملائك."
        : "Customize your store name, logo and colors to deliver a professional experience your customers trust.",
      img: step2Asset.url,
      side: "left" as const,
    },
    {
      n: "03",
      title: isAr ? "اعرض منتجاتك باحترافية" : "Showcase your products",
      desc: isAr
        ? "أضف منتجاتك، ونظمها داخل تصنيفات واضحة، مع صور ووصف وأسعار تساعد عملاءك على اتخاذ قرار الشراء بسهولة."
        : "Add products and organize them in clear categories with images, prices and details that convert.",
      img: step3Asset.url,
      side: "right" as const,
    },
    {
      n: "04",
      title: isAr ? "انطلق بالباقة المناسبة" : "Pick the right plan",
      desc: isAr
        ? "اختر الباقة التي تناسب حجم أعمالك، وابدأ في استقبال الطلبات وإدارة متجرك بكل سهولة."
        : "Choose the plan that fits your business and start receiving orders and managing your store with ease.",
      img: step4Asset.url,
      side: "left" as const,
    },
  ];

  const listRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState<Set<number>>(new Set());

  useEffect(() => {
    const nodes =
      listRef.current?.querySelectorAll<HTMLElement>("[data-step-index]");
    if (!nodes) return;
    const io = new IntersectionObserver(
      (entries) => {
        setVisible((prev) => {
          const next = new Set(prev);
          entries.forEach((e) => {
            if (e.isIntersecting) {
              const i = Number((e.target as HTMLElement).dataset.stepIndex);
              next.add(i);
            }
          });
          return next;
        });
      },
      { threshold: 0.25, rootMargin: "0px 0px -10% 0px" },
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  return (
    <section className="bg-background py-10 md:py-16">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            className={`text-3xl font-extrabold sm:text-4xl md:text-5xl ${isAr ? "font-arabic" : ""}`}
            style={{ color: navy }}
          >
            {isAr
              ? "أنشئ متجرك في أربع خطوات بسيطة"
              : "Launch your store in 4 easy steps"}
          </h2>
          <p
            className={`mt-4 text-muted-foreground ${isAr ? "font-arabic" : ""}`}
          >
            {isAr
              ? "كل ما تحتاجه للانطلاق أصبح أسهل من أي وقت مضى. اتبع خطوات واضحة لإنشاء متجر إلكتروني احترافي يعكس هوية نشاطك، ويكون جاهزاً لاستقبال الطلبات والوصول إلى عملاء أكثر في دقائق."
              : "Everything you need to launch is now easier than ever — a clear guided flow that gets you selling in minutes."}
          </p>
        </div>

        <div ref={listRef} className="relative mt-16">
          {/* Connecting vertical progress line */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-[2px] -translate-x-1/2 md:block"
            style={{
              background: `linear-gradient(to bottom, transparent, ${navy}22, transparent)`,
            }}
          />

          <div className="space-y-6 md:space-y-10">
            {steps.map((s, i) => {
              const imageOnRight = s.side === "right";
              const isVisible = visible.has(i);
              const fromLeft = imageOnRight ? !isAr : isAr;

              return (
                <div
                  key={s.n}
                  data-step-index={i}
                  className="relative"
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  {/* Center node on desktop */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:block"
                  >
                    <span
                      className={`block h-3 w-3 rounded-full transition-all duration-700 ${
                        isVisible
                          ? "scale-100 opacity-100"
                          : "scale-0 opacity-0"
                      }`}
                      style={{
                        backgroundColor: navy,
                        boxShadow: isVisible
                          ? `0 0 0 6px ${navy}22, 0 0 24px ${navy}66`
                          : "none",
                      }}
                    />
                  </div>

                  <div
                    className={`group grid items-center gap-6 rounded-[2rem] border border-border/60 bg-card p-5 shadow-card transition-all duration-700 ease-out md:gap-10 md:p-8 md:grid-cols-2 hover:-translate-y-1 hover:shadow-elevated ${
                      isVisible
                        ? "translate-y-0 opacity-100"
                        : "translate-y-10 opacity-0"
                    }`}
                    style={{ transitionDelay: `${i * 120}ms` }}
                  >
                    {/* Text block */}
                    <div
                      className={`${isAr ? "font-arabic text-start" : "text-start"} ${
                        imageOnRight ? "md:order-2" : "md:order-1"
                      } px-2 md:px-6 transition-all duration-700 ease-out ${
                        isVisible
                          ? "translate-x-0 opacity-100"
                          : fromLeft
                            ? "-translate-x-8 opacity-0"
                            : "translate-x-8 opacity-0"
                      }`}
                      style={{ transitionDelay: `${i * 120 + 150}ms` }}
                    >
                      <span
                        className="inline-block text-6xl font-black leading-none transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-105 md:text-7xl"
                        style={{
                          WebkitTextStroke: `2px ${navy}`,
                          color: "transparent",
                          fontFamily: "'Rubik', sans-serif",
                        }}
                        dir="ltr"
                      >
                        {s.n}
                      </span>
                      <h3
                        className="mt-4 text-2xl font-extrabold md:text-3xl"
                        style={{ color: navy }}
                      >
                        {s.title}
                      </h3>
                      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
                        {s.desc}
                      </p>
                    </div>

                    {/* Illustration card */}
                    <div
                      className={`relative overflow-hidden rounded-2xl shadow-elevated transition-all duration-700 ease-out ${
                        imageOnRight ? "md:order-1" : "md:order-2"
                      } ${
                        isVisible
                          ? "translate-x-0 scale-100 opacity-100"
                          : fromLeft
                            ? "translate-x-8 scale-95 opacity-0"
                            : "-translate-x-8 scale-95 opacity-0"
                      }`}
                      style={{
                        backgroundColor: navy,
                        transitionDelay: `${i * 120 + 250}ms`,
                      }}
                    >
                      {/* Shine sweep on hover */}
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-1000 group-hover:translate-x-full"
                      />
                      <img
                        src={s.img}
                        alt=""
                        loading="lazy"
                        className="block w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
