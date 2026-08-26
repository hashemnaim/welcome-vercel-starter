import {
  Apple,
  Pill,
  Cookie,
  Shirt,
  Cpu,
  Utensils,
  ShoppingCart,
  Sparkles,
  Coffee,
  Flower2,
  type LucideIcon,
} from "lucide-react";

// Store avatars (small logos shown in marquee + cards)
import awladRizkAvatar from "@/assets/stores/awlad-rizk.webp";
import alSalamPharmacyAvatar from "@/assets/stores/al-salam-pharmacy.webp";
import cairoBakeryAvatar from "@/assets/stores/cairo-bakery.webp";
import yasmineBoutiqueAvatar from "@/assets/stores/yasmine-boutique.webp";
import techPointAvatar from "@/assets/stores/tech-point.webp";
import beitAlmaakoulatAvatar from "@/assets/stores/beit-almaakoulat.webp";
import freshMartAvatar from "@/assets/stores/fresh-mart.webp";
import halaBeautyAvatar from "@/assets/stores/hala-beauty.webp";
import burgerHouseAvatar from "@/assets/stores/burger-house.webp";
import nourPharmacyAvatar from "@/assets/stores/nour-pharmacy.webp";
import roasteryCafeAvatar from "@/assets/stores/roastery-cafe.webp";
import petalsFloristAvatar from "@/assets/stores/petals-florist.webp";

export type CategoryKey =
  | "all"
  | "grocery"
  | "pharmacy"
  | "bakery"
  | "fashion"
  | "electronics"
  | "restaurants"
  | "supermarket"
  | "beauty"
  | "cafe"
  | "flowers";

export interface Product {
  id: string;
  name: { ar: string; en: string };
  unit: { ar: string; en: string };
  price: number;
  oldPrice?: number;
  tag?: "new" | "offer";
}

export interface Store {
  slug: string;
  name: { ar: string; en: string };
  category: CategoryKey;
  city: { ar: string; en: string };
  rating: number;
  products: number;
  icon: LucideIcon;
  /** Optional avatar/logo URL. Falls back to `icon` when absent. */
  avatar?: string;
  tagline: { ar: string; en: string };
  catalog: Product[];
}

const groceryCatalog: Product[] = [
  {
    id: "tomato",
    name: { ar: "طماطم طازجة", en: "Fresh Tomato" },
    unit: { ar: "1 كجم", en: "1 kg" },
    price: 18,
    oldPrice: 24,
    tag: "offer",
  },
  {
    id: "milk",
    name: { ar: "حليب كامل الدسم", en: "Whole Milk" },
    unit: { ar: "1 لتر", en: "1 L" },
    price: 32,
  },
  {
    id: "bread",
    name: { ar: "خبز بلدي", en: "Baladi Bread" },
    unit: { ar: "5 أرغفة", en: "5 loaves" },
    price: 10,
    tag: "new",
  },
  {
    id: "eggs",
    name: { ar: "بيض بلدي", en: "Farm Eggs" },
    unit: { ar: "10 حبات", en: "10 pcs" },
    price: 55,
    oldPrice: 65,
    tag: "offer",
  },
  {
    id: "rice",
    name: { ar: "أرز مصري", en: "Egyptian Rice" },
    unit: { ar: "1 كجم", en: "1 kg" },
    price: 42,
  },
  {
    id: "oil",
    name: { ar: "زيت دوار الشمس", en: "Sunflower Oil" },
    unit: { ar: "1 لتر", en: "1 L" },
    price: 78,
    tag: "new",
  },
  {
    id: "sugar",
    name: { ar: "سكر أبيض", en: "White Sugar" },
    unit: { ar: "1 كجم", en: "1 kg" },
    price: 35,
  },
  {
    id: "cheese",
    name: { ar: "جبنة بيضاء", en: "White Cheese" },
    unit: { ar: "250 جم", en: "250 g" },
    price: 48,
    oldPrice: 60,
    tag: "offer",
  },
];

