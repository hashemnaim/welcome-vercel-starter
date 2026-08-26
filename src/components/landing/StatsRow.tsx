import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";

interface Stat {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
}

const useCountUp = (target: number, active: boolean, duration = 1600) => {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) return;
    const reduce = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) {
      setN(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      // easeOutExpo
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      setN(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, duration]);
  return n;
};

const StatItem = ({ stat, active }: { stat: Stat; active: boolean }) => {
  const n = useCountUp(stat.value, active);
  return (
    <span
      className="text-3xl font-extrabold text-[hsl(var(--brand-navy))] md:text-4xl tabular-nums"
      dir="ltr"
    >
      {stat.prefix}
      {n.toLocaleString("en-US")}
      {stat.suffix}
    </span>
  );
};

export const StatsRow = () => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const ref = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setActive(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const items: Stat[] = [
    { value: 8, prefix: "+", label: isAr ? "مدن مغطاة" : "Cities" },
    {
      value: 12,
      prefix: "+",
      suffix: "K",
      label: isAr ? "منتج مباع" : "Products sold",
    },
    { value: 300, prefix: "+", label: isAr ? "طلب يومياً" : "Orders / day" },
    { value: 25, prefix: "+", label: isAr ? "متجر نشط" : "Active stores" },
  ];

  return (
    <section className="bg-background py-6 md:py-10">
      <div className="container-page">
        <div
          ref={ref}
          className="grid grid-cols-2 divide-x divide-border rtl:divide-x-reverse sm:grid-cols-4"
        >
          {items.map((it, i) => (
            <div
              key={it.label}
              className="stat-cell flex flex-col items-center px-4 py-3 text-center"
              style={{ animationDelay: `${i * 90}ms` }}
              data-in={active}
            >
              <StatItem stat={it} active={active} />
              <span
                className={`mt-1 text-xs text-muted-foreground md:text-sm ${
                  isAr ? "font-arabic" : ""
                }`}
              >
                {it.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
