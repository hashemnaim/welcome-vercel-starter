import { useCallback, useEffect, useState } from "react";
import type { CategoryKey, Product, Store } from "@/data/stores";
import { iconForCategory } from "@/data/stores";

const STORAGE_KEY = "shoplancer:user-stores";
const EVENT_NAME = "shoplancer:user-stores:changed";

/** What we actually persist (functions/icons cannot be serialized). */
interface StoredStore {
  slug: string;
  name: { ar: string; en: string };
  category: CategoryKey;
  city: { ar: string; en: string };
  rating: number;
  products: number;
  /** Data URL of uploaded logo. */
  avatar?: string;
  /** Data URL of uploaded cover. */
  cover?: string;
  tagline: { ar: string; en: string };
  catalog: Product[];
  lat?: number | null;
  lng?: number | null;
  address?: string;
  planId?: string;
  themeId?: string;
  accent?: string;
  layoutId?: string;
  cornerStyle?: string;
  isUserCreated: true;
  createdAt: number;
}

const readAll = (): StoredStore[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeAll = (stores: StoredStore[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stores));
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
};

/** Inflate a stored store into a full Store object (with icon component). */
const hydrate = (
  s: StoredStore,
): Store & {
  isUserCreated: true;
  cover?: string;
  lat?: number | null;
  lng?: number | null;
  address?: string;
} => ({
  slug: s.slug,
  name: s.name,
  category: s.category,
  city: s.city,
  rating: s.rating,
  products: s.products,
  icon: iconForCategory(s.category),
  avatar: s.avatar,
  tagline: s.tagline,
  catalog: s.catalog,
  isUserCreated: true,
  cover: s.cover,
  lat: s.lat,
  lng: s.lng,
  address: s.address,
});

// Arabic → Latin transliteration map (best-effort, common letters)
const AR_MAP: Record<string, string> = {
  ا: "a",
  أ: "a",
  إ: "i",
  آ: "a",
  ب: "b",
  ت: "t",
  ث: "th",
  ج: "j",
  ح: "h",
  خ: "kh",
  د: "d",
  ذ: "th",
  ر: "r",
  ز: "z",
  س: "s",
  ش: "sh",
  ص: "s",
  ض: "d",
  ط: "t",
  ظ: "z",
  ع: "a",
  غ: "gh",
  ف: "f",
  ق: "q",
  ك: "k",
  ل: "l",
  م: "m",
  ن: "n",
  ه: "h",
  و: "w",
  ي: "y",
  ى: "a",
  ة: "h",
  ء: "",
  ئ: "y",
  ؤ: "w",
};

const transliterate = (input: string): string =>
  input
    .split("")
    .map((ch) => (AR_MAP[ch] !== undefined ? AR_MAP[ch] : ch))
    .join("");

export const slugify = (input: string): string => {
  const ascii = transliterate(input)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, ""); // strip diacritics
  return (
    ascii
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "store"
  );
};

export const uniqueSlug = (base: string, existing: string[]): string => {
  const taken = new Set(existing);
  if (!taken.has(base)) return base;
  let i = 2;
  while (taken.has(`${base}-${i}`)) i++;
  return `${base}-${i}`;
};

export const useUserStores = () => {
  const [stores, setStores] = useState<ReturnType<typeof hydrate>[]>(() =>
    readAll().map(hydrate),
  );

  useEffect(() => {
    const refresh = () => setStores(readAll().map(hydrate));
    window.addEventListener(EVENT_NAME, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(EVENT_NAME, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const addStore = useCallback(
    (store: Omit<StoredStore, "isUserCreated" | "createdAt">) => {
      const all = readAll();
      const next: StoredStore = {
        ...store,
        isUserCreated: true,
        createdAt: Date.now(),
      };
      writeAll([next, ...all]);
      return next;
    },
    [],
  );

  return { userStores: stores, addStore };
};

export const getUserStoreBySlug = (slug: string) => {
  const found = readAll().find((s) => s.slug === slug);
  return found ? hydrate(found) : undefined;
};

export const listUserStoreSlugs = () => readAll().map((s) => s.slug);
