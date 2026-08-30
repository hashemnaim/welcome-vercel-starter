import { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Plus, Minus } from "lucide-react";

export const FAQFigma = () => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = isAr
    ? [
        {
          q: "كم يستغرق إنشاء المتجر؟",
          a: "يمكنك إنشاء متجرك خلال دقائق، ثم تسجيل الدخول وإضافة منتجاتك وتجهيز المتجر للعملاء.",
        },
        {
          q: "هل هناك عمولة على المبيعات؟",
          a: "يوجد خياران: باقة العمولة بنسبة 1% على المبيعات بدون اشتراك شهري، أو باقة اشتراك بدون عمولة على المبيعات.",
        },
        {
          q: "هل يمكنني تخصيص هوية المتجر؟",
          a: "نعم، يمكنك تحديد اسم المتجر والشعار واللون الرئيسي والرابط الخاص بمتجرك أثناء الإنشاء.",
        },
        {
          q: "هل يوجد تطبيق للتاجر؟",
          a: "نعم، يوجد تطبيق احترافي للتاجر لإدارة المنتجات والطلبات ومتابعة المتجر بسهولة.",
        },
        {
          q: "كيف أستقبل المدفوعات؟",
          a: "تستقبل المدفوعات مباشرة من العميل؛ إما نقدًا عند الاستلام، أو عبر محافظك الإلكترونية وحساباتك الشخصية التي تحددها للعميل.",
        },
        {
          q: "متى يصبح المتجر جاهزًا للعملاء؟",
          a: "بعد إنشاء المتجر وتسجيل الدخول، أضف منتجاتك. بمجرد وجود منتجات جاهزة للعرض يمكنك مشاركة رابط متجرك والبدء باستقبال العملاء والطلبات.",
        },
      ]
    : [
        {
          q: "How long does it take to create a store?",
          a: "You can create your store in minutes, then sign in, add your products, and prepare it for customers.",
        },
        {
          q: "Are there sales commissions?",
          a: "There are two options: a 1% commission plan with no monthly subscription, or a subscription plan with no sales commission.",
        },
        {
          q: "Can I customize my store identity?",
          a: "Yes. You can choose your store name, logo, primary color, and store URL during setup.",
        },
        {
          q: "Is there a merchant app?",
          a: "Yes. A professional merchant app is available to manage products, orders, and your store.",
        },
        {
          q: "How do I receive payments?",
          a: "You receive payments directly from customers, either as cash on delivery or through your own e-wallets and personal payment accounts.",
        },
        {
          q: "When is my store ready for customers?",
          a: "After creating the store and signing in, add your products. Once products are ready to display, you can share your store link and start receiving customers and orders.",
        },
      ];

  return (
    <section id="faq" className="bg-muted/30 py-10 md:py-16 scroll-mt-20">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            className={`text-3xl font-bold sm:text-4xl ${isAr ? "font-arabic" : ""}`}
          >
            {isAr
              ? "لديك استفسارات؟ نحن هنا للإجابة"
              : "Got questions? We've got answers"}
          </h2>
          <p className="mt-3 text-muted-foreground">
            {isAr
              ? "أكثر الأسئلة شيوعاً من أصحاب المتاجر."
              : "The most common questions from store owners."}
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-3xl space-y-3">
          {faqs.map((f, i) => {
            const isOpen = openIdx === i;
            return (
              <div
                key={i}
                className={`overflow-hidden rounded-2xl border transition-all ${
                  isOpen
                    ? "border-[hsl(var(--brand-navy))] bg-card shadow-card"
                    : "border-border bg-card"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                  className={`flex w-full items-center justify-between gap-4 px-5 py-4 ${isAr ? "font-arabic text-start" : "text-start"}`}
                >
                  <span className="text-base font-bold text-foreground">
                    {f.q}
                  </span>
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      isOpen
                        ? "bg-[hsl(var(--brand-orange))] text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isOpen ? (
                      <Minus className="h-4 w-4" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </span>
                </button>
                {isOpen && (
                  <div
                    className={`border-t border-border px-5 py-4 text-sm text-muted-foreground ${isAr ? "font-arabic text-start" : "text-start"}`}
                  >
                    {f.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
