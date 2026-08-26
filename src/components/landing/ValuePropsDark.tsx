import { useLanguage } from "@/i18n/LanguageContext";
import { Rocket, LayoutGrid, Smartphone, Truck } from "lucide-react";
import markAsset from "@/assets/hero/mark-new.webp";

export const ValuePropsDark = () => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";

  const rightItems = [
    { icon: Rocket, title: isAr ? "موقع متجرك" : "Store website" },
    { icon: LayoutGrid, title: isAr ? "لوحة التحكم" : "Admin dashboard" },
  ];
  const leftItems = [
    { icon: Smartphone, title: isAr ? "تطبيق التاجر" : "Merchant app" },
    { icon: Truck, title: isAr ? "تطبيق التوصيل" : "Delivery app" },
  ];

  const Node = ({
    icon: Icon,
    title,
    align,
  }: {
    icon: typeof Rocket;
    title: string;
    align: "start" | "end";
  }) => (
    <div
      className={`flex items-center gap-3 ${align === "end" ? "flex-row-reverse" : ""}`}
    >
      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.06] shadow-[0_0_30px_rgba(59,89,152,0.35)] backdrop-blur-xl md:h-14 md:w-14">
        <Icon className="h-5 w-5 text-white md:h-6 md:w-6" strokeWidth={1.75} />
      </div>
      <span
        className={`text-base font-bold text-white md:text-lg ${isAr ? "font-arabic" : ""}`}
      >
        {title}
      </span>
    </div>
  );

  // Node positions in the SVG coordinate system (viewBox 1000x340)
  const nodes = {
    tl: { x: 210, y: 70 },
    bl: { x: 210, y: 270 },
    tr: { x: 790, y: 70 },
    br: { x: 790, y: 270 },
    center: { x: 500, y: 170 },
  };
  // Radius of node icon (approx) and center logo
  const nodeR = 32;
  const centerR = 50;

  // Build a curved connector from a node to the center logo edge
  const connector = (from: { x: number; y: number }) => {
    const c = nodes.center;
    // start point: edge of node facing center
    const dx = c.x - from.x;
    const dy = c.y - from.y;
    const len = Math.hypot(dx, dy);
    const sx = from.x + (dx / len) * nodeR;
    const sy = from.y + (dy / len) * nodeR;
    const ex = c.x - (dx / len) * centerR;
    const ey = c.y - (dy / len) * centerR;
    // control point: elbow at halfway horizontal then curve down/up to center
    const midX = (sx + ex) / 2;
    return `M ${sx} ${sy} H ${midX} Q ${c.x} ${sy} ${c.x} ${(sy + ey) / 2} V ${ey}`;
  };

  return (
    <section
      dir={isAr ? "rtl" : "ltr"}
      className="relative overflow-hidden py-10 md:py-16 text-white md:py-20"
      style={{
        background:
          "radial-gradient(ellipse at center, hsl(var(--brand-navy)) 0%, hsl(var(--brand-navy-deep)) 75%)",
      }}
    >
      <div className="container-page relative">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            className={`text-3xl font-extrabold sm:text-4xl md:text-5xl ${isAr ? "font-arabic" : ""}`}
          >
            {isAr ? "شوب لانسر يقدم لك" : "Shoplanser gives you"}
          </h2>
          <p
            className={`mt-4 text-sm text-white/60 md:text-base ${isAr ? "font-arabic" : ""}`}
          >
            {isAr
              ? "بمجرد إنشاء متجرك تحصل على كل الأدوات لإدارته وتشغيله من الويب والجوال."
              : "The moment you launch, you get every tool to run your store from web to mobile."}
          </p>
        </div>

        {/* Desktop diagram — absolute positioned so lines & nodes always align */}
        <div className="relative mx-auto mt-14 hidden w-full max-w-4xl md:block">
          <div
            className="relative w-full"
            style={{ aspectRatio: "1000 / 340" }}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 1000 340"
              className="pointer-events-none absolute inset-0 h-full w-full"
            >
              <g
                stroke="rgba(255,255,255,0.28)"
                strokeWidth="1.2"
                strokeDasharray="5 6"
                fill="none"
              >
                <path d={connector(nodes.tl)} />
                <path d={connector(nodes.bl)} />
                <path d={connector(nodes.tr)} />
                <path d={connector(nodes.br)} />
              </g>
            </svg>

            {/* Nodes */}
            {[
              { pos: nodes.tl, item: leftItems[0], align: "start" as const },
              { pos: nodes.bl, item: leftItems[1], align: "start" as const },
              { pos: nodes.tr, item: rightItems[0], align: "end" as const },
              { pos: nodes.br, item: rightItems[1], align: "end" as const },
            ].map(({ pos, item, align }) => (
              <div
                key={item.title}
                className="absolute"
                style={{
                  left: `${(pos.x / 1000) * 100}%`,
                  top: `${(pos.y / 340) * 100}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <Node icon={item.icon} title={item.title} align={align} />
              </div>
            ))}

            {/* Center logo */}
            <div
              className="absolute"
              style={{
                left: `${(nodes.center.x / 1000) * 100}%`,
                top: `${(nodes.center.y / 340) * 100}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div className="relative flex items-center justify-center">
                <span
                  aria-hidden="true"
                  className="absolute h-28 w-28 rounded-2xl"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(99,131,255,0.35) 0%, transparent 70%)",
                    animation: "hero-pop 2.4s ease-in-out infinite",
                  }}
                />
                <span
                  aria-hidden="true"
                  className="absolute h-24 w-24 rounded-2xl border border-white/20"
                  style={{
                    animation: "hero-pop 2.4s ease-in-out infinite .6s",
                  }}
                />
                <div
                  className="hero-float-slow relative flex h-20 w-20 items-center justify-center rounded-2xl shadow-[0_0_40px_rgba(99,131,255,0.55)]"
                  style={{
                    background:
                      "linear-gradient(160deg, hsl(var(--brand-navy) / 0.95), hsl(var(--brand-navy-deep)))",
                    border: "1px solid rgba(255,255,255,0.18)",
                  }}
                >
                  <img
                    src={markAsset}
                    alt="Shoplanser"
                    className="block h-12 w-12 object-contain"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile: simple stack */}
        <div className="mt-12 grid gap-6 md:hidden">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/[0.06]">
            <img
              src={markAsset}
              alt="Shoplanser"
              className="h-10 w-10 object-contain"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[...rightItems, ...leftItems].map((it) => (
              <div
                key={it.title}
                className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-center"
              >
                <it.icon className="h-6 w-6 text-white" strokeWidth={1.75} />
                <span
                  className={`text-sm font-bold text-white ${isAr ? "font-arabic" : ""}`}
                >
                  {it.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