const pharmacyCatalog: Product[] = [
  {
    id: "panadol",
    name: { ar: "بنادول إكسترا", en: "Panadol Extra" },
    unit: { ar: "24 قرص", en: "24 tabs" },
    price: 35,
  },
  {
    id: "vitc",
    name: { ar: "فيتامين سي 1000", en: "Vitamin C 1000" },
    unit: { ar: "30 قرص", en: "30 tabs" },
    price: 95,
    oldPrice: 120,
    tag: "offer",
  },
  {
    id: "mask",
    name: { ar: "كمامات طبية", en: "Surgical Masks" },
    unit: { ar: "50 قطعة", en: "50 pcs" },
    price: 65,
    tag: "new",
  },
  {
    id: "alcohol",
    name: { ar: "كحول طبي", en: "Medical Alcohol" },
    unit: { ar: "500 مل", en: "500 ml" },
    price: 28,
  },
  {
    id: "thermo",
    name: { ar: "ترمومتر رقمي", en: "Digital Thermometer" },
    unit: { ar: "قطعة", en: "1 pc" },
    price: 145,
    oldPrice: 180,
    tag: "offer",
  },
  {
    id: "syrup",
    name: { ar: "شراب كحة للأطفال", en: "Kids Cough Syrup" },
    unit: { ar: "120 مل", en: "120 ml" },
    price: 52,
  },
];

const bakeryCatalog: Product[] = [
  {
    id: "croissant",
    name: { ar: "كرواسون بالشوكولاتة", en: "Chocolate Croissant" },
    unit: { ar: "قطعة", en: "1 pc" },
    price: 22,
    tag: "new",
  },
  {
    id: "cake",
    name: { ar: "كيكة فانيليا", en: "Vanilla Cake" },
    unit: { ar: "500 جم", en: "500 g" },
    price: 120,
    oldPrice: 150,
    tag: "offer",
  },
  {
    id: "donut",
    name: { ar: "دونات سكر", en: "Sugar Donut" },
    unit: { ar: "قطعة", en: "1 pc" },
    price: 15,
  },
  {
    id: "baguette",
    name: { ar: "خبز فرنسي", en: "French Baguette" },
    unit: { ar: "قطعة", en: "1 pc" },
    price: 25,
  },
  {
    id: "muffin",
    name: { ar: "مافن توت", en: "Berry Muffin" },
    unit: { ar: "قطعة", en: "1 pc" },
    price: 18,
    tag: "new",
  },
  {
    id: "cookies",
    name: { ar: "كوكيز شوكولاتة", en: "Chocolate Cookies" },
    unit: { ar: "200 جم", en: "200 g" },
    price: 45,
    oldPrice: 55,
    tag: "offer",
  },
];

const fashionCatalog: Product[] = [
  {
    id: "shirt",
    name: { ar: "قميص قطن", en: "Cotton Shirt" },
    unit: { ar: "قطعة", en: "1 pc" },
    price: 350,
    oldPrice: 450,
    tag: "offer",
  },
  {
    id: "jeans",
    name: { ar: "بنطلون جينز", en: "Denim Jeans" },
    unit: { ar: "قطعة", en: "1 pc" },
    price: 520,
  },
  {
    id: "dress",
    name: { ar: "فستان صيفي", en: "Summer Dress" },
    unit: { ar: "قطعة", en: "1 pc" },
    price: 680,
    tag: "new",
  },
  {
    id: "shoes",
    name: { ar: "حذاء رياضي", en: "Sneakers" },
    unit: { ar: "زوج", en: "1 pair" },
    price: 850,
    oldPrice: 1100,
    tag: "offer",
  },
  {
    id: "bag",
    name: { ar: "حقيبة يد", en: "Handbag" },
    unit: { ar: "قطعة", en: "1 pc" },
    price: 420,
    tag: "new",
  },
  {
    id: "scarf",
    name: { ar: "وشاح حريري", en: "Silk Scarf" },
    unit: { ar: "قطعة", en: "1 pc" },
    price: 180,
  },
];

