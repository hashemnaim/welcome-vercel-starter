import { useState, useEffect } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Link } from "@/lib/router-compat";
import {
  Linkedin,
  Youtube,
  Instagram,
  Mail,
  Phone,
  MessageCircle,
} from "lucide-react";
import appStoreIcon from "@/assets/stores/app-store-icon.jpg";
import googlePlayIcon from "@/assets/stores/google-play-icon.png";
import { Logo } from "@/components/brand/Logo";
import wordmark from "@/assets/footer/wordmark.webp";
import { fetchConfig, type ApiConfig } from "@/lib/shoplanserApi";

const XIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden
  >
    <path d="M18.244 2H21.5l-7.5 8.573L23 22h-6.844l-5.36-6.99L4.6 22H1.34l8.02-9.164L1 2h6.99l4.844 6.4L18.244 2Zm-1.2 18h1.9L7.05 4H5.05l12 16Z" />
  </svg>
);

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden
  >
    <path d="M19.6 6.3a5.5 5.5 0 0 1-3.3-1.1V15a5.7 5.7 0 1 1-5.7-5.7c.3 0 .6 0 .9.1v3a2.7 2.7 0 1 0 1.9 2.6V2h2.9a5.5 5.5 0 0 0 3.3 4.3v0Z" />
  </svg>
);

