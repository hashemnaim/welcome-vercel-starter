import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock3,
  Crown,
  ImagePlus,
  Loader2,
  LockKeyhole,
  LogIn,
  MapPin,
  Palette,
  ShieldCheck,
  Sparkles,
  Store,
  Tag,
  Truck,
  Upload,
  User,
} from "lucide-react";

import {
  StoreLocationPicker,
  type MapValue,
} from "@/components/maps/StoreLocationPicker";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/i18n/LanguageContext";
import {
  checkSlug,
  fetchCategories,
  fetchModules,
  fetchZones,
  registerStore,
  type ApiCategory,
  type ApiModule,
  type ApiZone,
} from "@/lib/shoplanserApi";
import { Link, useLocation, useNavigate } from "@/lib/router-compat";

type StepKey =
  "store" | "location" | "delivery" | "categories" | "plan" | "account";

type SlugStatus = "idle" | "checking" | "available" | "taken" | "error";

const STORE_COLORS = [
  "#1e3a8a",
  "#4f46e5",
  "#10b981",
  "#f43f5e",
  "#f59e0b",
  "#0ea5e9",
  "#8b5cf6",
  "#14b8a6",
  "#f97316",
  "#475569",
];

const DELIVERY_CURRENCIES = [
  { value: "EGP", en: "Egyptian pound", ar: "جنيه" },
  { value: "USD", en: "US dollar", ar: "دولار" },
  { value: "SAR", en: "Saudi riyal", ar: "ريال" },
  { value: "ILS", en: "Israeli shekel", ar: "شيكل" },
  { value: "JOD", en: "Jordanian dinar", ar: "دينار" },
  { value: "AED", en: "UAE dirham", ar: "درهم إماراتي" },
];

const DEFAULT_LOCATION: MapValue = {
  lat: 30.0444,
  lng: 31.2357,
  address: "Cairo, Egypt",
};

const tx = (lang: "en" | "ar", en: string, ar: string) =>
  lang === "ar" ? ar : en;

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

const ARABIC_FRANCO_MAP: Record<string, string> = {
  ا: "a",
  أ: "a",
  إ: "e",
  آ: "a",
  ب: "b",
  ت: "t",
  ث: "th",
  ج: "g",
  ح: "h",
  خ: "kh",
  د: "d",
  ذ: "z",
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
  ة: "a",
  و: "w",
  ؤ: "w",
  ي: "y",
  ى: "a",
  ئ: "y",
  ء: "",
};

const arabicToFranco = (value: string) =>
  Array.from(value.replace(/لا/g, "la").replace(/[ًٌٍَُِّْـ]/g, ""))
    .map((char) => ARABIC_FRANCO_MAP[char] ?? char)
    .join("");

const toStoreSlug = (value: string) => slugify(arabicToFranco(value));

const splitFullName = (fullName: string) => {
  const parts = fullName.trim().split(/\s+/);
  const first = parts.shift() ?? "";
  return {
    f_name: first,
    l_name: parts.join(" ") || first,
  };
};

const normalizeEgPhone = (raw: string): string | null => {
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("0020")) digits = digits.slice(4);
  if (digits.startsWith("20")) digits = digits.slice(2);
  if (digits.startsWith("0")) digits = digits.slice(1);
  if (!/^1\d{9}$/.test(digits)) return null;
  return digits;
};