const electronicsCatalog: Product[] = [
  {
    id: "earbuds",
    name: { ar: "سماعات لاسلكية", en: "Wireless Earbuds" },
    unit: { ar: "قطعة", en: "1 pc" },
    price: 850,
    oldPrice: 1200,
    tag: "offer",
  },
  {
    id: "charger",
    name: { ar: "شاحن سريع 20 وات", en: "Fast Charger 20W" },
    unit: { ar: "قطعة", en: "1 pc" },
    price: 220,
  },
  {
    id: "cable",
    name: { ar: "كابل USB-C", en: "USB-C Cable" },
    unit: { ar: "1 متر", en: "1 m" },
    price: 75,
    tag: "new",
  },
  {
    id: "powerbank",
    name: { ar: "باور بانك 10000", en: "Power Bank 10000" },
    unit: { ar: "قطعة", en: "1 pc" },
    price: 480,
    oldPrice: 600,
    tag: "offer",
  },
  {
    id: "mouse",
    name: { ar: "ماوس لاسلكي", en: "Wireless Mouse" },
    unit: { ar: "قطعة", en: "1 pc" },
    price: 320,
  },
  {
    id: "keyboard",
    name: { ar: "كيبورد ميكانيكي", en: "Mechanical Keyboard" },
    unit: { ar: "قطعة", en: "1 pc" },
    price: 1450,
    tag: "new",
  },
];

const restaurantCatalog: Product[] = [
  {
    id: "burger",
    name: { ar: "برجر لحم مشوي", en: "Grilled Beef Burger" },
    unit: { ar: "وجبة", en: "1 meal" },
    price: 145,
    tag: "new",
  },
  {
    id: "pizza",
    name: { ar: "بيتزا مارجريتا", en: "Margherita Pizza" },
    unit: { ar: "وسط", en: "Medium" },
    price: 180,
    oldPrice: 220,
    tag: "offer",
  },
  {
    id: "shawarma",
    name: { ar: "شاورما دجاج", en: "Chicken Shawarma" },
    unit: { ar: "ساندويتش", en: "1 sandwich" },
    price: 75,
  },
  {
    id: "salad",
    name: { ar: "سلطة سيزر", en: "Caesar Salad" },
    unit: { ar: "طبق", en: "1 plate" },
    price: 95,
  },
  {
    id: "pasta",
    name: { ar: "باستا الفريدو", en: "Alfredo Pasta" },
    unit: { ar: "طبق", en: "1 plate" },
    price: 165,
    oldPrice: 195,
    tag: "offer",
  },
  {
    id: "fries",
    name: { ar: "بطاطس مقلية", en: "French Fries" },
    unit: { ar: "وسط", en: "Medium" },
    price: 45,
  },
];

const beautyCatalog: Product[] = [
  {
    id: "lipstick",
    name: { ar: "أحمر شفاه مات", en: "Matte Lipstick" },
    unit: { ar: "قطعة", en: "1 pc" },
    price: 220,
    tag: "new",
  },
  {
    id: "foundation",
    name: { ar: "كريم أساس", en: "Foundation" },
    unit: { ar: "30 مل", en: "30 ml" },
    price: 380,
    oldPrice: 480,
    tag: "offer",
  },
  {
    id: "perfume",
    name: { ar: "عطر فلورال", en: "Floral Perfume" },
    unit: { ar: "50 مل", en: "50 ml" },
    price: 650,
  },
  {
    id: "mascara",
    name: { ar: "ماسكارا مكثفة", en: "Volume Mascara" },
    unit: { ar: "قطعة", en: "1 pc" },
    price: 195,
  },
];

const cafeCatalog: Product[] = [
  {
    id: "latte",
    name: { ar: "لاتيه ساخن", en: "Hot Latte" },
    unit: { ar: "وسط", en: "Medium" },
    price: 55,
  },
  {
    id: "cappuccino",
    name: { ar: "كابتشينو", en: "Cappuccino" },
    unit: { ar: "وسط", en: "Medium" },
    price: 50,
    tag: "new",
  },
  {
    id: "espresso",
    name: { ar: "إسبريسو دبل", en: "Double Espresso" },
    unit: { ar: "كوب", en: "1 cup" },
    price: 40,
  },
  {
    id: "icedcoffee",
    name: { ar: "قهوة مثلجة", en: "Iced Coffee" },
    unit: { ar: "كبير", en: "Large" },
    price: 65,
    oldPrice: 80,
    tag: "offer",
  },
  {
    id: "cheesecake",
    name: { ar: "تشيز كيك", en: "Cheesecake" },
    unit: { ar: "قطعة", en: "1 slice" },
    price: 75,
  },
];