export const Footer = () => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";

  const [config, setConfig] = useState<ApiConfig | null>(null);

  useEffect(() => {
    fetchConfig().then(setConfig);
  }, []);

  const defaultPlayStoreUrl =
    "https://play.google.com/store/apps/details?id=com.zahed.shoplanser";
  const defaultAppleStoreUrl =
    "https://apps.apple.com/us/app/%D8%B4%D9%88%D8%A8-%D9%84%D8%A7%D9%86%D8%B3%D8%B1-%D8%A7%D9%84%D8%AA%D8%A7%D8%AC%D8%B1/id6788907378";

  const playStoreUrl = config
    ? config.download_user_app_links?.playstore_url_status === "1" &&
      config.download_user_app_links?.playstore_url
      ? config.download_user_app_links.playstore_url
      : defaultPlayStoreUrl
    : defaultPlayStoreUrl;

  const appleStoreUrl = config
    ? config.download_user_app_links?.apple_store_url_status === "1" &&
      config.download_user_app_links?.apple_store_url
      ? config.download_user_app_links.apple_store_url
      : defaultAppleStoreUrl
    : defaultAppleStoreUrl;

  const contactItems = [
    {
      Icon: Phone,
      label: isAr ? "الهاتف" : "Phone",
      value: "+20 103 685 0264",
      href: "tel:+201036850264",
    },
    {
      Icon: MessageCircle,
      label: isAr ? "واتساب" : "WhatsApp",
      value: isAr ? "مراسلة مباشرة" : "Chat with us",
      href: "https://wa.me/201036850264",
    },
    {
      Icon: Mail,
      label: isAr ? "البريد الإلكتروني" : "Email",
      value: "support@shoplancer.com",
      href: "mailto:support@shoplancer.com",
    },
  ];

  const legalLinks = [
    {
      label: isAr ? "سياسة الخصوصية" : "Privacy policy",
      href: "/legal/privacy",
    },
    {
      label: isAr ? "سياسة الاسترداد" : "Refund policy",
      href: "/legal/refund",
    },
    {
      label: isAr ? "الشروط والأحكام" : "Terms & conditions",
      href: "/legal/terms",
    },
  ];

  const cols = [
    { title: isAr ? "تواصل معنا" : "Contact us" },
    {
      title: isAr ? "عن شوب لانسر" : "About Shoplanser",
      intro: isAr
        ? "منصة شوب لانسر تساعد التجار والمتاجر في بناء متجر إلكتروني احترافي وإدارة المنتجات والطلبات بكل سهولة، لنقل عملك من المحل إلى الإنترنت في دقائق."
        : "Shoplanser helps merchants and stores build a professional online store, manage products and orders with ease, and take your business from local to online in minutes.",
      links: [
        { label: isAr ? "الرئيسية" : "Home", href: "/" },
        { label: isAr ? "الباقات" : "Pricing", href: "/#pricing" },
        { label: isAr ? "المتاجر" : "Stores", href: "/marketplace" },
        { label: isAr ? "المدونة" : "Blog", href: "/blog" },
      ],
    },
  ];

  return (
    <footer
      className="relative overflow-hidden text-white"
      dir={isAr ? "rtl" : "ltr"}
      style={{
        background:
          "linear-gradient(135deg, hsl(var(--brand-navy-deep)) 0%, hsl(var(--brand-navy)) 100%)",
      }}
    >
      {/* Golden radial glows top corners */}
      <div
        className="pointer-events-none absolute -top-24 -left-24 h-[380px] w-[380px] rounded-full opacity-60"
        style={{
          background:
            "radial-gradient(circle, rgba(212,175,55,0.55) 0%, rgba(212,175,55,0) 65%)",
        }}
      />
      <div
        className="pointer-events-none absolute -top-24 -right-24 h-[380px] w-[380px] rounded-full opacity-60"
        style={{
          background:
            "radial-gradient(circle, rgba(212,175,55,0.55) 0%, rgba(212,175,55,0) 65%)",
        }}
      />

      {/* Big translucent wordmark behind */}
      <img
        src={wordmark}
        alt=""
        aria-hidden
        className="pointer-events-none absolute left-1/2 bottom-16 w-[110%] max-w-none -translate-x-1/2 opacity-[0.10] select-none"
        loading="lazy"
        decoding="async"
      />

      <div className="container-page relative py-16">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Links col 1 — Contact */}
          <div className={isAr ? "font-arabic text-start" : "text-start"}>
            <h4 className="text-sm font-bold text-white">{cols[0].title}</h4>
            <ul className="mt-5 space-y-4">
              {contactItems.map(({ Icon, label, value, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noreferrer" : undefined}
                    dir="ltr"
                    className={`group flex items-center gap-3 ${isAr ? "flex-row-reverse text-right" : "text-left"}`}
                  >
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white ring-1 ring-white/15 transition-colors group-hover:bg-white/20">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="flex flex-col">
                      <span className="text-[11px] uppercase tracking-wide text-white/50">
                        {label}
                      </span>
                      <span className="text-sm text-white/85 transition-colors group-hover:text-white">
                        {value}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <Link
              to="/contact"
              className="mt-6 inline-flex items-center justify-center rounded-lg bg-white/10 px-4 py-2.5 text-sm font-semibold text-white ring-1 ring-white/20 transition-colors hover:bg-white/20"
            >
              {isAr ? "أرسل طلب دعم" : "Send a support request"}
            </Link>
          </div>

          {/* Links col 2 — About */}
          <div className={isAr ? "font-arabic text-start" : "text-start"}>
            <h4 className="text-sm font-bold text-white">{cols[1].title}</h4>
            <p className="mt-3 max-w-[260px] text-sm leading-relaxed text-white/75">
              {cols[1].intro}
            </p>
            <ul className="mt-5 space-y-3">
              {(cols[1].links ?? []).map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.href}
                    className="text-sm text-white/75 hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Download app */}
          <div className={isAr ? "font-arabic text-start" : "text-start"}>
            <h4 className="text-sm font-bold text-white">
              {isAr ? "حمل التطبيق" : "Download the app"}
            </h4>
            <div className="mt-5 flex flex-wrap gap-3">
              {appleStoreUrl && (
                <a
                  href={appleStoreUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="App Store"
                  className="group inline-flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-white/40 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-xl"
                >
                  <img
                    src={appStoreIcon}
                    alt="App Store"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </a>
              )}
              {playStoreUrl && (
                <a
                  href={playStoreUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Google Play"
                  className="group inline-flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-white p-2 shadow-lg ring-1 ring-white/40 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-xl"
                >
                  <img
                    src={googlePlayIcon}
                    alt="Google Play"
                    className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-110"
                  />
                </a>
              )}
            </div>
          </div>

          {/* Brand + socials */}
          <div className={`${isAr ? "font-arabic text-start" : "text-start"}`}>
            <Link
              to="/"
              aria-label="Shoplanser home"
              className="inline-flex items-center"
            >
              <Logo size={42} tone="light" />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/75">
              {isAr
                ? "ابنِ متجرك في دقيقة وابدأ الطريقة الأبسط لنقل محلك المحلي إلى الإنترنت."
                : "Build your store in a minute and take your local shop online the easy way."}
            </p>
            <div className="mt-5 flex items-center gap-2">
              {[
                { Icon: Linkedin, label: "LinkedIn" },
                { Icon: XIcon, label: "X" },
                { Icon: Youtube, label: "YouTube" },
                { Icon: Instagram, label: "Instagram" },
                { Icon: TikTokIcon, label: "TikTok" },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white ring-1 ring-white/15 transition-colors hover:bg-white/20"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div
          className={`relative mt-14 flex flex-col items-center gap-4 border-t border-white/10 pt-6 text-xs text-white/60 md:flex-row md:justify-between ${isAr ? "font-arabic" : ""}`}
        >
          <p>
            © {new Date().getFullYear()}{" "}
            {isAr
              ? "شركة شوب لانسر - جميع الحقوق محفوظة"
              : "Shoplanser. All rights reserved."}
          </p>
          <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {legalLinks.map((l) => (
              <Link
                key={l.href}
                to={l.href}
                className="transition-colors hover:text-white"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
};
