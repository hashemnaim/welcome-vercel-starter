import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Crown,
  ImagePlus,
  Loader2,
  LogIn,
  MapPin,
  Palette,
  ShieldCheck,
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
import { Footer } from "@/components/layout/Footer";
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
  "store" | "delivery" | "location" | "categories" | "plan" | "account";

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

const VendorApply = () => {
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
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [entryMode, setEntryMode] = useState<"choice" | "create">("choice");
  const [slugStatus, setSlugStatus] = useState<SlugStatus>("idle");
  const [slugMessage, setSlugMessage] = useState("");
  const [mapValue, setMapValue] = useState<MapValue | null>(null);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

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
    { key: "location", label: tx(lang, "Location", "الموقع"), icon: MapPin },
    { key: "delivery", label: tx(lang, "Delivery", "التوصيل"), icon: Truck },
    { key: "categories", label: tx(lang, "Categories", "الأصناف"), icon: Tag },
    { key: "plan", label: tx(lang, "Plan", "الباقة"), icon: Crown },
    { key: "account", label: tx(lang, "Account", "الحساب"), icon: User },
  ];

  const stepIndex = steps.findIndex((item) => item.key === step);
  const progressPct = ((stepIndex + 1) / steps.length) * 100;
  const slugValue = form.slug || toStoreSlug(form.storeName);
  const selectedSubscriptionTerm = form.packageId === "1y" ? "1y" : "6m";
  const commissionFeatures = [
    tx(lang, "Launch-ready online store", "متجر أونلاين جاهز للإطلاق"),
    tx(
      lang,
      "Products and categories prepared from day one",
      "المنتجات والتصنيفات جاهزة من أول يوم",
    ),
    tx(
      lang,
      "Instant price and product updates",
      "تحديث فوري للأسعار والمنتجات",
    ),
    tx(lang, "Professional merchant app", "تطبيق احترافي للتاجر"),
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
    tx(
      lang,
      "Fixed monthly cost for clearer planning",
      "تكلفة شهرية ثابتة لتخطيط أوضح",
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

  const title = useMemo(() => {
    const titles: Record<
      StepKey,
      { en: string; ar: string; subEn: string; subAr: string }
    > = {
      store: {
        en: "Start with your store",
        ar: "ابني متجرك في دقيقة",
        subEn:
          "Name, business type, brand color, and storefront link come first.",
        subAr: "اسم المتجر، نوع النشاط، اللون، ورابط المتجر أولًا.",
      },
      delivery: {
        en: "Delivery and working hours",
        ar: "التوصيل ومواعيد العمل",
        subEn: "Set the delivery fee and when customers can order.",
        subAr: "حدد سعر التوصيل ومواعيد استقبال الطلبات.",
      },
      location: {
        en: "Store location",
        ar: "موقع المتجر",
        subEn: "Choose the zone and write the address customers will see.",
        subAr: "اختر المنطقة واكتب العنوان الذي سيظهر للعملاء.",
      },
      categories: {
        en: "Choose categories",
        ar: "اختر الأصناف",
        subEn: "Pick what best describes the products you sell.",
        subAr: "اختر التصنيفات الأقرب للمنتجات التي تبيعها.",
      },
      plan: {
        en: "Choose the plan",
        ar: "اختر الباقة",
        subEn: "Select commission or a subscription package.",
        subAr: "اختر نظام العمولة أو إحدى باقات الاشتراك.",
      },
      account: {
        en: "Owner registration",
        ar: "تسجيل صاحب المتجر",
        subEn: "Now add the user account that will manage this store.",
        subAr: "الآن أضف بيانات المستخدم الذي سيدير هذا المتجر.",
      },
    };
    return titles[step];
  }, [step]);

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [step]);

  useEffect(() => {
    let cancelled = false;
    setLoadingMeta(true);
    fetchZones()
      .catch(() => [])
      .then((nextZones) => {
        if (cancelled) return;
        setZones(nextZones);
        setForm((current) => ({
          ...current,
          zoneId:
            current.zoneId || (nextZones[0]?.id ? String(nextZones[0].id) : ""),
        }));
      })
      .finally(() => {
        if (!cancelled) setLoadingMeta(false);
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
    fetchModules(form.zoneId)
      .catch(() => [])
      .then((nextModules) => {
        if (cancelled) return;
        setModules(nextModules);
        setForm((current) => ({
          ...current,
          moduleId:
            current.moduleId &&
            nextModules.some((module) => String(module.id) === current.moduleId)
              ? current.moduleId
              : nextModules[0]?.id
                ? String(nextModules[0].id)
                : "",
        }));
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
            tx(lang, "Could not check URL now.", "تعذر التحقق من الرابط الآن."),
          );
        });
    }, 450);

    return () => window.clearTimeout(timer);
  }, [lang, slugValue]);

  const update = <K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const updateStoreName = (storeName: string) => {
    setForm((current) => ({
      ...current,
      storeName,
      slug: slugManuallyEdited ? current.slug : toStoreSlug(storeName),
    }));
  };

  const updateSlug = (value: string) => {
    const cleanSlug = slugify(value);
    setSlugManuallyEdited(Boolean(cleanSlug));
    setForm((current) => ({
      ...current,
      slug: cleanSlug || toStoreSlug(current.storeName),
    }));
  };

  const showError = useCallback(
    (titleText: string, description: string) => {
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
            "Write the store link in English letters, numbers, or dashes.",
            "اكتب رابط المتجر بحروف إنجليزية أو أرقام أو شرطات.",
          ),
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
      if (slugStatus === "taken") {
        showError(
          tx(lang, "Store URL unavailable", "رابط المتجر غير متاح"),
          tx(lang, "Choose another store URL.", "اختر رابط متجر آخر."),
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

    if (targetStep === "location") {
      if (!form.zoneId) {
        showError(
          tx(lang, "Zone required", "المنطقة مطلوبة"),
          tx(lang, "Choose the delivery zone.", "اختر منطقة التوصيل."),
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
      if (!form.ownerFullName.trim() || !form.ownerEmail.trim() || !phone) {
        showError(
          tx(lang, "Account data required", "بيانات الحساب مطلوبة"),
          tx(
            lang,
            "Enter owner name, email, and a valid Egyptian phone number.",
            "أدخل اسم صاحب الحساب، البريد الإلكتروني، ورقم هاتف مصري صحيح.",
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
    const next = steps[stepIndex + 1]?.key;
    if (next) setStep(next);
  };

  const goBack = () => {
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

    setSubmitting(true);
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
    <div
      dir={dir}
      className="flex min-h-screen flex-col bg-gradient-to-b from-background via-muted/30 to-background"
    >
      <main className="flex-1 pb-12 pt-5 sm:pt-7">
        <div className="container-page">
          <div className="flex items-center justify-between gap-4">
            <Link to="/" aria-label="Shoplanser home">
              <Logo size={44} tone="dark" />
            </Link>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setLang(lang === "ar" ? "en" : "ar")}
              className="min-w-24"
            >
              {lang === "ar" ? "English" : "العربية"}
            </Button>
          </div>

          {entryMode === "choice" ? (
            <div className="mx-auto mt-10 max-w-5xl">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
              >
                <ArrowLeft
                  className={`h-4 w-4 ${dir === "rtl" ? "rotate-180" : ""}`}
                />
                {tx(lang, "Back to home", "العودة للرئيسية")}
              </Link>

              <section className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-card sm:p-8">
                <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                  <div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Store className="h-6 w-6" />
                    </div>
                    <h1 className="mt-4 max-w-2xl text-2xl font-extrabold sm:text-3xl">
                      {tx(
                        lang,
                        "Create a new store or enter your existing store",
                        "إنشاء متجر جديد أو الدخول لمتجر سابق",
                      )}
                    </h1>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
                      {tx(
                        lang,
                        "Choose how you want to continue. New merchants can complete the store form using a phone number, email, and password.",
                        "اختر كيف تريد المتابعة. التاجر الجديد يكمل بيانات المتجر برقم الهاتف والبريد وكلمة السر.",
                      )}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Button
                      type="button"
                      onClick={() => setEntryMode("create")}
                      className="h-auto w-full justify-start gap-3 rounded-xl p-4 text-start"
                    >
                      <Store className="h-5 w-5 shrink-0" />
                      <span>
                        <span className="block font-extrabold">
                          {tx(lang, "Create new store", "إنشاء متجر جديد")}
                        </span>
                        <span className="mt-1 block text-xs font-semibold opacity-85">
                          {tx(
                            lang,
                            "Continue with phone and password in the final step.",
                            "أكمل برقم الهاتف وكلمة السر في الخطوة الأخيرة.",
                          )}
                        </span>
                      </span>
                    </Button>

                    <Button
                      asChild
                      type="button"
                      variant="outline"
                      className="h-auto w-full justify-start gap-3 rounded-xl p-4 text-start"
                    >
                      <Link to="/vendor/login">
                        <LogIn className="h-5 w-5 shrink-0" />
                        <span>
                          <span className="block font-extrabold">
                            {tx(
                              lang,
                              "Enter an existing store",
                              "الدخول لمتجر سابق",
                            )}
                          </span>
                          <span className="mt-1 block text-xs font-semibold text-muted-foreground">
                            {tx(
                              lang,
                              "Use email or mobile number with password.",
                              "استخدم البريد أو رقم الهاتف مع كلمة السر.",
                            )}
                          </span>
                        </span>
                      </Link>
                    </Button>
                  </div>
                </div>
              </section>
            </div>
          ) : (
            <>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
                >
                  <ArrowLeft
                    className={`h-4 w-4 ${dir === "rtl" ? "rotate-180" : ""}`}
                  />
                  {tx(lang, "Back to home", "العودة للرئيسية")}
                </Link>
                <div className="min-w-[180px]">
                  <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground">
                    <span>
                      {tx(
                        lang,
                        `Step ${stepIndex + 1} of ${steps.length}`,
                        `الخطوة ${stepIndex + 1} من ${steps.length}`,
                      )}
                    </span>
                    <span>{Math.round(progressPct)}%</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
                <aside className="rounded-2xl border border-border bg-card p-4 shadow-card">
                  <div className="text-sm font-extrabold">
                    {tx(lang, "Create store flow", "مسار إنشاء المتجر")}
                  </div>
                  <div className="mt-4 flex gap-2 overflow-x-auto pb-1 lg:block lg:space-y-2 lg:overflow-visible lg:pb-0">
                    {steps.map((item, index) => {
                      const Icon = item.icon;
                      const active = item.key === step;
                      const done = index < stepIndex;
                      return (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => {
                            if (index <= stepIndex) setStep(item.key);
                          }}
                          className={`flex min-w-[112px] shrink-0 flex-col items-center justify-center gap-2 rounded-xl px-3 py-3 text-center text-xs transition-colors lg:w-full lg:min-w-0 lg:flex-row lg:justify-start lg:py-2 lg:text-start lg:text-sm ${
                            active
                              ? "bg-primary text-primary-foreground"
                              : done
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground"
                          }`}
                        >
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-background/20">
                            {done ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Icon className="h-4 w-4" />
                            )}
                          </span>
                          <span className="whitespace-nowrap font-bold">
                            {item.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </aside>

                <section className="rounded-2xl border border-border bg-card p-5 shadow-card sm:p-8">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wide text-primary">
                      {steps[stepIndex].label}
                    </div>
                    <h1 className="mt-2 text-2xl font-extrabold sm:text-3xl">
                      {tx(lang, title.en, title.ar)}
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {tx(lang, title.subEn, title.subAr)}
                    </p>
                  </div>

                  <div className="mt-8">
                    {step === "store" && (
                      <div className="space-y-6">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <Field
                            label={tx(lang, "Store name *", "اسم المتجر *")}
                          >
                            <Input
                              dir="ltr"
                              value={form.storeName}
                              onChange={(event) =>
                                updateStoreName(event.target.value)
                              }
                              placeholder={tx(
                                lang,
                                "Example Market",
                                "مثال ماركت",
                              )}
                            />
                          </Field>
                          <Field
                            label={tx(lang, "Business type *", "نوع النشاط *")}
                          >
                            <Select
                              value={form.moduleId}
                              onValueChange={(value) =>
                                update("moduleId", value)
                              }
                              disabled={!form.zoneId || modules.length === 0}
                            >
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={tx(
                                    lang,
                                    "Choose business type",
                                    "اختر نوع النشاط",
                                  )}
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
                          label={tx(lang, "Store link *", "رابط المتجر *")}
                        >
                          <div
                            dir="ltr"
                            className="flex overflow-hidden rounded-lg border border-input bg-background focus-within:ring-2 focus-within:ring-ring"
                          >
                            <span className="hidden items-center bg-muted px-3 font-mono text-xs text-muted-foreground sm:flex">
                              store.shoplanser.com/
                            </span>
                            <Input
                              dir="ltr"
                              value={form.slug}
                              onChange={(event) =>
                                updateSlug(event.target.value)
                              }
                              placeholder={
                                toStoreSlug(form.storeName) || "my-store"
                              }
                              className="border-0 font-mono focus-visible:ring-0"
                            />
                          </div>
                          <div className="mt-2 min-h-5 text-xs">
                            {slugStatus === "checking" && (
                              <span className="text-muted-foreground">
                                {tx(
                                  lang,
                                  "Checking link...",
                                  "جارٍ التحقق من الرابط...",
                                )}
                              </span>
                            )}
                            {slugStatus === "available" && (
                              <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
                                <Check className="h-3.5 w-3.5" />
                                {slugMessage}
                              </span>
                            )}
                            {slugStatus === "taken" && (
                              <span className="font-semibold text-destructive">
                                {slugMessage}
                              </span>
                            )}
                          </div>
                        </Field>

                        <div>
                          <Label className="flex items-center gap-2 text-sm font-bold">
                            <Palette className="h-4 w-4 text-primary" />
                            {tx(lang, "Store color", "لون المتجر")}
                          </Label>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {STORE_COLORS.map((color) => (
                              <button
                                key={color}
                                type="button"
                                aria-label={color}
                                onClick={() => update("color", color)}
                                className={`h-10 w-10 rounded-xl ring-offset-2 transition ${
                                  form.color === color
                                    ? "ring-2 ring-primary"
                                    : "ring-1 ring-border"
                                }`}
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                        </div>

                        <div className="max-w-md">
                          <FileField
                            label={tx(lang, "Store logo", "شعار المتجر")}
                            file={form.logo}
                            onChange={(file) => update("logo", file ?? null)}
                          />
                        </div>
                      </div>
                    )}

                    {step === "delivery" && (
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-4 sm:col-span-2 sm:grid-cols-[1fr_220px]">
                          <Field
                            label={tx(lang, "Delivery fee *", "سعر التوصيل *")}
                          >
                            <Input
                              inputMode="decimal"
                              value={form.deliveryPrice}
                              onChange={(event) =>
                                update("deliveryPrice", event.target.value)
                              }
                              placeholder="20"
                            />
                          </Field>
                          <Field
                            label={tx(
                              lang,
                              "Delivery currency",
                              "عملة التوصيل",
                            )}
                          >
                            <Select
                              value={form.deliveryCurrency}
                              onValueChange={(value) =>
                                update("deliveryCurrency", value)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {DELIVERY_CURRENCIES.map((currency) => (
                                  <SelectItem
                                    key={currency.value}
                                    value={currency.value}
                                  >
                                    {tx(lang, currency.en, currency.ar)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </Field>
                        </div>
                        <Field
                          label={tx(
                            lang,
                            "Minimum delivery time",
                            "أقل وقت توصيل",
                          )}
                        >
                          <MinuteInput
                            value={form.minDelivery}
                            onChange={(value) => update("minDelivery", value)}
                            unit={tx(lang, "Minutes", "دقيقة")}
                          />
                        </Field>
                        <Field
                          label={tx(
                            lang,
                            "Maximum delivery time",
                            "أقصى وقت توصيل",
                          )}
                        >
                          <MinuteInput
                            value={form.maxDelivery}
                            onChange={(value) => update("maxDelivery", value)}
                            unit={tx(lang, "Minutes", "دقيقة")}
                          />
                        </Field>
                        <div className="sm:col-span-2 rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm font-semibold text-muted-foreground">
                          {tx(
                            lang,
                            "You can edit delivery prices and store details later from store settings in the app.",
                            "يمكنك تعديل أسعار التوصيل وبيانات المتجر لاحقًا من إعدادات المتجر في التطبيق.",
                          )}
                        </div>
                        <div className="sm:col-span-2">
                          <label className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-4 text-sm font-semibold">
                            <Checkbox
                              checked={form.isOpen24Hours}
                              onCheckedChange={(checked) =>
                                update("isOpen24Hours", checked === true)
                              }
                            />
                            <span>
                              {tx(lang, "Open 24 hours", "مفتوح 24 ساعة")}
                            </span>
                          </label>
                        </div>
                        {!form.isOpen24Hours && (
                          <>
                            <Field
                              label={tx(lang, "Opening time", "وقت الفتح")}
                            >
                              <Input
                                type="time"
                                value={form.openingTime}
                                onChange={(event) =>
                                  update("openingTime", event.target.value)
                                }
                              />
                            </Field>
                            <Field
                              label={tx(lang, "Closing time", "وقت الإغلاق")}
                            >
                              <Input
                                type="time"
                                value={form.closingTime}
                                onChange={(event) =>
                                  update("closingTime", event.target.value)
                                }
                              />
                            </Field>
                          </>
                        )}
                      </div>
                    )}

                    {step === "location" && (
                      <div className="space-y-5">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <Field label={tx(lang, "Address *", "العنوان *")}>
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
                            />
                          </Field>
                          <Field
                            label={tx(
                              lang,
                              "Delivery zone *",
                              "منطقة التوصيل *",
                            )}
                          >
                            <Select
                              value={form.zoneId}
                              onValueChange={(value) => update("zoneId", value)}
                              disabled={loadingMeta || zones.length === 0}
                            >
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={tx(
                                    lang,
                                    "Choose zone",
                                    "اختر المنطقة",
                                  )}
                                />
                              </SelectTrigger>
                              <SelectContent>
                                {zones.map((zone) => (
                                  <SelectItem
                                    key={zone.id}
                                    value={String(zone.id)}
                                  >
                                    {zone.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </Field>
                        </div>
                        <div>
                          <Label className="flex items-center gap-2 text-sm font-bold">
                            <MapPin className="h-4 w-4 text-primary" />
                            {tx(lang, "Map pin", "تحديد الموقع")}
                          </Label>
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

                    {step === "categories" && (
                      <div>
                        {categories.length === 0 ? (
                          <div className="rounded-xl border border-dashed border-border bg-muted/30 p-6 text-sm text-muted-foreground">
                            {tx(
                              lang,
                              "No categories found for this business type.",
                              "لا توجد أصناف لهذا النشاط.",
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
                                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors ${
                                    checked
                                      ? "border-primary bg-primary/10 text-primary"
                                      : "border-border bg-background"
                                  }`}
                                >
                                  <Checkbox
                                    checked={checked}
                                    onCheckedChange={(nextChecked) => {
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
                                  <span className="font-semibold">
                                    {category.name}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}

                    {step === "plan" && (
                      <div className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <PlanOption
                            active={form.businessPlan === "commission"}
                            icon={<ShieldCheck className="h-5 w-5" />}
                            title={tx(lang, "Commission", "بالعمولة")}
                            badge={tx(
                              lang,
                              "No monthly fee",
                              "بدون اشتراك شهري",
                            )}
                            price="1%"
                            activeLabel={tx(lang, "Selected", "محدد")}
                            actionLabel={tx(lang, "Select", "اختيار")}
                            features={commissionFeatures}
                            description={tx(
                              lang,
                              "Pay a small commission only when orders come in.",
                              "عمولة بسيطة فقط على الطلبات التي تصلك.",
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
                            price={tx(
                              lang,
                              "800 EGP / month",
                              "٨٠٠ جنيه / شهريًا",
                            )}
                            activeLabel={tx(lang, "Selected", "محدد")}
                            actionLabel={tx(lang, "Select", "اختيار")}
                            features={subscriptionFeatures}
                            description={tx(
                              lang,
                              "Choose a 6-month or yearly subscription package.",
                              "اختر باقة اشتراك لمدة ٦ شهور أو سنة.",
                            )}
                            onClick={() =>
                              setForm((current) => ({
                                ...current,
                                businessPlan: "subscription",
                                packageId:
                                  current.packageId === "1y" ? "1y" : "6m",
                              }))
                            }
                          />
                        </div>

                        {form.businessPlan === "subscription" && (
                          <div className="space-y-4">
                            <div className="grid gap-3 sm:grid-cols-2">
                              {[
                                {
                                  id: "6m",
                                  title: tx(lang, "6 months", "٦ شهور"),
                                  badge: tx(
                                    lang,
                                    "Fast launch",
                                    "انطلاقة سريعة",
                                  ),
                                  total: tx(
                                    lang,
                                    "4,800 EGP total",
                                    "الإجمالي ٤,٨٠٠ جنيه",
                                  ),
                                  features: [
                                    tx(
                                      lang,
                                      "Ideal to test and grow your store",
                                      "مثالية لتجربة متجرك وتنميته",
                                    ),
                                    tx(
                                      lang,
                                      "No sales commission during the subscription",
                                      "بدون عمولة على المبيعات أثناء الاشتراك",
                                    ),
                                    tx(
                                      lang,
                                      "Full technical support throughout the period",
                                      "دعم فني كامل طوال مدة الاشتراك",
                                    ),
                                  ],
                                },
                                {
                                  id: "1y",
                                  title: tx(lang, "1 year", "سنة"),
                                  badge: tx(
                                    lang,
                                    "Best stability",
                                    "استقرار أفضل",
                                  ),
                                  total: tx(
                                    lang,
                                    "9,600 EGP total",
                                    "الإجمالي ٩,٦٠٠ جنيه",
                                  ),
                                  features: [
                                    tx(
                                      lang,
                                      "Best for committed long-term growth",
                                      "الأفضل للنمو المستمر على المدى الطويل",
                                    ),
                                    tx(
                                      lang,
                                      "No sales commission for a full year",
                                      "بدون عمولة على المبيعات لمدة سنة كاملة",
                                    ),
                                    tx(
                                      lang,
                                      "More stability for planning campaigns and sales",
                                      "استقرار أكبر لتخطيط الحملات والمبيعات",
                                    ),
                                  ],
                                },
                              ].map((term) => (
                                <button
                                  key={term.id}
                                  type="button"
                                  onClick={() => update("packageId", term.id)}
                                  className={`rounded-xl border p-4 text-start transition-colors ${
                                    selectedSubscriptionTerm === term.id
                                      ? "border-primary bg-primary/10 text-primary"
                                      : "border-border bg-background hover:border-primary/40"
                                  }`}
                                >
                                  <span className="flex items-center justify-between gap-3">
                                    <span className="text-base font-extrabold">
                                      {term.title}
                                    </span>
                                    <span className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs font-bold text-muted-foreground">
                                      {term.badge}
                                      {selectedSubscriptionTerm === term.id && (
                                        <Check className="h-4 w-4 text-primary" />
                                      )}
                                    </span>
                                  </span>
                                  <span className="mt-3 block text-2xl font-extrabold">
                                    {tx(lang, "800 EGP", "٨٠٠ جنيه")}
                                    <span className="text-sm font-bold text-muted-foreground">
                                      {" "}
                                      {tx(lang, "/ month", "/ شهريًا")}
                                    </span>
                                  </span>
                                  <span className="mt-2 block text-sm font-semibold text-muted-foreground">
                                    {term.total}
                                  </span>
                                  <ul className="mt-4 space-y-2 text-sm font-semibold text-muted-foreground">
                                    {term.features.map((feature) => (
                                      <li
                                        key={feature}
                                        className="flex items-start gap-2"
                                      >
                                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                        <span>{feature}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </button>
                              ))}
                            </div>

                            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm font-semibold text-muted-foreground">
                              <div>
                                {tx(
                                  lang,
                                  "To activate the subscription, contact Shoplanser support.",
                                  "لتفعيل الاشتراك يجب التواصل مع الدعم الفني لشوب لانسر.",
                                )}
                              </div>
                              <a
                                href="https://wa.me/201036850264"
                                target="_blank"
                                rel="noreferrer"
                                className="mt-3 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary-hover"
                              >
                                {tx(
                                  lang,
                                  "WhatsApp support: +20 103 685 0264",
                                  "واتساب الدعم: +20 103 685 0264",
                                )}
                              </a>
                            </div>
                          </div>
                        )}

                        <div className="rounded-xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
                          {form.businessPlan === "commission"
                            ? tx(
                                lang,
                                "Selected: 1% commission on orders.",
                                "المحدد: عمولة ١٪ على الطلبات.",
                              )
                            : selectedSubscriptionTerm === "1y"
                              ? tx(
                                  lang,
                                  "Selected: yearly subscription, 800 EGP monthly.",
                                  "المحدد: اشتراك سنوي، ٨٠٠ جنيه شهريًا.",
                                )
                              : tx(
                                  lang,
                                  "Selected: 6-month subscription, 800 EGP monthly.",
                                  "المحدد: اشتراك ٦ شهور، ٨٠٠ جنيه شهريًا.",
                                )}
                        </div>
                      </div>
                    )}

                    {step === "account" && (
                      <div className="space-y-5">
                        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm text-muted-foreground">
                          {tx(
                            lang,
                            "User registration is the final step. Enter the account details that will manage this store.",
                            "تسجيل المستخدم هو آخر خطوة. أدخل بيانات الحساب الذي سيدير هذا المتجر.",
                          )}
                        </div>
                        <div className="grid gap-3 rounded-xl border border-border bg-muted/20 p-4 sm:grid-cols-[1fr_auto] sm:items-center">
                          <div>
                            <div className="text-sm font-extrabold">
                              {tx(
                                lang,
                                "Already have a store?",
                                "لديك متجر مسجل مسبقًا؟",
                              )}
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {tx(
                                lang,
                                "Sign in and return to the QR page for your store.",
                                "سجّل الدخول وارجع إلى صفحة الـ QR الخاصة بمتجرك.",
                              )}
                            </p>
                          </div>
                          <Button asChild type="button" variant="outline">
                            <Link to="/vendor/login" className="gap-2">
                              <LogIn className="h-4 w-4" />
                              {tx(lang, "Enter your store", "الدخول إلى متجرك")}
                            </Link>
                          </Button>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <Field
                            label={tx(
                              lang,
                              "Owner full name *",
                              "اسم صاحب الحساب *",
                            )}
                          >
                            <Input
                              value={form.ownerFullName}
                              onChange={(event) =>
                                update("ownerFullName", event.target.value)
                              }
                            />
                          </Field>
                          <Field
                            label={tx(lang, "Email *", "البريد الإلكتروني *")}
                          >
                            <Input
                              type="email"
                              value={form.ownerEmail}
                              onChange={(event) =>
                                update("ownerEmail", event.target.value)
                              }
                            />
                          </Field>
                          <Field label={tx(lang, "Phone *", "رقم الهاتف *")}>
                            <Input
                              dir="ltr"
                              inputMode="tel"
                              value={form.ownerPhone}
                              onChange={(event) =>
                                update("ownerPhone", event.target.value)
                              }
                              placeholder="01000000000"
                            />
                          </Field>
                          <SummaryPill
                            icon={<Store className="h-4 w-4" />}
                            label={tx(lang, "Store", "المتجر")}
                            value={form.storeName || "-"}
                          />
                          <Field
                            label={tx(lang, "Password *", "كلمة المرور *")}
                          >
                            <Input
                              type="password"
                              value={form.ownerPassword}
                              onChange={(event) =>
                                update("ownerPassword", event.target.value)
                              }
                            />
                          </Field>
                          <Field
                            label={tx(
                              lang,
                              "Confirm password *",
                              "تأكيد كلمة المرور *",
                            )}
                          >
                            <Input
                              type="password"
                              value={form.ownerPasswordConfirm}
                              onChange={(event) =>
                                update(
                                  "ownerPasswordConfirm",
                                  event.target.value,
                                )
                              }
                            />
                          </Field>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={goBack}
                      disabled={stepIndex === 0 || submitting}
                      className="gap-2"
                    >
                      <ArrowLeft
                        className={`h-4 w-4 ${dir === "rtl" ? "rotate-180" : ""}`}
                      />
                      {tx(lang, "Back", "رجوع")}
                    </Button>

                    {step === "account" ? (
                      <Button
                        type="button"
                        onClick={submit}
                        disabled={submitting}
                        className="gap-2"
                      >
                        {submitting ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Check className="h-4 w-4" />
                        )}
                        {tx(
                          lang,
                          "Create store and account",
                          "إنشاء المتجر والحساب",
                        )}
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        onClick={goNext}
                        disabled={submitting}
                        className="gap-2"
                      >
                        {tx(lang, "Continue", "متابعة")}
                        <ArrowRight
                          className={`h-4 w-4 ${dir === "rtl" ? "rotate-180" : ""}`}
                        />
                      </Button>
                    )}
                  </div>
                </section>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div>
    <Label className="text-sm font-bold text-foreground">{label}</Label>
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
    className="flex overflow-hidden rounded-lg border border-input bg-background focus-within:ring-2 focus-within:ring-ring"
  >
    <Input
      inputMode="numeric"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="border-0 focus-visible:ring-0"
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
}: {
  label: string;
  file: File | null;
  onChange: (file?: File) => void;
}) => (
  <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-border bg-muted/30 p-4 transition-colors hover:bg-muted/50">
    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
      {file ? (
        <ImagePlus className="h-5 w-5" />
      ) : (
        <Upload className="h-5 w-5" />
      )}
    </span>
    <span className="min-w-0 flex-1">
      <span className="block text-sm font-bold">{label}</span>
      <span className="block truncate text-xs text-muted-foreground">
        {file?.name ?? "PNG, JPG, WebP"}
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
  activeLabel,
  actionLabel,
  features,
  description,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  title: string;
  badge: string;
  price: string;
  activeLabel: string;
  actionLabel: string;
  features: string[];
  description: string;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`group rounded-xl border p-5 text-start transition-all ${
      active
        ? "border-primary bg-primary/10 text-primary shadow-card"
        : "border-border bg-background hover:border-primary/40 hover:shadow-card"
    }`}
  >
    <span className="flex items-start justify-between gap-3">
      <span className="flex items-center gap-2 text-base font-extrabold">
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${
            active
              ? "bg-primary text-primary-foreground"
              : "bg-primary/10 text-primary"
          }`}
        >
          {icon}
        </span>
        {title}
      </span>
      <span className="rounded-full bg-muted px-3 py-1 text-xs font-bold text-muted-foreground">
        {badge}
      </span>
    </span>
    <span className="mt-5 block text-3xl font-extrabold text-foreground">
      {price}
    </span>
    <span className="mt-3 block text-sm font-semibold text-muted-foreground">
      {description}
    </span>
    <ul className="mt-5 space-y-2 text-sm font-semibold text-muted-foreground">
      {features.map((feature) => (
        <li key={feature} className="flex items-start gap-2">
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
    <span
      className={`mt-5 flex items-center justify-center rounded-lg border py-2 text-sm font-bold ${
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border text-foreground group-hover:border-primary/40"
      }`}
    >
      {active ? activeLabel : actionLabel}
    </span>
  </button>
);

const SummaryPill = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="rounded-xl border border-border bg-muted/30 p-3">
    <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
      {icon}
      {label}
    </div>
    <div className="mt-1 truncate text-sm font-bold text-foreground">
      {value}
    </div>
  </div>
);

export default VendorApply;
