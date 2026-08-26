import { useLanguage } from "@/i18n/LanguageContext";
import { Link } from "@/lib/router-compat";
import { ArrowUpLeft, ArrowUpRight } from "lucide-react";

export const BlogsRow = () => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const ArrowIcon = isAr ? ArrowUpLeft : ArrowUpRight;

  const date = isAr ? "الأربعاء، 12 مايو 2026" : "Wednesday, May 12, 2026";
  const title = isAr
    ? "كيف تطلق متجرك الإلكتروني في عصر يوم واحد"
    : "How to launch your online store in one afternoon";
  const excerpt = isAr
    ? "خطة عملية خطوة بخطوة من التسجيل للهوية للمنتجات لأول طلب كلها بأقل من 4 ساعات."
    : "A practical step-by-step plan from signup to identity to products to first order in under 4 hours.";

  const posts = [
    {
      img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=900&auto=format&fit=crop&q=70",
    },
    {
      img: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=900&auto=format&fit=crop&q=70",
      highlighted: true,
    },
    {
      img: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=900&auto=format&fit=crop&q=70",
    },
  ];

  return (
    <section
      className="bg-background py-10 md:py-16"
      dir={isAr ? "rtl" : "ltr"}
    >
      <div className="container-page">
        {/* Header row */}
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div
            className={`max-w-xl ${isAr ? "text-right font-arabic" : "text-left"}`}
          >
            <h2 className="text-3xl font-extrabold leading-tight text-[hsl(var(--brand-navy))] sm:text-4xl">
              {isAr
                ? "تعرّف على كل ما يساعدك على تنمية تجارتك"
                : "Everything you need to grow your business"}
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              {isAr
                ? "استكشف مقالات ونصائح عملية حول التجارة الإلكترونية، والتسويق، وإدارة المتاجر، لتكتسب خبرات تساعدك على تطوير أعمالك وتحقيق نمو مستمر."
                : "Explore practical articles and tips on e-commerce, marketing, and store management."}
            </p>
          </div>

          <Link
            to="/blog"
            className="inline-flex self-end items-center gap-2 rounded-full bg-[hsl(var(--brand-navy))] px-5 py-3 text-sm font-semibold text-white shadow-elevated transition hover:opacity-90 md:self-auto"
          >
            <span className="grid h-7 w-7 place-items-center rounded-full bg-white/15">
              <ArrowUpLeft className="h-4 w-4" />
            </span>
            {isAr ? "عرض المزيد" : "View more"}
          </Link>
        </div>

        {/* Cards */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {posts.map((p, i) => {
            const isHi = p.highlighted;
            return (
              <article
                key={i}
                className={`overflow-hidden rounded-3xl transition-all hover:-translate-y-1 ${
                  isHi
                    ? "bg-[hsl(var(--brand-navy))] text-white shadow-elevated md:-mt-6"
                    : "border border-border bg-card shadow-card"
                }`}
              >
                {/* Top: date + title */}
                <div
                  className={`px-6 pt-6 ${isAr ? "font-arabic text-right" : "text-left"}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
                        isHi
                          ? "bg-white text-[hsl(var(--brand-navy))]"
                          : "bg-muted text-[hsl(var(--brand-navy))]"
                      }`}
                    >
                      <ArrowIcon className="h-5 w-5" />
                    </span>
                    <div className="flex-1">
                      <p
                        className={`text-[11px] ${isHi ? "text-white/70" : "text-muted-foreground"}`}
                      >
                        {date}
                      </p>
                      <h3
                        className={`mt-2 text-lg font-extrabold leading-snug ${
                          isHi ? "text-white" : "text-[hsl(var(--brand-navy))]"
                        }`}
                      >
                        {title}
                      </h3>
                    </div>
                  </div>
                  <p
                    className={`mt-3 text-xs leading-relaxed ${
                      isHi ? "text-white/80" : "text-muted-foreground"
                    }`}
                  >
                    {excerpt}
                  </p>
                </div>

                {/* Image */}
                <div className="mt-5 px-4 pb-4">
                  <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
                    <img
                      src={p.img}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