const VendorApplyV2 = () => {
  const { lang, setLang, dir } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const state = (location.state ?? null) as {
    businessPlan?: "commission" | "subscription";
    packageId?: string;
  } | null;

  const [step, setStep] = useState<StepKey>("store");
  const [zones, setZones] = useState<ApiZone[]>([]);
  const [modules, setModules] = useState<ApiModule[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loadingZones, setLoadingZones] = useState(true);
  const [loadingModules, setLoadingModules] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [slugStatus, setSlugStatus] = useState<SlugStatus>("idle");
  const [slugMessage, setSlugMessage] = useState("");
  const [mapValue, setMapValue] = useState<MapValue | null>(null);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [inlineError, setInlineError] = useState("");

  const [form, setForm] = useState({
    storeName: "",
    slug: "",
    color: STORE_COLORS[0],
    logo: null as File | null,
    deliveryPrice: "20",
    deliveryCurrency: "EGP",
    minDelivery: "20",
    maxDelivery: "60",
    deliveryUnit: "minute",
    openingTime: "08:00",
    closingTime: "00:00",
    isOpen24Hours: false,
    zoneId: "",
    moduleId: "",
    address: "",
    categoryIds: [] as string[],
    businessPlan:
      state?.businessPlan ?? ("commission" as "commission" | "subscription"),
    packageId: state?.businessPlan === "subscription" ? "6m" : "",
    ownerFullName: "",
    ownerEmail: "",
    ownerPhone: "",
    ownerPassword: "",
    ownerPasswordConfirm: "",
  });

  const steps: { key: StepKey; label: string; icon: typeof Store }[] = [
    { key: "store", label: tx(lang, "Store", "المتجر"), icon: Store },
    {
      key: "location",
      label: tx(lang, "Location & activity", "الموقع والنشاط"),
      icon: MapPin,
    },
    { key: "delivery", label: tx(lang, "Delivery", "التوصيل"), icon: Truck },
    {
      key: "categories",
      label: tx(lang, "Categories", "الأصناف"),
      icon: Tag,
    },
    { key: "plan", label: tx(lang, "Plan", "الباقة"), icon: Crown },
    { key: "account", label: tx(lang, "Account", "الحساب"), icon: User },
  ];

  const stepIndex = steps.findIndex((item) => item.key === step);
  const progressPct = ((stepIndex + 1) / steps.length) * 100;
  const slugValue = form.slug || toStoreSlug(form.storeName);
  const selectedSubscriptionTerm = form.packageId === "1y" ? "1y" : "6m";
  const selectedZone = zones.find((zone) => String(zone.id) === form.zoneId);
  const selectedModule = modules.find(
    (module) => String(module.id) === form.moduleId,
  );
  const selectedPlanLabel =
    form.businessPlan === "commission"
      ? tx(lang, "1% commission", "عمولة ١٪")
      : selectedSubscriptionTerm === "1y"
        ? tx(lang, "Yearly subscription", "اشتراك سنوي")
        : tx(lang, "6-month subscription", "اشتراك ٦ شهور");

  const titles: Record<StepKey, { title: string; subtitle: string }> = {
    store: {
      title: tx(lang, "Give your store its identity", "ابدأ بهوية متجرك"),
      subtitle: tx(
        lang,
        "Choose the name, public link, color, and logo customers will recognize.",
        "اختر الاسم والرابط واللون والشعار الذي سيظهر لعملائك.",
      ),
    },
    location: {
      title: tx(lang, "Where does your store operate?", "أين يعمل متجرك؟"),
      subtitle: tx(
        lang,
        "Choose the service zone first, then select your business activity and location.",
        "اختر منطقة الخدمة أولًا، ثم حدد نوع نشاطك وموقع المتجر.",
      ),
    },
    delivery: {
      title: tx(lang, "Set delivery expectations", "جهّز إعدادات التوصيل"),
      subtitle: tx(
        lang,
        "Tell customers the delivery fee, expected time, and when the store accepts orders.",
        "حدد للعميل سعر التوصيل والمدة المتوقعة ومواعيد استقبال الطلبات.",
      ),
    },
    categories: {
      title: tx(
        lang,
        "Help customers find you",
        "ساعد العملاء يوصلوا لمنتجاتك",
      ),
      subtitle: tx(
        lang,
        "Select the categories that best describe what your store sells.",
        "اختر الأصناف الأقرب لما يبيعه متجرك حتى يظهر في المكان الصحيح.",
      ),
    },
    plan: {
      title: tx(lang, "Choose how you want to pay", "اختر الطريقة الأنسب لك"),
      subtitle: tx(
        lang,
        "Pick commission when you want to pay with sales, or subscription for a fixed monthly cost.",
        "اختر العمولة لو تحب تدفع مع المبيعات، أو الاشتراك لتكلفة شهرية ثابتة.",
      ),
    },
    account: {
      title: tx(
        lang,
        "Last step: your admin account",
        "آخر خطوة: حساب إدارة المتجر",
      ),
      subtitle: tx(
        lang,
        "Create the credentials you will use to manage the store and its orders.",
        "أنشئ بيانات الدخول التي ستستخدمها لإدارة المتجر والطلبات.",
      ),
    },
  };

  const commissionFeatures = [
    tx(lang, "Launch-ready online store", "متجر أونلاين جاهز للإطلاق"),
    tx(lang, "Professional merchant app", "تطبيق احترافي للتاجر"),
    tx(
      lang,
      "Instant price and product updates",
      "تحديث فوري للأسعار والمنتجات",
    ),
    tx(lang, "Marketing consultations", "استشارات تسويقية"),
    tx(lang, "24/7 technical support", "دعم فني 24/7"),
    tx(lang, "Only 1% commission on sales", "عمولة ١٪ فقط على المبيعات"),
  ];

  const subscriptionFeatures = [
    tx(lang, "Everything in the commission plan", "كل مميزات باقة العمولة"),
    tx(
      lang,
      "Unlimited orders without sales commission",
      "طلبات غير محدودة بدون عمولة",
    ),
    tx(lang, "Professional merchant app", "تطبيق احترافي للتاجر"),
    tx(lang, "Marketing consultations", "استشارات تسويقية"),
    tx(lang, "24/7 technical support", "دعم فني 24/7"),
    tx(
      lang,
      "Subscription activation with Shoplanser support",
      "تفعيل الاشتراك مع دعم شوب لانسر",
    ),
  ];

  useLayoutEffect(() => {
    setInlineError("");
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [step]);

  useEffect(() => {
    let cancelled = false;
    setLoadingZones(true);
    fetchZones()
      .catch(() => [])
      .then((nextZones) => {
        if (cancelled) return;
        setZones(nextZones);
        if (nextZones.length === 1) {
          setForm((current) => ({
            ...current,
            zoneId: current.zoneId || String(nextZones[0].id),
          }));
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingZones(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!form.zoneId) {
      setModules([]);
      return;
    }

    let cancelled = false;
    setLoadingModules(true);
    fetchModules(form.zoneId)
      .catch(() => [])
      .then((nextModules) => {
        if (cancelled) return;
        setModules(nextModules);
        setForm((current) => ({
          ...current,
          moduleId: nextModules.some(
            (module) => String(module.id) === current.moduleId,
          )
            ? current.moduleId
            : "",
          categoryIds: [],
        }));
      })
      .finally(() => {
        if (!cancelled) setLoadingModules(false);
      });

    return () => {
      cancelled = true;
    };
  }, [form.zoneId]);

  useEffect(() => {
    if (!form.moduleId) {
      setCategories([]);
      return;
    }

    let cancelled = false;
    setLoadingCategories(true);
    fetchCategories(form.moduleId)
      .catch(() => [])
      .then((nextCategories) => {
        if (cancelled) return;
        setCategories(nextCategories);
        setForm((current) => ({
          ...current,
          categoryIds: current.categoryIds.filter((id) =>
            nextCategories.some((category) => String(category.id) === id),
          ),
        }));
      })
      .finally(() => {
        if (!cancelled) setLoadingCategories(false);
      });

    return () => {
      cancelled = true;
    };
  }, [form.moduleId]);

  useEffect(() => {
    const clean = slugValue.trim();
    if (!clean) {
      setSlugStatus("idle");
      setSlugMessage("");
      return;
    }

    setSlugStatus("checking");
    const timer = window.setTimeout(() => {
      checkSlug(clean)
        .then((result) => {
          if (result.exist) {
            setSlugStatus("taken");
            setSlugMessage(
              result.message ||
                tx(
                  lang,
                  "This store URL is already taken.",
                  "رابط المتجر مستخدم بالفعل.",
                ),
            );
          } else {
            setSlugStatus("available");
            setSlugMessage(tx(lang, "Available", "متاح"));
          }
        })
        .catch(() => {
          setSlugStatus("error");
          setSlugMessage(
            tx(
              lang,
              "Could not check the URL right now.",
              "تعذر التحقق من الرابط الآن.",
            ),
          );
        });
    }, 450);

    return () => window.clearTimeout(timer);
  }, [lang, slugValue]);

  const update = <K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K],
  ) => {
    setInlineError("");
    setForm((current) => ({ ...current, [key]: value }));
  };

  const updateStoreName = (storeName: string) => {
    setInlineError("");
    setForm((current) => ({
      ...current,
      storeName,
      slug: slugManuallyEdited ? current.slug : toStoreSlug(storeName),
    }));
  };

  const updateSlug = (value: string) => {
    const cleanSlug = slugify(value);
    setInlineError("");
    setSlugManuallyEdited(Boolean(cleanSlug));
    setForm((current) => ({
      ...current,
      slug: cleanSlug || toStoreSlug(current.storeName),
    }));
  };

  const showError = useCallback(
    (titleText: string, description: string) => {
      setInlineError(description);
      toast({ title: titleText, description, variant: "destructive" });
    },
    [toast],
  );

  const validateStep = (targetStep: StepKey) => {
    if (targetStep === "store") {
      if (!form.storeName.trim()) {
        showError(
          tx(lang, "Store name required", "اسم المتجر مطلوب"),
          tx(
            lang,
            "Enter the store name before continuing.",
            "أدخل اسم المتجر قبل المتابعة.",
          ),
        );
        return false;
      }
      if (!slugValue) {
        showError(
          tx(lang, "Store link required", "رابط المتجر مطلوب"),
          tx(
            lang,
            "Write a store link using English letters, numbers, or dashes.",
            "اكتب رابط المتجر بحروف إنجليزية أو أرقام أو شرطات.",
          ),
        );
        return false;
      }
      if (slugStatus === "checking") {
        showError(
          tx(lang, "Checking store URL", "جارٍ فحص رابط المتجر"),
          tx(
            lang,
            "Wait a moment until the store URL check finishes.",
            "انتظر لحظة حتى ينتهي التحقق من رابط المتجر.",
          ),
        );
        return false;
      }
      if (slugStatus === "taken") {
        showError(
          tx(lang, "Store URL unavailable", "رابط المتجر غير متاح"),
          tx(lang, "Choose another store URL.", "اختر رابط متجر آخر."),
        );
        return false;
      }
    }

    if (targetStep === "location") {
      if (!form.zoneId) {
        showError(
          tx(lang, "Zone required", "المنطقة مطلوبة"),
          tx(lang, "Choose your service zone.", "اختر منطقة خدمة المتجر."),
        );
        return false;
      }
      if (!form.moduleId) {
        showError(
          tx(lang, "Business type required", "نوع النشاط مطلوب"),
          tx(lang, "Choose the store business type.", "اختر نوع نشاط المتجر."),
        );
        return false;
      }
      if (!form.address.trim()) {
        showError(
          tx(lang, "Address required", "العنوان مطلوب"),
          tx(lang, "Enter the store address.", "أدخل عنوان المتجر."),
        );
        return false;
      }
    }

    if (targetStep === "delivery") {
      if (!form.deliveryPrice.trim()) {
        showError(
          tx(lang, "Delivery fee required", "سعر التوصيل مطلوب"),
          tx(
            lang,
            "Enter the delivery fee, even if it is zero.",
            "أدخل سعر التوصيل حتى لو كان صفر.",
          ),
        );
        return false;
      }
      if (!form.isOpen24Hours && (!form.openingTime || !form.closingTime)) {
        showError(
          tx(lang, "Working hours required", "مواعيد العمل مطلوبة"),
          tx(
            lang,
            "Enter opening and closing times.",
            "أدخل وقت الفتح والإغلاق.",
          ),
        );
        return false;
      }
    }

    if (targetStep === "categories" && form.categoryIds.length === 0) {
      showError(
        tx(lang, "Category required", "الصنف مطلوب"),
        tx(
          lang,
          "Choose at least one category.",
          "اختر صنفًا واحدًا على الأقل.",
        ),
      );
      return false;
    }

    if (
      targetStep === "plan" &&
      form.businessPlan === "subscription" &&
      !form.packageId
    ) {
      showError(
        tx(lang, "Package required", "الباقة مطلوبة"),
        tx(lang, "Choose a subscription package.", "اختر باقة الاشتراك."),
      );
      return false;
    }

    if (targetStep === "account") {
      const phone = normalizeEgPhone(form.ownerPhone);
      if (!form.ownerFullName.trim()) {
        showError(
          tx(lang, "Owner name required", "اسم صاحب الحساب مطلوب"),
          tx(lang, "Enter the account owner name.", "أدخل اسم صاحب الحساب."),
        );
        return false;
      }
      if (!form.ownerEmail.trim() || !form.ownerEmail.includes("@")) {
        showError(
          tx(lang, "Valid email required", "البريد الإلكتروني غير صحيح"),
          tx(
            lang,
            "Enter a valid email address.",
            "أدخل بريدًا إلكترونيًا صحيحًا.",
          ),
        );
        return false;
      }
      if (!phone) {
        showError(
          tx(lang, "Valid phone required", "رقم الهاتف غير صحيح"),
          tx(
            lang,
            "Enter a valid Egyptian mobile number.",
            "أدخل رقم موبايل مصري صحيح.",
          ),
        );
        return false;
      }
      if (form.ownerPassword.length < 8) {
        showError(
          tx(lang, "Password is too short", "كلمة المرور قصيرة"),
          tx(lang, "Use at least 8 characters.", "استخدم 8 أحرف على الأقل."),
        );
        return false;
      }
      if (form.ownerPassword !== form.ownerPasswordConfirm) {
        showError(
          tx(lang, "Passwords do not match", "كلمتا المرور غير متطابقتين"),
          tx(lang, "Confirm the same password.", "أكد نفس كلمة المرور."),
        );
        return false;
      }
    }

    return true;
  };

  const goNext = () => {
    if (!validateStep(step)) return;
    setInlineError("");
    const next = steps[stepIndex + 1]?.key;
    if (next) setStep(next);
  };

  const goBack = () => {
    setInlineError("");
    const previous = steps[stepIndex - 1]?.key;
    if (previous) setStep(previous);
  };

  const submit = async () => {
    if (submitting || !validateStep("account")) return;

    const { f_name, l_name } = splitFullName(form.ownerFullName);
    const phone = normalizeEgPhone(form.ownerPhone) ?? form.ownerPhone.trim();
    const locationValue = mapValue ?? DEFAULT_LOCATION;
    const storeName = form.storeName.trim();
    const address = form.address.trim();
    const cleanSlug = slugValue || toStoreSlug(storeName);

    const storePayload = {
      f_name,
      l_name,
      email: form.ownerEmail.trim(),
      phone,
      country_code: "+20",
      password: form.ownerPassword,
      store_name: storeName,
      store_name_ar: storeName,
      address,
      address_ar: address,
      latitude: locationValue.lat,
      longitude: locationValue.lng,
      zone_id: Number(form.zoneId),
      module_id: Number(form.moduleId),
      category_ids: form.categoryIds.map(Number),
      slug: cleanSlug,
      color: form.color,
      delivery_time_type: form.deliveryUnit,
      minimum_delivery_time: form.minDelivery,
      maximum_delivery_time: form.maxDelivery,
      delivery_price: form.deliveryPrice,
      delivery_currency: form.deliveryCurrency,
      opening_time: form.isOpen24Hours ? undefined : form.openingTime,
      closing_time: form.isOpen24Hours ? undefined : form.closingTime,
      is_open_24_hours: form.isOpen24Hours,
      business_plan: form.businessPlan,
      package_id:
        form.businessPlan === "subscription" && /^\d+$/.test(form.packageId)
          ? form.packageId
          : undefined,
      subscription_term:
        form.businessPlan === "subscription"
          ? selectedSubscriptionTerm
          : undefined,
      pickup_zone_id: [form.zoneId],
      logo: form.logo,
    };

    setSubmitting(true);
    setInlineError("");
    try {
      const apiResult: {
        message?: string;
        store_id?: number;
        [k: string]: unknown;
      } = await registerStore(storePayload);

      navigate("/vendor/success", {
        state: {
          slug: cleanSlug,
          storeName,
          ownerEmail: form.ownerEmail.trim(),
          apiResult,
        },
        replace: true,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message.replace(/^register failed \(\d+\):\s*/i, "")
          : tx(lang, "Unexpected error.", "حدث خطأ غير متوقع.");
      showError(
        tx(lang, "Could not create store", "تعذر إنشاء المتجر"),
        message,
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div dir={dir} className="min-h-screen bg-muted/20">
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur">
        <div className="container-page flex h-16 items-center justify-between gap-3">
          <Link to="/" aria-label="Shoplanser home" className="shrink-0">
            <Logo size={40} tone="dark" />
          </Link>

          <div className="flex items-center gap-2">
            <Button
              asChild
              type="button"
              variant="ghost"
              size="sm"
              className="hidden gap-2 sm:inline-flex"
            >
              <Link to="/vendor/login">
                <LogIn className="h-4 w-4" />
                {tx(lang, "I already have a store", "لدي متجر بالفعل")}
              </Link>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setLang(lang === "ar" ? "en" : "ar")}
              className="min-w-20"
            >
              {lang === "ar" ? "English" : "العربية"}
            </Button>
          </div>
        </div>
      </header>

      <main className="container-page py-6 sm:py-10">
        <div className="mb-6 flex items-center justify-between gap-4 lg:hidden">
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3 text-xs font-bold text-muted-foreground">
              <span>
                {tx(
                  lang,
                  `Step ${stepIndex + 1} of ${steps.length}`,
                  `الخطوة ${stepIndex + 1} من ${steps.length}`,
                )}
              </span>
              <span>{Math.round(progressPct)}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="mt-2 truncate text-sm font-extrabold text-foreground">
              {steps[stepIndex].label}
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)] lg:items-start">
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-4">
              <div className="rounded-3xl border border-border bg-card p-5 shadow-card">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wide text-primary">
                      {tx(lang, "Store setup", "تجهيز المتجر")}
                    </div>
                    <h2 className="mt-1 text-lg font-extrabold text-foreground">
                      {tx(lang, "6 clear steps", "6 خطوات واضحة")}
                    </h2>
                  </div>
                  <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-extrabold text-primary">
                    {Math.round(progressPct)}%
                  </div>
                </div>

                <div className="mt-5 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-300"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>

                <nav className="mt-5 space-y-1" aria-label="Store setup steps">
                  {steps.map((item, index) => {
                    const Icon = item.icon;
                    const active = item.key === step;
                    const done = index < stepIndex;
                    const accessible = index <= stepIndex;
                    return (
                      <button
                        key={item.key}
                        type="button"
                        aria-current={active ? "step" : undefined}
                        aria-disabled={!accessible}
                        disabled={!accessible}
                        onClick={() => {
                          if (accessible) setStep(item.key);
                        }}
                        className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-start text-sm transition ${
                          active
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : done
                              ? "text-foreground hover:bg-muted"
                              : "cursor-default text-muted-foreground/60"
                        }`}
                      >
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${
                            active
                              ? "border-white/20 bg-white/15"
                              : done
                                ? "border-primary/20 bg-primary/10 text-primary"
                                : "border-border bg-muted/60"
                          }`}
                        >
                          {done ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Icon className="h-4 w-4" />
                          )}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[10px] font-bold uppercase tracking-wide opacity-70">
                            {tx(
                              lang,
                              `Step ${index + 1}`,
                              `الخطوة ${index + 1}`,
                            )}
                          </span>
                          <span className="block truncate font-extrabold">
                            {item.label}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="rounded-3xl border border-border bg-card p-5 shadow-card">
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-2xl text-white"
                    style={{ backgroundColor: form.color }}
                  >
                    <Store className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-muted-foreground">
                      {tx(lang, "Store preview", "معاينة سريعة")}
                    </div>
                    <div className="truncate text-sm font-extrabold text-foreground">
                      {form.storeName || tx(lang, "Your store", "متجرك")}
                    </div>
                  </div>
                </div>
                <div
                  dir="ltr"
                  className="mt-4 truncate rounded-xl bg-muted px-3 py-2 font-mono text-[11px] text-muted-foreground"
                >
                  store.shoplanser.com/{slugValue || "your-store"}
                </div>
                <div className="mt-4 flex items-start gap-2 text-xs leading-5 text-muted-foreground">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>
                    {tx(
                      lang,
                      "Nothing is created until you confirm the final step.",
                      "لن يتم إنشاء المتجر قبل تأكيد الخطوة الأخيرة.",
                    )}
                  </span>
                </div>
              </div>
            </div>
          </aside>

          <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-card">
            <div className="border-b border-border bg-gradient-to-b from-primary/5 to-card px-5 py-6 sm:px-8 sm:py-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-extrabold text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                  {tx(
                    lang,
                    `Step ${stepIndex + 1} of ${steps.length}`,
                    `الخطوة ${stepIndex + 1} من ${steps.length}`,
                  )}
                </div>
                <Button
                  asChild
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="gap-2 sm:hidden"
                >
                  <Link to="/vendor/login">
                    <LogIn className="h-4 w-4" />
                    {tx(lang, "Sign in", "تسجيل الدخول")}
                  </Link>
                </Button>
              </div>
              <h1 className="mt-4 text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                {titles[step].title}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                {titles[step].subtitle}
              </p>
            </div>

            <div className="px-5 py-6 sm:px-8 sm:py-8">
              {inlineError && (
                <div
                  role="alert"
                  className="mb-6 flex items-start gap-3 rounded-2xl border border-destructive/25 bg-destructive/5 p-4 text-sm text-destructive"
                >
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                  <div>
                    <div className="font-extrabold">
                      {tx(lang, "Check this step", "راجع هذه الخطوة")}
                    </div>
                    <p className="mt-1 leading-6">{inlineError}</p>
                  </div>
                </div>
              )}

              {step === "store" && (
                <div className="space-y-7">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field
                      label={tx(lang, "Store name", "اسم المتجر")}
                      required
                      hint={tx(
                        lang,
                        "Use the name customers already know.",
                        "استخدم الاسم الذي يعرفك به عملاؤك.",
                      )}
                    >
                      <Input
                        value={form.storeName}
                        onChange={(event) =>
                          updateStoreName(event.target.value)
                        }
                        placeholder={tx(lang, "Example Market", "مثال ماركت")}
                        autoFocus
                        className="h-11"
                      />
                    </Field>

                    <Field
                      label={tx(lang, "Public store link", "رابط المتجر")}
                      required
                      hint={tx(
                        lang,
                        "English letters, numbers, and dashes only.",
                        "حروف إنجليزية وأرقام وشرطات فقط.",
                      )}
                    >
                      <div
                        dir="ltr"
                        className="flex h-11 overflow-hidden rounded-md border border-input bg-background focus-within:ring-2 focus-within:ring-ring"
                      >
                        <span className="hidden items-center border-r border-border bg-muted px-3 font-mono text-[11px] text-muted-foreground md:flex">
                          store.shoplanser.com/
                        </span>
                        <Input
                          dir="ltr"
                          value={form.slug}
                          onChange={(event) => updateSlug(event.target.value)}
                          placeholder={
                            toStoreSlug(form.storeName) || "my-store"
                          }
                          className="h-full border-0 font-mono focus-visible:ring-0"
                        />
                      </div>
                      <div
                        aria-live="polite"
                        className="mt-2 min-h-5 text-xs font-semibold"
                      >
                        {slugStatus === "checking" && (
                          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            {tx(
                              lang,
                              "Checking availability…",
                              "جارٍ التحقق من الرابط…",
                            )}
                          </span>
                        )}
                        {slugStatus === "available" && (
                          <span className="inline-flex items-center gap-1.5 text-emerald-600">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            {tx(lang, "This link is available", "الرابط متاح")}
                          </span>
                        )}
                        {slugStatus === "taken" && (
                          <span className="text-destructive">
                            {slugMessage}
                          </span>
                        )}
                        {slugStatus === "error" && (
                          <span className="text-amber-600">{slugMessage}</span>
                        )}
                      </div>
                    </Field>
                  </div>

                  <div className="rounded-2xl border border-border bg-muted/20 p-5 sm:p-6">
                    <div>
                      <h2 className="text-base font-extrabold text-foreground">
                        {tx(lang, "Brand look", "شكل وهوية المتجر")}
                      </h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {tx(
                          lang,
                          "Pick a primary color and add your logo if you have one.",
                          "اختر اللون الأساسي وأضف شعار متجرك إذا كان جاهزًا.",
                        )}
                      </p>
                    </div>

                    <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_280px] lg:items-start">
                      <div>
                        <Label className="flex items-center gap-2 text-sm font-bold">
                          <Palette className="h-4 w-4 text-primary" />
                          {tx(lang, "Primary color", "اللون الأساسي")}
                        </Label>
                        <div className="mt-3 flex flex-wrap gap-2.5">
                          {STORE_COLORS.map((color) => (
                            <button
                              key={color}
                              type="button"
                              aria-label={color}
                              aria-pressed={form.color === color}
                              onClick={() => update("color", color)}
                              className={`relative h-11 w-11 rounded-xl ring-offset-2 transition hover:scale-105 ${
                                form.color === color
                                  ? "ring-2 ring-primary"
                                  : "ring-1 ring-border"
                              }`}
                              style={{ backgroundColor: color }}
                            >
                              {form.color === color && (
                                <Check className="absolute inset-0 m-auto h-5 w-5 text-white drop-shadow" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      <FileField
                        label={tx(lang, "Store logo", "شعار المتجر")}
                        file={form.logo}
                        onChange={(file) => update("logo", file ?? null)}
                        lang={lang}
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === "location" && (
                <div className="space-y-6">
                  <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm leading-6 text-muted-foreground">
                    {tx(
                      lang,
                      "We ask for the zone before the business type because available activities can differ by service area.",
                      "نطلب المنطقة قبل نوع النشاط لأن الأنشطة المتاحة قد تختلف حسب منطقة الخدمة.",
                    )}
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field
                      label={tx(lang, "Service zone", "منطقة الخدمة")}
                      required
                      hint={tx(
                        lang,
                        "Choose the area where your store operates.",
                        "اختر المنطقة التي يعمل فيها متجرك.",
                      )}
                    >
                      <Select
                        value={form.zoneId}
                        onValueChange={(value) => update("zoneId", value)}
                        disabled={loadingZones || zones.length === 0}
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue
                            placeholder={
                              loadingZones
                                ? tx(
                                    lang,
                                    "Loading zones…",
                                    "جارٍ تحميل المناطق…",
                                  )
                                : tx(lang, "Choose zone", "اختر المنطقة")
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {zones.map((zone) => (
                            <SelectItem key={zone.id} value={String(zone.id)}>
                              {zone.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>

                    <Field
                      label={tx(lang, "Business type", "نوع النشاط")}
                      required
                      hint={
                        !form.zoneId
                          ? tx(
                              lang,
                              "Choose the zone first.",
                              "اختر المنطقة أولًا.",
                            )
                          : tx(
                              lang,
                              "This controls the categories available next.",
                              "بناءً عليه سنعرض لك الأصناف المناسبة لاحقًا.",
                            )
                      }
                    >
                      <Select
                        value={form.moduleId}
                        onValueChange={(value) => update("moduleId", value)}
                        disabled={
                          !form.zoneId || loadingModules || modules.length === 0
                        }
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue
                            placeholder={
                              loadingModules
                                ? tx(
                                    lang,
                                    "Loading activities…",
                                    "جارٍ تحميل الأنشطة…",
                                  )
                                : tx(
                                    lang,
                                    "Choose business type",
                                    "اختر نوع النشاط",
                                  )
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {modules.map((module) => (
                            <SelectItem
                              key={module.id}
                              value={String(module.id)}
                            >
                              {module.module_name ??
                                module.name ??
                                `#${module.id}`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>

                  <Field
                    label={tx(lang, "Store address", "عنوان المتجر")}
                    required
                    hint={tx(
                      lang,
                      "Write the address exactly as customers should see it.",
                      "اكتب العنوان بالشكل الذي تريد أن يراه العميل.",
                    )}
                  >
                    <Input
                      value={form.address}
                      onChange={(event) =>
                        update("address", event.target.value)
                      }
                      placeholder={tx(
                        lang,
                        "Street, area, city",
                        "الشارع، المنطقة، المدينة",
                      )}
                      className="h-11"
                    />
                  </Field>

                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <Label className="flex items-center gap-2 text-sm font-bold">
                        <MapPin className="h-4 w-4 text-primary" />
                        {tx(lang, "Pin on map", "تحديد الموقع على الخريطة")}
                      </Label>
                      <span className="text-xs font-semibold text-muted-foreground">
                        {tx(
                          lang,
                          "Optional but recommended",
                          "اختياري لكنه مفضل",
                        )}
                      </span>
                    </div>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      {tx(
                        lang,
                        "A precise pin helps delivery drivers reach the store. You can still continue with the written address.",
                        "تحديد الموقع بدقة يساعد مندوبي التوصيل، ويمكنك المتابعة بالعنوان المكتوب فقط.",
                      )}
                    </p>
                    <div className="mt-3">
                      <StoreLocationPicker
                        value={mapValue}
                        onChange={(value) => {
                          setMapValue(value);
                          if (value.address && !form.address) {
                            update("address", value.address);
                          }
                        }}
                        lang={lang}
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === "delivery" && (
                <div className="space-y-7">
                  <div className="rounded-2xl border border-border bg-muted/20 p-5 sm:p-6">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Truck className="h-5 w-5" />
                      </span>
                      <div>
                        <h2 className="font-extrabold text-foreground">
                          {tx(lang, "Delivery cost", "تكلفة التوصيل")}
                        </h2>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {tx(
                            lang,
                            "Use zero if delivery is free.",
                            "اكتب صفر إذا كان التوصيل مجانيًا.",
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-5 sm:grid-cols-[1fr_220px]">
                      <Field
                        label={tx(lang, "Delivery fee", "سعر التوصيل")}
                        required
                      >
                        <Input
                          inputMode="decimal"
                          value={form.deliveryPrice}
                          onChange={(event) =>
                            update("deliveryPrice", event.target.value)
                          }
                          placeholder="20"
                          className="h-11"
                        />
                      </Field>
                      <Field label={tx(lang, "Currency", "العملة")} required>
                        <Select
                          value={form.deliveryCurrency}
                          onValueChange={(value) =>
                            update("deliveryCurrency", value)
                          }
                        >
                          <SelectTrigger className="h-11">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {DELIVERY_CURRENCIES.map((currency) => (
                              <SelectItem
                                key={currency.value}
                                value={currency.value}
                              >
                                {currency.value} —
                                {lang === "ar" ? currency.ar : currency.en}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border bg-muted/20 p-5 sm:p-6">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Clock3 className="h-5 w-5" />
                      </span>
                      <div>
                        <h2 className="font-extrabold text-foreground">
                          {tx(
                            lang,
                            "Expected delivery time",
                            "مدة التوصيل المتوقعة",
                          )}
                        </h2>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {tx(
                            lang,
                            "Give customers a realistic minimum and maximum.",
                            "حدد حدًا أدنى وأقصى واقعيًا للعميل.",
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-5 sm:grid-cols-3">
                      <Field
                        label={tx(lang, "Minimum", "الحد الأدنى")}
                        required
                      >
                        <MinuteInput
                          value={form.minDelivery}
                          onChange={(value) => update("minDelivery", value)}
                          unit={
                            form.deliveryUnit === "hour"
                              ? tx(lang, "hour", "ساعة")
                              : tx(lang, "min", "دقيقة")
                          }
                        />
                      </Field>
                      <Field
                        label={tx(lang, "Maximum", "الحد الأقصى")}
                        required
                      >
                        <MinuteInput
                          value={form.maxDelivery}
                          onChange={(value) => update("maxDelivery", value)}
                          unit={
                            form.deliveryUnit === "hour"
                              ? tx(lang, "hour", "ساعة")
                              : tx(lang, "min", "دقيقة")
                          }
                        />
                      </Field>
                      <Field
                        label={tx(lang, "Time unit", "وحدة الوقت")}
                        required
                      >
                        <Select
                          value={form.deliveryUnit}
                          onValueChange={(value) =>
                            update("deliveryUnit", value)
                          }
                        >
                          <SelectTrigger className="h-11">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="minute">
                              {tx(lang, "Minutes", "دقائق")}
                            </SelectItem>
                            <SelectItem value="hour">
                              {tx(lang, "Hours", "ساعات")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border bg-muted/20 p-5 sm:p-6">
                    <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-background p-4">
                      <div>
                        <div className="font-extrabold text-foreground">
                          {tx(lang, "Open 24 hours", "المتجر مفتوح 24 ساعة")}
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {tx(
                            lang,
                            "Turn this on if customers can order at any time.",
                            "فعّلها إذا كان العميل يستطيع الطلب في أي وقت.",
                          )}
                        </p>
                      </div>
                      <Checkbox
                        checked={form.isOpen24Hours}
                        onCheckedChange={(checked) =>
                          update("isOpen24Hours", checked === true)
                        }
                      />
                    </div>

                    {!form.isOpen24Hours && (
                      <div className="mt-5 grid gap-5 sm:grid-cols-2">
                        <Field
                          label={tx(lang, "Opening time", "وقت الفتح")}
                          required
                        >
                          <Input
                            type="time"
                            value={form.openingTime}
                            onChange={(event) =>
                              update("openingTime", event.target.value)
                            }
                            className="h-11"
                          />
                        </Field>
                        <Field
                          label={tx(lang, "Closing time", "وقت الإغلاق")}
                          required
                        >
                          <Input
                            type="time"
                            value={form.closingTime}
                            onChange={(event) =>
                              update("closingTime", event.target.value)
                            }
                            className="h-11"
                          />
                        </Field>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {step === "categories" && (
                <div className="space-y-6">
                  <div className="flex flex-col gap-4 rounded-2xl border border-border bg-muted/20 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="text-xs font-bold text-muted-foreground">
                        {tx(lang, "Selected activity", "النشاط المختار")}
                      </div>
                      <div className="mt-1 font-extrabold text-foreground">
                        {selectedModule?.module_name ??
                          selectedModule?.name ??
                          tx(lang, "Not selected", "غير محدد")}
                      </div>
                      {selectedZone && (
                        <div className="mt-1 text-xs text-muted-foreground">
                          {selectedZone.name}
                        </div>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setStep("location")}
                    >
                      {tx(lang, "Change activity", "تغيير النشاط")}
                    </Button>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="font-extrabold text-foreground">
                        {tx(
                          lang,
                          "Choose one or more categories",
                          "اختر صنفًا أو أكثر",
                        )}
                      </h2>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {tx(
                          lang,
                          "You can select everything that applies to your store.",
                          "يمكنك اختيار كل الأصناف المناسبة لمتجرك.",
                        )}
                      </p>
                    </div>
                    <span className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-extrabold text-primary">
                      {tx(
                        lang,
                        `${form.categoryIds.length} selected`,
                        `تم اختيار ${form.categoryIds.length}`,
                      )}
                    </span>
                  </div>

                  {loadingCategories ? (
                    <div className="flex min-h-40 items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20">
                      <div className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {tx(lang, "Loading categories…", "جارٍ تحميل الأصناف…")}
                      </div>
                    </div>
                  ) : categories.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-6 text-sm leading-7 text-muted-foreground">
                      {tx(
                        lang,
                        "No categories were found for this business type. Go back and choose another activity.",
                        "لم نجد أصنافًا لهذا النشاط. ارجع واختر نشاطًا آخر.",
                      )}
                    </div>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {categories.map((category) => {
                        const id = String(category.id);
                        const checked = form.categoryIds.includes(id);
                        return (
                          <label
                            key={category.id}
                            className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition ${
                              checked
                                ? "border-primary bg-primary/10 shadow-sm"
                                : "border-border bg-background hover:border-primary/30 hover:bg-muted/30"
                            }`}
                          >
                            <Checkbox
                              checked={checked}
                              onCheckedChange={(nextChecked) => {
                                setInlineError("");
                                setForm((current) => ({
                                  ...current,
                                  categoryIds:
                                    nextChecked === true
                                      ? [...current.categoryIds, id]
                                      : current.categoryIds.filter(
                                          (item) => item !== id,
                                        ),
                                }));
                              }}
                            />
                            <span className="min-w-0 flex-1 font-bold text-foreground">
                              {category.name}
                            </span>
                            {checked && (
                              <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                            )}
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {step === "plan" && (
                <div className="space-y-6">
                  <div className="grid gap-4 xl:grid-cols-2">
                    <PlanOption
                      active={form.businessPlan === "commission"}
                      icon={<ShieldCheck className="h-5 w-5" />}
                      title={tx(lang, "Commission", "بالعمولة")}
                      badge={tx(lang, "No monthly fee", "بدون اشتراك شهري")}
                      price="1%"
                      priceSuffix={tx(lang, "of sales", "من المبيعات")}
                      features={commissionFeatures}
                      description={tx(
                        lang,
                        "Good when you want costs to follow actual sales.",
                        "مناسبة لو تحب تكون التكلفة مرتبطة بالمبيعات الفعلية.",
                      )}
                      selectedLabel={tx(lang, "Selected", "محدد")}
                      selectLabel={tx(
                        lang,
                        "Choose commission",
                        "اختيار العمولة",
                      )}
                      onClick={() =>
                        setForm((current) => ({
                          ...current,
                          businessPlan: "commission",
                          packageId: "",
                        }))
                      }
                    />
                    <PlanOption
                      active={form.businessPlan === "subscription"}
                      icon={<Crown className="h-5 w-5" />}
                      title={tx(lang, "Subscription", "اشتراك")}
                      badge={tx(lang, "Fixed cost", "تكلفة ثابتة")}
                      price={tx(lang, "800 EGP", "٨٠٠ جنيه")}
                      priceSuffix={tx(lang, "/ month", "/ شهريًا")}
                      features={subscriptionFeatures}
                      description={tx(
                        lang,
                        "Good when you prefer a predictable monthly operating cost.",
                        "مناسبة لو تفضّل تكلفة شهرية ثابتة وواضحة.",
                      )}
                      selectedLabel={tx(lang, "Selected", "محدد")}
                      selectLabel={tx(
                        lang,
                        "Choose subscription",
                        "اختيار الاشتراك",
                      )}
                      onClick={() =>
                        setForm((current) => ({
                          ...current,
                          businessPlan: "subscription",
                          packageId: current.packageId === "1y" ? "1y" : "6m",
                        }))
                      }
                    />
                  </div>

                  {form.businessPlan === "subscription" && (
                    <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 sm:p-6">
                      <h2 className="font-extrabold text-foreground">
                        {tx(
                          lang,
                          "Choose subscription term",
                          "اختر مدة الاشتراك",
                        )}
                      </h2>
                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        {[
                          {
                            id: "6m",
                            title: tx(lang, "6 months", "٦ شهور"),
                            total: tx(
                              lang,
                              "4,800 EGP total",
                              "الإجمالي ٤,٨٠٠ جنيه",
                            ),
                          },
                          {
                            id: "1y",
                            title: tx(lang, "1 year", "سنة"),
                            total: tx(
                              lang,
                              "9,600 EGP total",
                              "الإجمالي ٩,٦٠٠ جنيه",
                            ),
                          },
                        ].map((term) => {
                          const active = selectedSubscriptionTerm === term.id;
                          return (
                            <button
                              key={term.id}
                              type="button"
                              onClick={() => update("packageId", term.id)}
                              className={`flex items-center justify-between gap-4 rounded-2xl border p-4 text-start transition ${
                                active
                                  ? "border-primary bg-background shadow-sm"
                                  : "border-border bg-background/60 hover:border-primary/40"
                              }`}
                            >
                              <span>
                                <span className="block font-extrabold text-foreground">
                                  {term.title}
                                </span>
                                <span className="mt-1 block text-xs text-muted-foreground">
                                  {term.total}
                                </span>
                              </span>
                              <span
                                className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                                  active
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "border-border"
                                }`}
                              >
                                {active && <Check className="h-3.5 w-3.5" />}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                      <div className="mt-4 flex flex-col gap-3 rounded-xl border border-border bg-background p-4 text-sm sm:flex-row sm:items-center sm:justify-between">
                        <p className="leading-6 text-muted-foreground">
                          {tx(
                            lang,
                            "Subscription activation is completed with Shoplanser support.",
                            "يتم إكمال تفعيل الاشتراك مع دعم شوب لانسر.",
                          )}
                        </p>
                        <a
                          href="https://wa.me/201036850264"
                          target="_blank"
                          rel="noreferrer"
                          className="shrink-0 font-extrabold text-primary hover:underline"
                        >
                          {tx(lang, "Contact support", "تواصل مع الدعم")}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {step === "account" && (
                <div className="space-y-6">
                  <div className="grid gap-3 sm:grid-cols-3">
                    <SummaryCard
                      label={tx(lang, "Store", "المتجر")}
                      value={form.storeName || "—"}
                    />
                    <SummaryCard
                      label={tx(lang, "Activity", "النشاط")}
                      value={
                        selectedModule?.module_name ??
                        selectedModule?.name ??
                        "—"
                      }
                    />
                    <SummaryCard
                      label={tx(lang, "Plan", "الباقة")}
                      value={selectedPlanLabel}
                    />
                  </div>

                  <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm leading-6 text-muted-foreground">
                    <div className="flex items-start gap-3">
                      <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <span>
                        {tx(
                          lang,
                          "These credentials will be used to manage your store. Keep the email and password accessible to the store owner.",
                          "هذه البيانات ستُستخدم لإدارة المتجر، لذلك استخدم بريدًا وكلمة مرور يستطيع صاحب المتجر الوصول إليهما.",
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field
                      label={tx(lang, "Owner full name", "اسم صاحب الحساب")}
                      required
                    >
                      <Input
                        autoComplete="name"
                        value={form.ownerFullName}
                        onChange={(event) =>
                          update("ownerFullName", event.target.value)
                        }
                        className="h-11"
                      />
                    </Field>
                    <Field
                      label={tx(lang, "Email", "البريد الإلكتروني")}
                      required
                    >
                      <Input
                        type="email"
                        autoComplete="email"
                        value={form.ownerEmail}
                        onChange={(event) =>
                          update("ownerEmail", event.target.value)
                        }
                        className="h-11"
                      />
                    </Field>
                    <Field
                      label={tx(lang, "Phone", "رقم الموبايل")}
                      required
                      hint={tx(
                        lang,
                        "Egyptian mobile number.",
                        "رقم موبايل مصري.",
                      )}
                    >
                      <div
                        dir="ltr"
                        className="flex h-11 overflow-hidden rounded-md border border-input bg-background focus-within:ring-2 focus-within:ring-ring"
                      >
                        <span className="flex items-center border-r border-border bg-muted px-3 text-sm font-bold text-muted-foreground">
                          +20
                        </span>
                        <Input
                          dir="ltr"
                          inputMode="tel"
                          autoComplete="tel"
                          value={form.ownerPhone}
                          onChange={(event) =>
                            update("ownerPhone", event.target.value)
                          }
                          placeholder="01000000000"
                          className="h-full border-0 focus-visible:ring-0"
                        />
                      </div>
                    </Field>
                    <div className="hidden sm:block" />
                    <Field
                      label={tx(lang, "Password", "كلمة المرور")}
                      required
                      hint={tx(
                        lang,
                        "At least 8 characters.",
                        "8 أحرف على الأقل.",
                      )}
                    >
                      <Input
                        type="password"
                        autoComplete="new-password"
                        value={form.ownerPassword}
                        onChange={(event) =>
                          update("ownerPassword", event.target.value)
                        }
                        className="h-11"
                      />
                    </Field>
                    <Field
                      label={tx(lang, "Confirm password", "تأكيد كلمة المرور")}
                      required
                    >
                      <Input
                        type="password"
                        autoComplete="new-password"
                        value={form.ownerPasswordConfirm}
                        onChange={(event) =>
                          update("ownerPasswordConfirm", event.target.value)
                        }
                        className="h-11"
                      />
                    </Field>
                  </div>

                  {(form.ownerPassword || form.ownerPasswordConfirm) && (
                    <div className="flex flex-wrap gap-2 text-xs font-bold">
                      <StatusChip
                        ok={form.ownerPassword.length >= 8}
                        text={tx(lang, "8+ characters", "8 أحرف أو أكثر")}
                      />
                      <StatusChip
                        ok={
                          Boolean(form.ownerPasswordConfirm) &&
                          form.ownerPassword === form.ownerPasswordConfirm
                        }
                        text={tx(
                          lang,
                          "Passwords match",
                          "كلمتا المرور متطابقتان",
                        )}
                      />
                    </div>
                  )}

                  <p className="text-xs leading-6 text-muted-foreground">
                    {tx(
                      lang,
                      "By creating the store, you confirm that the information above is correct. You can review previous completed steps before submitting.",
                      "بإنشاء المتجر أنت تؤكد أن البيانات المدخلة صحيحة. يمكنك الرجوع لأي خطوة مكتملة ومراجعتها قبل الإرسال.",
                    )}
                  </p>
                </div>
              )}

              <div className="sticky bottom-3 z-30 -mx-2 mt-8 rounded-2xl border border-border bg-card/95 p-3 shadow-elevated backdrop-blur sm:mx-0 lg:static lg:border-t lg:border-x-0 lg:border-b-0 lg:rounded-none lg:bg-transparent lg:px-0 lg:pb-0 lg:pt-6 lg:shadow-none">
                {inlineError && (
                  <div className="mb-3 flex items-center gap-2 text-xs font-bold text-destructive lg:hidden">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span className="line-clamp-2">{inlineError}</span>
                  </div>
                )}
                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2">
                    {stepIndex > 0 ? (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={goBack}
                        disabled={submitting}
                        className="h-11 flex-1 gap-2 sm:flex-none"
                      >
                        <ArrowLeft
                          className={`h-4 w-4 ${dir === "rtl" ? "rotate-180" : ""}`}
                        />
                        {tx(lang, "Back", "رجوع")}
                      </Button>
                    ) : (
                      <Button
                        asChild
                        type="button"
                        variant="ghost"
                        className="h-11 flex-1 sm:flex-none"
                      >
                        <Link to="/">{tx(lang, "Cancel", "إلغاء")}</Link>
                      </Button>
                    )}
                    <span className="hidden text-xs text-muted-foreground md:inline">
                      {tx(
                        lang,
                        "You can revisit completed steps.",
                        "يمكنك الرجوع للخطوات المكتملة.",
                      )}
                    </span>
                  </div>

                  {step === "account" ? (
                    <Button
                      type="button"
                      onClick={submit}
                      disabled={submitting}
                      className="h-11 min-w-[190px] gap-2 font-extrabold"
                    >
                      {submitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                      {submitting
                        ? tx(lang, "Creating store…", "جارٍ إنشاء المتجر…")
                        : tx(lang, "Create my store", "إنشاء متجري")}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={goNext}
                      disabled={submitting}
                      className="h-11 min-w-[170px] gap-2 font-extrabold"
                    >
                      {tx(lang, "Continue", "متابعة")}
                      <ArrowRight
                        className={`h-4 w-4 ${dir === "rtl" ? "rotate-180" : ""}`}
                      />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t border-border bg-background py-6">
        <div className="container-page flex flex-col gap-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            {tx(
              lang,
              "Need help while registering? Contact Shoplanser support.",
              "تحتاج مساعدة أثناء التسجيل؟ تواصل مع دعم شوب لانسر.",
            )}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/legal/privacy" className="hover:text-foreground">
              {tx(lang, "Privacy", "الخصوصية")}
            </Link>
            <Link to="/legal/terms" className="hover:text-foreground">
              {tx(lang, "Terms", "الشروط")}
            </Link>
            <a
              href="https://wa.me/201036850264"
              target="_blank"
              rel="noreferrer"
              className="font-bold text-primary hover:underline"
            >
              {tx(lang, "WhatsApp support", "دعم واتساب")}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

const Field = ({
  label,
  hint,
  required = false,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <div>
    <div className="flex items-center gap-1.5">
      <Label className="text-sm font-bold text-foreground">{label}</Label>
      {required && (
        <span className="text-sm font-bold text-destructive">*</span>
      )}
    </div>
    {hint && (
      <p className="mt-1 text-xs leading-5 text-muted-foreground">{hint}</p>
    )}
    <div className="mt-2">{children}</div>
  </div>
);

const MinuteInput = ({
  value,
  onChange,
  unit,
}: {
  value: string;
  onChange: (value: string) => void;
  unit: string;
}) => (
  <div
    dir="ltr"
    className="flex h-11 overflow-hidden rounded-md border border-input bg-background focus-within:ring-2 focus-within:ring-ring"
  >
    <Input
      inputMode="numeric"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-full border-0 focus-visible:ring-0"
    />
    <span className="flex shrink-0 items-center border-l border-border bg-muted px-3 text-sm font-semibold text-muted-foreground">
      {unit}
    </span>
  </div>
);

const FileField = ({
  label,
  file,
  onChange,
  lang,
}: {
  label: string;
  file: File | null;
  onChange: (file?: File) => void;
  lang: "en" | "ar";
}) => (
  <label className="flex min-h-[96px] cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-border bg-background p-4 transition hover:border-primary/40 hover:bg-primary/5">
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
      {file ? (
        <ImagePlus className="h-5 w-5" />
      ) : (
        <Upload className="h-5 w-5" />
      )}
    </span>
    <span className="min-w-0 flex-1">
      <span className="block text-sm font-extrabold text-foreground">
        {label}
      </span>
      <span className="mt-1 block truncate text-xs text-muted-foreground">
        {file?.name ?? tx(lang, "PNG, JPG, or WebP", "PNG أو JPG أو WebP")}
      </span>
      <span className="mt-1 block text-[11px] font-semibold text-primary">
        {file
          ? tx(lang, "Change image", "تغيير الصورة")
          : tx(lang, "Choose image", "اختيار صورة")}
      </span>
    </span>
    <input
      type="file"
      accept="image/*"
      className="sr-only"
      onChange={(event) => onChange(event.target.files?.[0])}
    />
  </label>
);

const PlanOption = ({
  active,
  icon,
  title,
  badge,
  price,
  priceSuffix,
  features,
  description,
  selectedLabel,
  selectLabel,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  title: string;
  badge: string;
  price: string;
  priceSuffix: string;
  features: string[];
  description: string;
  selectedLabel: string;
  selectLabel: string;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={`group flex h-full flex-col rounded-3xl border p-5 text-start transition sm:p-6 ${
      active
        ? "border-primary bg-primary/5 shadow-elevated ring-1 ring-primary/20"
        : "border-border bg-background hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-card"
    }`}
  >
    <span className="flex w-full items-start justify-between gap-3">
      <span className="flex items-center gap-3">
        <span
          className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
            active
              ? "bg-primary text-primary-foreground"
              : "bg-primary/10 text-primary"
          }`}
        >
          {icon}
        </span>
        <span>
          <span className="block text-base font-black text-foreground">
            {title}
          </span>
          <span className="mt-0.5 block text-xs font-bold text-muted-foreground">
            {badge}
          </span>
        </span>
      </span>
      <span
        className={`flex h-6 w-6 items-center justify-center rounded-full border ${
          active
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border"
        }`}
      >
        {active && <Check className="h-3.5 w-3.5" />}
      </span>
    </span>

    <span className="mt-6 flex items-end gap-2 text-foreground">
      <span className="text-3xl font-black">{price}</span>
      <span className="pb-1 text-xs font-bold text-muted-foreground">
        {priceSuffix}
      </span>
    </span>
    <span className="mt-3 block text-sm leading-6 text-muted-foreground">
      {description}
    </span>

    <ul className="mt-5 flex-1 space-y-2.5 text-sm font-semibold text-muted-foreground">
      {features.map((feature) => (
        <li key={feature} className="flex items-start gap-2">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <span>{feature}</span>
        </li>
      ))}
    </ul>

    <span
      className={`mt-6 flex h-10 items-center justify-center rounded-xl border text-sm font-extrabold ${
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-muted/30 text-foreground group-hover:border-primary/40"
      }`}
    >
      {active ? selectedLabel : selectLabel}
    </span>
  </button>
);

const SummaryCard = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-2xl border border-border bg-muted/20 p-4">
    <div className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
      {label}
    </div>
    <div
      className="mt-1 truncate text-sm font-extrabold text-foreground"
      title={value}
    >
      {value}
    </div>
  </div>
);

const StatusChip = ({ ok, text }: { ok: boolean; text: string }) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 ${
      ok ? "bg-emerald-50 text-emerald-700" : "bg-muted text-muted-foreground"
    }`}
  >
    {ok ? (
      <CheckCircle2 className="h-3.5 w-3.5" />
    ) : (
      <AlertCircle className="h-3.5 w-3.5" />
    )}
    {text}
  </span>
);

export default VendorApplyV2;
