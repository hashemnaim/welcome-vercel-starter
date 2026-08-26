import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  Crown,
  MapPin,
  PackageOpen,
  Palette,
  QrCode,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Store,
  Tag,
  Truck,
  UserRound,
} from "lucide-react";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { useLanguage } from "@/i18n/LanguageContext";
import { Link } from "@/lib/router-compat";

const tx = (lang: "en" | "ar", en: string, ar: string) =>
  lang === "ar" ? ar : en;

const HowItWorks = () => {
  const { lang, dir } = useLanguage();
  const isAr = lang === "ar";

  const platformSteps = [
    {
      icon: Store,
      title: tx(lang, "Create your storefront", "أنشئ واجهة متجرك"),
      description: tx(
        lang,
        "Choose your store name, identity, categories, location, and delivery settings from one guided flow.",
        "اختر اسم متجرك وهويته وتصنيفاته وموقعه وإعدادات التوصيل من خلال خطوات واضحة ومترابطة.",
      ),
    },
    {
      icon: PackageOpen,
      title: tx(lang, "Manage products and orders", "أدِر المنتجات والطلبات"),
      description: tx(
        lang,
        "Use the merchant tools to manage your catalog, prices, availability, and incoming customer orders.",
        "استخدم أدوات التاجر لإدارة المنتجات والأسعار والتوفر والطلبات القادمة من العملاء.",
      ),
    },
    {
      icon: QrCode,
      title: tx(lang, "Share your store", "شارك متجرك"),
      description: tx(
        lang,
        "Your store gets a shareable link and QR code that you can publish on social media, packaging, or inside the shop.",
        "تحصل على رابط مباشر وQR للمتجر يمكنك مشاركته على السوشال ميديا أو المطبوعات أو داخل المحل.",
      ),
    },
    {
      icon: BarChart3,
      title: tx(lang, "Operate and grow", "شغّل متجرك وطوّره"),
      description: tx(
        lang,
        "Follow orders, organize delivery, and keep your online storefront updated as your business grows.",
        "تابع الطلبات ونظّم التوصيل وحافظ على تحديث متجرك الإلكتروني مع نمو نشاطك.",
      ),
    },
  ];

  const registrationSteps = [
    {
      icon: Palette,
      title: tx(lang, "Store details", "بيانات المتجر"),
      description: tx(
        lang,
        "Add the store name, business type, brand color, logo, and the public storefront link.",
        "أدخل اسم المتجر ونوع النشاط ولون الهوية والشعار وحدد رابط المتجر الذي سيظهر للعملاء.",
      ),
    },
    {
      icon: MapPin,
      title: tx(lang, "Location", "موقع المتجر"),
      description: tx(
        lang,
        "Choose the service zone and set the store address and map location.",
        "اختر منطقة الخدمة وحدد عنوان المتجر وموقعه على الخريطة.",
      ),
    },
    {
      icon: Truck,
      title: tx(lang, "Delivery and hours", "التوصيل ومواعيد العمل"),
      description: tx(
        lang,
        "Set the delivery fee, currency, expected delivery time, and working hours.",
        "حدد سعر التوصيل والعملة ومدة التوصيل المتوقعة ومواعيد استقبال الطلبات.",
      ),
    },
    {
      icon: Tag,
      title: tx(lang, "Categories", "الأصناف"),
      description: tx(
        lang,
        "Select the categories that best describe the products your store sells.",
        "اختر التصنيفات الأقرب للمنتجات التي يبيعها متجرك حتى يظهر في المكان المناسب.",
      ),
    },
    {
      icon: Crown,
      title: tx(lang, "Plan", "اختر الباقة"),
      description: tx(
        lang,
        "Choose the commission model or one of the available subscription options based on your business.",
        "اختر نظام العمولة أو إحدى باقات الاشتراك المتاحة حسب ما يناسب نشاطك.",
      ),
    },
    {
      icon: UserRound,
      title: tx(lang, "Owner account", "حساب صاحب المتجر"),
      description: tx(
        lang,
        "Finish by adding the owner's name, email, phone number, and password used to manage the store.",
        "أكمل التسجيل بإضافة اسم صاحب المتجر والبريد ورقم الهاتف وكلمة المرور التي ستستخدم لإدارة المتجر.",
      ),
    },
  ];

  const afterRegistration = [
    tx(
      lang,
      "Your storefront becomes available with its own direct link.",
      "يصبح متجرك متاحًا برابط مباشر خاص به.",
    ),
    tx(
      lang,
      "A QR code is generated so customers can open the store instantly.",
      "يتم إنشاء QR يمكنك مشاركته أو طباعته لفتح المتجر مباشرة.",
    ),
    tx(
      lang,
      "You can use the same account credentials with the merchant tools to manage the store and orders.",
      "يمكنك استخدام نفس بيانات الحساب في أدوات التاجر لإدارة المتجر والطلبات.",
    ),
    tx(
      lang,
      "Delivery operations can be organized through the delivery workflow when needed.",
      "يمكن تنظيم عمليات التوصيل من خلال منظومة التوصيل عند الحاجة.",
    ),
  ];

  return (
    <div
      className={`min-h-screen bg-background ${isAr ? "font-arabic" : ""}`}
      dir={dir}
    >
      <Header />

      <main className="overflow-hidden pt-24">
        <section className="relative border-b border-border/60 bg-gradient-to-b from-primary/8 via-background to-background py-20 sm:py-24">
          <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-72 max-w-4xl rounded-full bg-primary/10 blur-3xl" />
          <div className="container-page relative">
            <div className="mx-auto max-w-4xl text-center">
              <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-4 py-2 text-sm font-bold text-primary">
                <Sparkles className="h-4 w-4" />
                {tx(lang, "From registration to your first order", "من التسجيل إلى أول طلب")}
              </div>

              <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                {tx(lang, "How does Shoplanser work?", "كيف تعمل منصة شوب لانسر؟")}
              </h1>

              <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                {tx(
                  lang,
                  "Shoplanser gives local merchants a simple path to create an online storefront, share it with customers, receive orders, and manage daily operations without building an ecommerce system from scratch.",
                  "شوب لانسر تعطي التاجر طريقًا بسيطًا لإنشاء متجر إلكتروني، مشاركته مع العملاء، استقبال الطلبات وإدارة التشغيل اليومي بدون الحاجة لبناء نظام تجارة إلكترونية من الصفر.",
                )}
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  to="/vendor/apply"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-7 text-sm font-extrabold text-primary-foreground shadow-elevated transition hover:-translate-y-0.5"
                >
                  {tx(lang, "Create your store", "ابدأ إنشاء متجرك")}
                  <ArrowLeft
                    className={`h-4 w-4 ${dir === "ltr" ? "rotate-180" : ""}`}
                  />
                </Link>
                <a
                  href="#registration"
                  className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-card px-7 text-sm font-bold text-foreground shadow-card transition hover:bg-muted"
                >
                  {tx(lang, "See registration steps", "شاهد خطوات التسجيل")}
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container-page">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-extrabold text-primary">
                {tx(lang, "THE PLATFORM", "آلية عمل المنصة")}
              </p>
              <h2 className="mt-3 text-3xl font-black text-foreground sm:text-4xl">
                {tx(lang, "One flow for your online business", "منظومة واحدة لتشغيل متجرك أونلاين")}
              </h2>
              <p className="mt-4 leading-7 text-muted-foreground">
                {tx(
                  lang,
                  "The platform connects the storefront, merchant operations, customer orders, and delivery flow so you can manage the full journey from one ecosystem.",
                  "المنصة تربط واجهة المتجر وإدارة التاجر وطلبات العملاء والتوصيل ضمن منظومة واحدة تساعدك على إدارة الرحلة كاملة.",
                )}
              </p>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {platformSteps.map(({ icon: Icon, title, description }, index) => (
                <article
                  key={title}
                  className="relative rounded-3xl border border-border bg-card p-6 shadow-card"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" />
                    </span>
                    <span className="text-4xl font-black text-primary/10">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="mt-5 text-lg font-extrabold text-foreground">{title}</h3>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    {description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="registration" className="scroll-mt-28 bg-muted/35 py-20">
          <div className="container-page">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-extrabold text-primary">
                {tx(lang, "REGISTRATION", "طريقة التسجيل")}
              </p>
              <h2 className="mt-3 text-3xl font-black text-foreground sm:text-4xl">
                {tx(lang, "Register your store in 6 clear steps", "سجّل متجرك في 6 خطوات واضحة")}
              </h2>
              <p className="mt-4 leading-7 text-muted-foreground">
                {tx(
                  lang,
                  "The registration form guides you step by step and only asks for the information needed to prepare your storefront and merchant account.",
                  "نموذج التسجيل يأخذك خطوة بخطوة ويطلب فقط المعلومات اللازمة لتجهيز المتجر وحساب التاجر.",
                )}
              </p>
            </div>

            <div className="mx-auto mt-12 max-w-5xl space-y-4">
              {registrationSteps.map(({ icon: Icon, title, description }, index) => (
                <article
                  key={title}
                  className="grid gap-5 rounded-3xl border border-border bg-card p-5 shadow-card sm:grid-cols-[72px_1fr] sm:items-center sm:p-6"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
                    <Icon className="h-7 w-7" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-xs font-black uppercase tracking-widest text-primary">
                        {tx(lang, `Step ${index + 1}`, `الخطوة ${index + 1}`)}
                      </span>
                      <h3 className="text-xl font-extrabold text-foreground">{title}</h3>
                    </div>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground sm:text-base">
                      {description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container-page">
            <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
              <div>
                <p className="text-sm font-extrabold text-primary">
                  {tx(lang, "AFTER REGISTRATION", "بعد التسجيل")}
                </p>
                <h2 className="mt-3 text-3xl font-black text-foreground sm:text-4xl">
                  {tx(lang, "Your store is ready to be shared", "متجرك يصبح جاهزًا للمشاركة")}
                </h2>
                <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
                  {tx(
                    lang,
                    "Once registration is completed, Shoplanser prepares the storefront and gives you the tools needed to start operating it.",
                    "بعد إكمال التسجيل تجهز شوب لانسر واجهة متجرك وتوفر لك الأدوات التي تحتاجها لبدء التشغيل.",
                  )}
                </p>

                <div className="mt-7 space-y-4">
                  {afterRegistration.map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-primary" />
                      <p className="leading-7 text-foreground/85">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[32px] border border-primary/15 bg-primary p-7 text-primary-foreground shadow-elevated sm:p-9">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                    <ShoppingCart className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-white/65">
                      {tx(lang, "NEXT STEP", "الخطوة التالية")}
                    </p>
                    <h3 className="text-2xl font-black">
                      {tx(lang, "Start building your store", "ابدأ بناء متجرك")}
                    </h3>
                  </div>
                </div>

                <p className="mt-5 leading-7 text-white/80">
                  {tx(
                    lang,
                    "You can start the registration flow now and complete the six steps from your phone or computer.",
                    "يمكنك بدء التسجيل الآن وإكمال الخطوات الست من الهاتف أو الكمبيوتر.",
                  )}
                </p>

                <Link
                  to="/vendor/apply"
                  className="mt-7 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-black text-primary transition hover:bg-white/90"
                >
                  <Smartphone className="h-4 w-4" />
                  {tx(lang, "Register my store", "سجّل متجري الآن")}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HowItWorks;
