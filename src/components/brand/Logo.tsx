import { useLanguage } from "@/i18n/LanguageContext";
import markLight from "@/assets/hero/mark-new.webp";
import markDark from "@/assets/hero/mark-logo.webp";

interface LogoProps {
  className?: string;
  /** Visual height in px for the mark (defaults to 36). */
  size?: number;
  /** Force a specific tone for the wordmark text. Defaults to context. */
  tone?: "auto" | "light" | "dark";
  /** Force Arabic text regardless of application language setting. */
  forceArabic?: boolean;
}

/**
 * SHOPLANCER official logo.
 * - Mark: real brand PNG (transparent background).
 * - Wordmark: rendered as text so it stays crisp and adapts to surface color.
 */
export const Logo = ({
  className = "",
  size = 36,
  tone = "auto",
  forceArabic = false,
}: LogoProps) => {
  const { lang } = useLanguage();
  const isAr = forceArabic || lang === "ar";

  const wordmarkClass = tone === "light" ? "text-white" : "text-foreground";
  const accentClass = tone === "light" ? "text-white/85" : "text-primary";

  return (
    <span
      className={`inline-flex items-center gap-2.5 ${className}`}
      aria-label={isAr ? "شوب لانسر" : "SHOPLANCER"}
    >
      <img
        src={tone === "light" ? markLight : markDark}
        alt=""
        aria-hidden="true"
        className="block flex-shrink-0 object-contain"
        style={{ height: size, width: "auto" }}
        loading="lazy"
        decoding="async"
      />
      {isAr ? (
        <span
          className="font-extrabold leading-none tracking-tight"
          style={{
            fontFamily:
              "'Tajawal', 'Cairo', 'Noto Sans Arabic', system-ui, sans-serif",
            fontSize: size * 0.55,
          }}
        >
          <span className={wordmarkClass}>شوب</span>
          <span className={`ms-1.5 ${accentClass}`}>لانسر</span>
        </span>
      ) : (
        <span
          className="font-black uppercase leading-none"
          style={{
            fontFamily: "'Rubik', system-ui, sans-serif",
            fontSize: size * 0.5,
            letterSpacing: "-0.5px",
          }}
        >
          <span className={wordmarkClass}>SHOP</span>
          <span className={accentClass}>LANCER</span>
        </span>
      )}
    </span>
  );
};
