import themeImg from "@/assets/themes/ambratwr.webp";

export type ThemeCategoryKey =
  | "all"
  | "perfumes"
  | "watches"
  | "kids"
  | "toys"
  | "fashion"
  | "beauty"
  | "furniture"
  | "electronics"
  | "gifts"
  | "supermarket"
  | "pharmacy"
  | "produce";

export interface ThemeItem {
  id: string;
  name: string;
  description: { ar: string; en: string };
  category: ThemeCategoryKey;
  categoryLabel: { ar: string; en: string };
  image: string;
  url: string;
  free?: boolean;
  accent?: string; // tailwind bg class for card background tint
}

const STORE = "https://store.shoplanser.com/ambratwr-almanja";

export const THEME_CATEGORIES: {
  key: ThemeCategoryKey;
  ar: string;
  en: string;
}[] = [
  { key: "all", ar: "الكل", en: "All" },
  { key: "supermarket", ar: "سوبر ماركت", en: "Supermarket" },
  { key: "produce", ar: "خضروات وفواكه", en: "Produce" },
  { key: "fashion", ar: "ملابس وأزياء", en: "Fashion" },
  { key: "perfumes", ar: "عطور", en: "Perfumes" },
  { key: "watches", ar: "ساعات ونظارات", en: "Watches & Glasses" },
  { key: "kids", ar: "مستلزمات الأطفال", en: "Kids" },
  { key: "toys", ar: "الألعاب والهوايات", en: "Toys & Hobbies" },
  { key: "beauty", ar: "مستحضرات تجميل", en: "Beauty" },
  { key: "furniture", ar: "الأثاث والديكور", en: "Furniture" },
  { key: "electronics", ar: "الإلكترونيات", en: "Electronics" },
  { key: "gifts", ar: "الهدايا", en: "Gifts" },
  { key: "pharmacy", ar: "صيدليات", en: "Pharmacies" },
];

export const THEMES: ThemeItem[] = [
  {
    id: "fresh-market",
    name: "Fresh Market",
    description: {
      ar: "تصميم سريع وبسيط لزيادة المبيعات",
      en: "Fast, clean design that boosts sales",
    },
    category: "supermarket",
    categoryLabel: { ar: "سوبر ماركت", en: "Supermarket" },
    image: themeImg,
    url: STORE,
    free: true,
    accent: "bg-emerald-100",
  },
  {
    id: "green-harvest",
    name: "Green Harvest",
    description: {
      ar: "ثيم خضروات وفواكه طازج وعصري",
      en: "Fresh modern produce theme",
    },
    category: "produce",
    categoryLabel: { ar: "خضروات وفواكه", en: "Produce" },
    image: themeImg,
    url: STORE,
    free: true,
    accent: "bg-lime-100",
  },
  {
    id: "elite-avyro",
    name: "ELITE AVYRO",
    description: {
      ar: "تصميم سريع وبسيط لزيادة المبيعات",
      en: "Premium fashion store template",
    },
    category: "fashion",
    categoryLabel: { ar: "ملابس وأزياء", en: "Fashion" },
    image: themeImg,
    url: STORE,
    free: true,
    accent: "bg-emerald-100",
  },
  {
    id: "pearl-perfume",
    name: "Pearl Perfume",
    description: {
      ar: "تصميم سريع وبسيط لزيادة المبيعات",
      en: "Elegant perfume showcase",
    },
    category: "perfumes",
    categoryLabel: { ar: "عطور", en: "Perfumes" },
    image: themeImg,
    url: STORE,
    free: true,
    accent: "bg-amber-100",
  },
  {
    id: "nature-glasses",
    name: "Nature Glasses",
    description: {
      ar: "تصميم سريع وبسيط لزيادة المبيعات",
      en: "Glasses & watches showcase",
    },
    category: "watches",
    categoryLabel: { ar: "ساعات ونظارات", en: "Watches & Glasses" },
    image: themeImg,
    url: STORE,
    free: true,
    accent: "bg-sky-100",
  },
  {
    id: "blast-kids",
    name: "Blast Kids",
    description: {
      ar: "ثيم مرح لمستلزمات الأطفال والألعاب",
      en: "Playful theme for kids and toys",
    },
    category: "kids",
    categoryLabel: { ar: "مستلزمات الأطفال", en: "Kids" },
    image: themeImg,
    url: STORE,
    free: true,
    accent: "bg-yellow-100",
  },
  {
    id: "glow-beauty",
    name: "Glow Beauty",
    description: {
      ar: "تصميم أنيق لمستحضرات التجميل",
      en: "Elegant beauty cosmetics theme",
    },
    category: "beauty",
    categoryLabel: { ar: "مستحضرات تجميل", en: "Beauty" },
    image: themeImg,
    url: STORE,
    free: true,
    accent: "bg-pink-100",
  },
  {
    id: "techzone",
    name: "TechZone",
    description: {
      ar: "ثيم احترافي للإلكترونيات",
      en: "Pro electronics storefront",
    },
    category: "electronics",
    categoryLabel: { ar: "الإلكترونيات", en: "Electronics" },
    image: themeImg,
    url: STORE,
    free: true,
    accent: "bg-indigo-100",
  },
];
