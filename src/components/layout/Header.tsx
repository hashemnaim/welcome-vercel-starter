import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "@/lib/router-compat";
import { useLanguage } from "@/i18n/LanguageContext";
import { Menu, X, User, ChevronDown, ShoppingBag } from "lucide-react";
import shoplanserWordmark from "@/assets/shoplanser-wordmark.webp";

export const Header = () => {
  const { lang, setLang } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const isAr = lang === "ar";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => {
    const { pathname, hash } = location;
    if (href === "/") return pathname === "/" && hash !== "#pricing";
    if (href === "/#pricing") return pathname === "/" && hash === "#pricing";
    if (href === "/marketplace") return pathname.startsWith("/marketplace");
    if (href === "/blog") return pathname.startsWith("/blog");
    return pathname === href;
  };

  const navItems = [
    { label: isAr ? "الرئيسية" : "Home", href: "/" },
    { label: isAr ? "كيف تعمل؟" : "How it works", href: "/how-it-works" },
    { label: isAr ? "الباقات" : "Pricing", href: "/#pricing" },
    { label: isAr ? "المتاجر" : "Stores", href: "/marketplace" },
    { label: isAr ? "المدونة" : "Blog", href: "/blog" },
  ];

  const navy = "hsl(var(--brand-navy))";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/85 backdrop-blur-md shadow-card py-2"
          : "bg-transparent pt-5"
      }`}
    >
      <div className="container-page flex items-center justify-between gap-4">
        {/* Start side (right in RTL): CTA + profile + language */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/vendor/apply")}
            className="inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-bold text-white shadow-elevated transition-transform hover:scale-[1.03]"
            style={{ backgroundColor: navy }}
          >
            <ShoppingBag className="h-4 w-4" />
            <span className={isAr ? "font-arabic" : ""}>
              {isAr ? "أنشئ متجرك" : "Create your store"}
            </span>
          </button>

          <button
            aria-label="Account"
            className="hidden sm:inline-flex h-11 w-11 items-center justify-center rounded-full bg-white ring-1 ring-black/10 shadow-card transition hover:bg-muted"
            style={{ color: navy }}
          >
            <User className="h-4 w-4" />
          </button>

          <button
            onClick={() => setLang(isAr ? "en" : "ar")}
            aria-label="Language"
            className="hidden sm:inline-flex h-11 items-center gap-1.5 rounded-full bg-white px-2 ring-1 ring-black/10 shadow-card transition hover:bg-muted"
            style={{ color: navy }}
          >
            <ChevronDown className="h-3.5 w-3.5" />
            <span className="text-base leading-none" aria-hidden="true">
              {isAr ? "🇪🇬" : "🇺🇸"}
            </span>
          </button>
        </div>

        {/* Center nav pill */}
        <nav className="hidden md:flex items-center gap-1 rounded-full bg-white px-2 py-1.5 shadow-card ring-1 ring-black/5">
          {navItems.map((n) => {
            const active = isActive(n.href);
            return (
              <Link
                key={n.href}
                to={n.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors outline-hidden focus:outline-hidden focus-visible:outline-hidden ${
                  active ? "text-white shadow-sm" : "hover:bg-muted"
                } ${isAr ? "font-arabic" : ""}`}
                style={active ? { backgroundColor: navy } : { color: navy }}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        {/* End side (left in RTL): logo */}
        <Link
          to="/"
          aria-label="Shoplancer home"
          className="flex items-center flex-shrink-0"
        >
          <img
            src={shoplanserWordmark}
            alt="Shoplancer"
            className="h-[34px] w-auto object-contain block"
          />
        </Link>

        <button
          onClick={() => setOpen((o) => !o)}
          className="inline-flex md:hidden h-11 w-11 items-center justify-center rounded-full bg-white ring-1 ring-black/10 shadow-card"
          style={{ color: navy }}
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden container-page">
          <div className="mt-3 rounded-2xl bg-white p-3 shadow-elevated ring-1 ring-black/5">
            {navItems.map((n) => {
              const active = isActive(n.href);
              return (
                <Link
                  key={n.href}
                  to={n.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`block rounded-lg px-3 py-2 text-sm font-semibold outline-hidden focus:outline-hidden ${
                    active ? "text-white" : "hover:bg-muted"
                  } ${isAr ? "font-arabic" : ""}`}
                  style={active ? { backgroundColor: navy } : { color: navy }}
                >
                  {n.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
