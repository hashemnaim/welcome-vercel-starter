import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { translations, Language, TranslationKeys } from "./translations";
import { setApiLocale } from "@/lib/shoplanserApi";

interface LanguageContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  t: TranslationKeys;
  dir: "ltr" | "rtl";
}

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined,
);

const STORAGE_KEY = "shoplancer-lang";

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Language>(() => {
    if (typeof window === "undefined") return "ar";
    const saved = localStorage.getItem(STORAGE_KEY) as Language | null;
    return saved && (saved === "ar" || saved === "en") ? saved : "ar";
  });

  const dir = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    localStorage.setItem(STORAGE_KEY, lang);
    setApiLocale(lang);
  }, [lang, dir]);

  const setLang = (l: Language) => setLangState(l);

  return (
    <LanguageContext.Provider
      value={{ lang, setLang, t: translations[lang], dir }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextValue => {
  const ctx = useContext(LanguageContext);
  if (ctx) return ctx;
  // HMR safety: during a hot-reload transition a consumer can render before
  // the new provider instance mounts. Returning a no-op default avoids
  // blanking the whole app; the next render will pick up the real provider.
  if (typeof window !== "undefined" && import.meta.env.DEV) {
    console.warn("useLanguage: no LanguageProvider in tree, using fallback");
  }
  return {
    lang: "ar",
    setLang: () => {},
    t: translations.ar,
    dir: "rtl",
  };
};
