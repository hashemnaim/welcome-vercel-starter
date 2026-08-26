import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useLanguage } from "@/i18n/LanguageContext";
import { Link, useParams } from "@/lib/router-compat";
import { Button } from "@/components/ui/button";
import {
  ArrowUpLeft,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  Instagram,
  Linkedin,
  MessageCircle,
  Twitter,
} from "lucide-react";
import { useState } from "react";

const NAVY = "hsl(var(--brand-navy))";

interface BlogPostMeta {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  image: string;
  body: string[];
}

const IMAGES = [
  "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&auto=format&fit=crop&q=70",
  "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=1200&auto=format&fit=crop&q=70",
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&auto=format&fit=crop&q=70",
  "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&auto=format&fit=crop&q=70",
];

const usePosts = (): BlogPostMeta[] => {
  const { t } = useLanguage();
  return [
    { slug: "launch-your-store", ...t.blog.posts.p1, image: IMAGES[0] },
    { slug: "merchant-tips", ...t.blog.posts.p2, image: IMAGES[3] },
    { slug: "promo-ideas", ...t.blog.posts.p3, image: IMAGES[2] },
    { slug: "qr-code-power", ...t.blog.posts.p4, image: IMAGES[1] },
  ];
};

/* ---------------- Navy hero + breadcrumb ---------------- */
const NavyHero = ({
  title,
  crumbs,
}: {
  title: string;
  crumbs: { label: string; to?: string }[];
}) => {
  const { dir } = useLanguage();
  const isRtl = dir === "rtl";
  const Sep = isRtl ? ChevronLeft : ChevronRight;
  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: NAVY }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
        <div className="absolute -left-10 top-1/2 h-64 w-64 -translate-y-1/2 rotate-12 rounded-3xl border-8 border-white/40" />
      </div>
      <div className="container-page relative flex items-center justify-between py-10 text-white">
        <nav className="flex items-center gap-2 text-sm text-white/80">
          {crumbs.map((c, i) => (
            <span key={i} className="inline-flex items-center gap-2">
              {c.to ? (
                <Link to={c.to} className="hover:text-white">
                  {c.label}
                </Link>
              ) : (
                <span className="text-white">{c.label}</span>
              )}
              {i < crumbs.length - 1 && <Sep className="h-4 w-4 opacity-70" />}
            </span>
          ))}
        </nav>
        <h1 className="text-2xl font-extrabold sm:text-3xl">{title}</h1>
      </div>
    </section>
  );
};