const flowersCatalog: Product[] = [
  {
    id: "roses",
    name: { ar: "باقة ورد أحمر", en: "Red Rose Bouquet" },
    unit: { ar: "12 وردة", en: "12 stems" },
    price: 350,
    oldPrice: 420,
    tag: "offer",
  },
  {
    id: "tulips",
    name: { ar: "توليب ملوّن", en: "Mixed Tulips" },
    unit: { ar: "10 زهور", en: "10 stems" },
    price: 280,
    tag: "new",
  },
  {
    id: "lily",
    name: { ar: "زنبق أبيض", en: "White Lily" },
    unit: { ar: "5 زهور", en: "5 stems" },
    price: 220,
  },
  {
    id: "sunflower",
    name: { ar: "عباد الشمس", en: "Sunflowers" },
    unit: { ar: "7 زهور", en: "7 stems" },
    price: 195,
  },
];

const supermarketCatalog: Product[] = [
  ...groceryCatalog,
  {
    id: "shampoo",
    name: { ar: "شامبو 400 مل", en: "Shampoo 400ml" },
    unit: { ar: "زجاجة", en: "1 bottle" },
    price: 95,
    tag: "new",
  },
  {
    id: "detergent",
    name: { ar: "مسحوق غسيل", en: "Laundry Detergent" },
    unit: { ar: "2 كجم", en: "2 kg" },
    price: 145,
    oldPrice: 180,
    tag: "offer",
  },
];

