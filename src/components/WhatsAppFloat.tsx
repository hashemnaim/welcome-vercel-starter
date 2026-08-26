import { useLocation } from "@/lib/router-compat";
import { useLanguage } from "@/i18n/LanguageContext";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Business WhatsApp (international format, no +)
const WHATSAPP_NUMBER = "201080130569";

// Routes where the WhatsApp button should be hidden
const HIDDEN_PATHS: string[] = ["/vendor/apply"];

export const WhatsAppFloat = () => {
  const { lang } = useLanguage();
  const location = useLocation();
  const isAr = lang === "ar";

  if (HIDDEN_PATHS.includes(location.pathname)) return null;

  const message = encodeURIComponent(
    isAr ? "اهلا وسهلا بك في منصة شوب لانسر" : "Welcome to Shoplancer platform",
  );
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
  const label = isAr ? "تواصل عبر واتساب" : "Chat on WhatsApp";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          dir="ltr"
          className="group fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_-6px_rgba(37,211,102,0.55)] ring-1 ring-white/30 transition-all hover:scale-110 hover:shadow-[0_14px_36px_-6px_rgba(37,211,102,0.7)] active:scale-95 sm:bottom-6 sm:h-14 sm:w-14 md:h-16 md:w-16"
        >
          <span
            className="absolute inset-0 rounded-full bg-[#25D366] opacity-60 animate-ping"
            aria-hidden="true"
          />
          <svg
            viewBox="0 0 32 32"
            className="relative h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M16.002 3.2c-7.07 0-12.8 5.73-12.8 12.8 0 2.26.6 4.46 1.73 6.4L3.2 28.8l6.58-1.72a12.77 12.77 0 0 0 6.22 1.6h.01c7.06 0 12.8-5.73 12.8-12.8 0-3.42-1.33-6.63-3.75-9.05A12.7 12.7 0 0 0 16.002 3.2zm0 23.36h-.01a10.6 10.6 0 0 1-5.41-1.48l-.39-.23-3.9 1.02 1.04-3.8-.25-.4a10.6 10.6 0 0 1-1.63-5.67c0-5.87 4.78-10.65 10.66-10.65 2.85 0 5.52 1.11 7.53 3.13a10.58 10.58 0 0 1 3.12 7.53c0 5.88-4.78 10.65-10.66 10.65zm5.84-7.98c-.32-.16-1.9-.94-2.19-1.05-.29-.11-.5-.16-.72.16-.21.32-.82 1.05-1.01 1.27-.19.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.59-.95-.85-1.59-1.9-1.78-2.22-.19-.32-.02-.49.14-.65.14-.14.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.72-1.74-.99-2.39-.26-.62-.53-.54-.72-.55l-.62-.01c-.21 0-.56.08-.85.4-.29.32-1.11 1.09-1.11 2.65 0 1.56 1.14 3.07 1.3 3.28.16.21 2.24 3.42 5.43 4.79.76.33 1.35.52 1.81.67.76.24 1.45.21 2 .13.61-.09 1.9-.78 2.17-1.53.27-.75.27-1.39.19-1.53-.08-.13-.29-.21-.61-.37z" />
          </svg>
        </a>
      </TooltipTrigger>
      <TooltipContent side="left" sideOffset={10} className="font-medium">
        {label}
      </TooltipContent>
    </Tooltip>
  );
};

export default WhatsAppFloat;