/* ---------------- Card ---------------- */
const PostCard = ({ post }: { post: BlogPostMeta }) => {
  const { lang, dir } = useLanguage();
  const isAr = lang === "ar";
  const ArrowIcon = dir === "rtl" ? ArrowUpLeft : ArrowUpRight;
  const readLabel = isAr ? "اقرأ المقال" : "Read article";
  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-card transition-all hover:-translate-y-1 hover:shadow-elevated ${
        isAr ? "font-arabic text-right" : "text-left"
      }`}
    >
      <Link to={`/blog/${post.slug}`} className="block overflow-hidden">
        <div className="aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={post.image}
            alt={post.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </Link>
      <div className="flex flex-1 flex-col px-6 pb-6 pt-5">
        <p className="text-[11px] text-muted-foreground">{post.date}</p>
        <h3
          className="mt-2 text-lg font-extrabold leading-snug"
          style={{ color: NAVY }}
        >
          <Link to={`/blog/${post.slug}`} className="hover:opacity-80">
            {post.title}
          </Link>
        </h3>
        <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
          {post.excerpt}
        </p>
        <div className="mt-auto pt-5">
          <Button
            asChild
            size="sm"
            className="rounded-full text-white hover:opacity-90"
            style={{ backgroundColor: NAVY }}
          >
            <Link
              to={`/blog/${post.slug}`}
              className={`inline-flex items-center gap-2 ${
                isAr ? "flex-row-reverse" : ""
              }`}
              aria-label={`${readLabel}: ${post.title}`}
            >
              <span>{readLabel}</span>
              <ArrowIcon className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
};

/* ---------------- Blog index page ---------------- */
export const BlogIndex = () => {
  const { t, lang, dir } = useLanguage();
  const isAr = lang === "ar";
  const posts = usePosts();
  const PAGE_SIZE = 6;
  const totalPages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));
  const [page, setPage] = useState(1);

  // Real pagination — no duplicates
  const start = (page - 1) * PAGE_SIZE;
  const grid = posts.slice(start, start + PAGE_SIZE);

  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages, p + 1));
  const PrevIcon = dir === "rtl" ? ChevronRight : ChevronLeft;
  const NextIcon = dir === "rtl" ? ChevronLeft : ChevronRight;

  // Build page number list with ellipsis when needed
  const pageNumbers: (number | "…")[] = (() => {
    if (totalPages <= 7)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    const set = new Set<number>([
      1,
      2,
      totalPages - 1,
      totalPages,
      page - 1,
      page,
      page + 1,
    ]);
    const nums = [...set]
      .filter((n) => n >= 1 && n <= totalPages)
      .sort((a, b) => a - b);
    const out: (number | "…")[] = [];
    nums.forEach((n, i) => {
      if (i > 0 && n - (nums[i - 1] as number) > 1) out.push("…");
      out.push(n);
    });
    return out;
  })();

  return (
    <div className="min-h-screen bg-background pt-16">
      <Header />
      <main>
        {/* Page header (replaces hero) */}
        <section className="border-b border-border/60 bg-muted/30 py-12">
          <div
            className={`container-page ${isAr ? "text-center font-arabic" : "text-center"}`}
          >
            <span
              className="inline-block rounded-full bg-white px-4 py-1 text-xs font-semibold shadow-sm"
              style={{ color: NAVY }}
            >
              {t.blog.title}
            </span>
            <h1
              className="mx-auto mt-4 max-w-3xl text-3xl font-extrabold leading-tight sm:text-4xl"
              style={{ color: NAVY }}
            >
              {isAr
                ? "تعرّف على كل ما يساعدك على تنمية تجارتك"
                : "Everything you need to grow your business"}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {isAr
                ? "استكشف مقالات ونصائح عملية حول التجارة الإلكترونية، والتسويق، وإدارة المتاجر لتطوير أعمالك."
                : t.blog.subtitle}
            </p>
          </div>
        </section>

        {/* Grid */}
        <section className="py-14">
          <div className="container-page">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {grid.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>

            {/* Pagination — only shown when >1 page. Forced LTR for natural order. */}
            {totalPages > 1 && (
              <nav
                dir="ltr"
                aria-label="Pagination"
                className="mt-12 flex items-center justify-center gap-2"
              >
                <button
                  onClick={goPrev}
                  disabled={page === 1}
                  className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label={isAr ? "السابق" : "Previous"}
                >
                  <PrevIcon className="h-4 w-4" />
                </button>
                {pageNumbers.map((n, i) => {
                  const isActive = n === page;
                  const isDots = n === "…";
                  return (
                    <button
                      key={`${n}-${i}`}
                      onClick={() => typeof n === "number" && setPage(n)}
                      disabled={isDots}
                      aria-current={isActive ? "page" : undefined}
                      className={`grid h-9 min-w-9 place-items-center rounded-md px-3 text-sm font-semibold transition ${
                        isActive
                          ? "text-white shadow-sm"
                          : "border border-border bg-card text-foreground hover:bg-muted"
                      } ${isDots ? "cursor-default border-0 bg-transparent" : ""}`}
                      style={isActive ? { backgroundColor: NAVY } : undefined}
                    >
                      {n}
                    </button>
                  );
                })}
                <button
                  onClick={goNext}
                  disabled={page === totalPages}
                  className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label={isAr ? "التالي" : "Next"}
                >
                  <NextIcon className="h-4 w-4" />
                </button>
              </nav>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

/* ---------------- Blog detail page ---------------- */
export const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, lang, dir } = useLanguage();
  const isAr = lang === "ar";
  const posts = usePosts();
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-background pt-16">
        <Header />
        <main className="container-page py-32 text-center">
          <h1 className="text-3xl font-bold">{t.blog.notFound}</h1>
          <Button asChild className="mt-6">
            <Link to="/blog">{t.blog.backToBlog}</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const related = posts.filter((p) => p.slug !== post.slug).slice(0, 4);
  const ArrowIcon = dir === "rtl" ? ArrowUpLeft : ArrowUpRight;

  return (
    <div className="min-h-screen bg-background pt-16">
      <Header />
      <main>
        <section className="py-12">
          <div className="container-page">
            <div
              className={`grid gap-8 lg:grid-cols-[320px,1fr] ${
                isAr ? "font-arabic" : ""
              }`}
            >
              {/* Sidebar */}
              <aside
                className={`space-y-4 ${isAr ? "text-right" : "text-left"}`}
              >
                <h3 className="text-lg font-extrabold" style={{ color: NAVY }}>
                  {isAr ? "مدونات ذات صلة" : "Related articles"}
                </h3>
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    to={`/blog/${r.slug}`}
                    className="flex gap-3 rounded-2xl border border-border bg-card p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-card"
                  >
                    <div className="h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-muted">
                      <img
                        src={r.image}
                        alt={r.title}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4
                        className="line-clamp-2 text-sm font-bold leading-snug"
                        style={{ color: NAVY }}
                      >
                        {r.title}
                      </h4>
                      <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
                        {r.excerpt}
                      </p>
                    </div>
                  </Link>
                ))}

                {/* CTA */}
                <div
                  className="mt-6 rounded-2xl p-5 text-white shadow-elevated"
                  style={{
                    background: `linear-gradient(135deg, ${NAVY}, hsl(var(--brand-navy)/0.85))`,
                  }}
                >
                  <h4 className="text-lg font-extrabold">
                    {isAr
                      ? "ابدأ الآن متجرك جاهز اليوم"
                      : "Launch your store today"}
                  </h4>
                  <p className="mt-2 text-xs leading-relaxed text-white/80">
                    {isAr
                      ? "أطلق متجرك الإلكتروني في دقيقة، مصمّم للسوبر ماركت والصيدليات ومحلات الأزياء والمطاعم، بدون تعقيد."
                      : "Launch your online store in one minute. Built for grocers, pharmacies, fashion and restaurants."}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button
                      asChild
                      size="sm"
                      className="rounded-full bg-white text-[hsl(var(--brand-navy))] hover:bg-white/90"
                    >
                      <Link to="/vendor/apply">
                        {isAr ? "ابدأ متجرك الآن" : "Start your store"}
                      </Link>
                    </Button>
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="rounded-full border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
                    >
                      <a href="https://wa.me/" target="_blank" rel="noreferrer">
                        <MessageCircle className="h-4 w-4" />
                        {isAr ? "تواصل عبر الواتس" : "WhatsApp us"}
                      </a>
                    </Button>
                  </div>
                </div>
              </aside>

              {/* Main content */}
              <article className={isAr ? "text-right" : "text-left"}>
                <div className="overflow-hidden rounded-3xl bg-muted shadow-card">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="h-[420px] w-full object-cover"
                  />
                </div>

                <div className="mt-6 flex items-center gap-5 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {post.date}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    {post.readTime}
                  </span>
                </div>

                <h1
                  className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl"
                  style={{ color: NAVY }}
                >
                  {post.title}
                </h1>

                <div className="prose prose-lg mt-6 max-w-none">
                  {post.body.map((para, i) => (
                    <p
                      key={i}
                      className="mb-4 text-[15px] leading-loose text-foreground/85"
                    >
                      {para}
                    </p>
                  ))}
                </div>

                {/* Share */}
                <div
                  className={`mt-8 flex items-center gap-3 ${
                    isAr ? "flex-row-reverse justify-end" : ""
                  }`}
                >
                  <span
                    className="text-sm font-semibold"
                    style={{ color: NAVY }}
                  >
                    {isAr ? "شارك المقال :" : "Share:"}
                  </span>
                  {[Twitter, Linkedin, Instagram].map((Icon, i) => (
                    <button
                      key={i}
                      className="grid h-9 w-9 place-items-center rounded-full text-white shadow-sm transition hover:opacity-90"
                      style={{ backgroundColor: NAVY }}
                    >
                      <Icon className="h-4 w-4" />
                    </button>
                  ))}
                </div>

                {/* Back link */}
                <div className="mt-8">
                  <Link
                    to="/blog"
                    className="inline-flex items-center gap-2 text-sm font-semibold"
                    style={{ color: NAVY }}
                  >
                    <ArrowIcon className="h-4 w-4" />
                    {t.blog.backToBlog}
                  </Link>
                </div>
              </article>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};