export const STORES: Store[] = [
  {
    slug: "awlad-rizk",
    name: { ar: "أولاد رزق", en: "Awlad Rizk" },
    category: "grocery",
    city: { ar: "القاهرة", en: "Cairo" },
    rating: 4.9,
    products: 320,
    icon: ShoppingCart,
    avatar: awladRizkAvatar,
    tagline: {
      ar: "بقالة العائلة منذ 1995",
      en: "Your family grocer since 1995",
    },
    catalog: groceryCatalog,
  },
  {
    slug: "al-salam-pharmacy",
    name: { ar: "صيدلية السلام", en: "Al-Salam Pharmacy" },
    category: "pharmacy",
    city: { ar: "الجيزة", en: "Giza" },
    rating: 4.8,
    products: 540,
    icon: Pill,
    avatar: alSalamPharmacyAvatar,
    tagline: { ar: "صحتك أولويتنا", en: "Your health, our priority" },
    catalog: pharmacyCatalog,
  },
  {
    slug: "cairo-bakery",
    name: { ar: "مخبز القاهرة", en: "Cairo Bakery" },
    category: "bakery",
    city: { ar: "القاهرة", en: "Cairo" },
    rating: 4.7,
    products: 80,
    icon: Cookie,
    avatar: cairoBakeryAvatar,
    tagline: { ar: "طازج كل صباح", en: "Fresh every morning" },
    catalog: bakeryCatalog,
  },
  {
    slug: "yasmine-boutique",
    name: { ar: "بوتيك ياسمين", en: "Yasmine Boutique" },
    category: "fashion",
    city: { ar: "الإسكندرية", en: "Alexandria" },
    rating: 4.6,
    products: 210,
    icon: Shirt,
    avatar: yasmineBoutiqueAvatar,
    tagline: { ar: "أناقة لا تُضاهى", en: "Unmatched elegance" },
    catalog: fashionCatalog,
  },
  {
    slug: "tech-point",
    name: { ar: "تك بوينت", en: "Tech Point" },
    category: "electronics",
    city: { ar: "القاهرة", en: "Cairo" },
    rating: 4.5,
    products: 180,
    icon: Cpu,
    avatar: techPointAvatar,
    tagline: { ar: "أحدث التقنيات بين يديك", en: "Latest tech in your hands" },
    catalog: electronicsCatalog,
  },
  {
    slug: "beit-almaakoulat",
    name: { ar: "بيت المأكولات", en: "Beit Al-Maakoulat" },
    category: "restaurants",
    city: { ar: "المنصورة", en: "Mansoura" },
    rating: 4.8,
    products: 120,
    icon: Utensils,
    avatar: beitAlmaakoulatAvatar,
    tagline: { ar: "نكهات أصيلة", en: "Authentic flavors" },
    catalog: restaurantCatalog,
  },
  {
    slug: "fresh-mart",
    name: { ar: "فريش مارت", en: "Fresh Mart" },
    category: "supermarket",
    city: { ar: "الجيزة", en: "Giza" },
    rating: 4.9,
    products: 1200,
    icon: Apple,
    avatar: freshMartAvatar,
    tagline: {
      ar: "كل ما تحتاجه تحت سقف واحد",
      en: "Everything under one roof",
    },
    catalog: supermarketCatalog,
  },
  {
    slug: "hala-beauty",
    name: { ar: "هلا بيوتي", en: "Hala Beauty" },
    category: "beauty",
    city: { ar: "القاهرة", en: "Cairo" },
    rating: 4.7,
    products: 95,
    icon: Sparkles,
    avatar: halaBeautyAvatar,
    tagline: { ar: "جمالك يستحق الأفضل", en: "Your beauty deserves the best" },
    catalog: beautyCatalog,
  },
  {
    slug: "burger-house",
    name: { ar: "برجر هاوس", en: "Burger House" },
    category: "restaurants",
    city: { ar: "أسيوط", en: "Asyut" },
    rating: 4.6,
    products: 60,
    icon: Utensils,
    avatar: burgerHouseAvatar,
    tagline: { ar: "برجر مشوي على الفحم", en: "Charcoal-grilled burgers" },
    catalog: restaurantCatalog,
  },
  {
    slug: "nour-pharmacy",
    name: { ar: "صيدلية نور", en: "Nour Pharmacy" },
    category: "pharmacy",
    city: { ar: "طنطا", en: "Tanta" },
    rating: 4.8,
    products: 410,
    icon: Pill,
    avatar: nourPharmacyAvatar,
    tagline: { ar: "خدمة 24 ساعة", en: "24/7 service" },
    catalog: pharmacyCatalog,
  },
  {
    slug: "roastery-cafe",
    name: { ar: "مقهى الرواستري", en: "Roastery Café" },
    category: "cafe",
    city: { ar: "القاهرة", en: "Cairo" },
    rating: 4.9,
    products: 45,
    icon: Coffee,
    avatar: roasteryCafeAvatar,
    tagline: { ar: "بن محمص يومياً", en: "Daily roasted beans" },
    catalog: cafeCatalog,
  },
  {
    slug: "petals-florist",
    name: { ar: "بتلات للورود", en: "Petals Florist" },
    category: "flowers",
    city: { ar: "الإسكندرية", en: "Alexandria" },
    rating: 4.7,
    products: 70,
    icon: Flower2,
    avatar: petalsFloristAvatar,
    tagline: { ar: "ورود لكل المناسبات", en: "Flowers for every occasion" },
    catalog: flowersCatalog,
  },
];

export const getStoreBySlug = (slug: string) =>
  STORES.find((s) => s.slug === slug);

/** Default icon to use for a category when a store has no avatar — used by user-created stores. */
export const iconForCategory = (category: CategoryKey): LucideIcon => {
  switch (category) {
    case "grocery":
      return ShoppingCart;
    case "supermarket":
      return Apple;
    case "pharmacy":
      return Pill;
    case "bakery":
      return Cookie;
    case "fashion":
      return Shirt;
    case "electronics":
      return Cpu;
    case "restaurants":
      return Utensils;
    case "beauty":
      return Sparkles;
    case "cafe":
      return Coffee;
    case "flowers":
      return Flower2;
    case "all":
    default:
      return ShoppingCart;
  }
};
