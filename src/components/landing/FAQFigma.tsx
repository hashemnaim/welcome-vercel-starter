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
          q: "كم يستغرق إطلاق المتجر؟",
          a: "دقيقة واحدة فقط لإنشاء الحساب، ثم دقائق لإضافة منتجاتك الأولى.",
        },
        {
          q: "هل هناك عمولة على المبيعات؟",
          a: "لا، جميع باقات ستارت ونمو بدون أي عمولة على المبيعات.",
        },
        {
          q: "هل يمكنني تخصيص شكل المتجر؟",
          a: "نعم، تختار الثيم، الألوان، والشعار — كل شيء قابل للتعديل.",
        },
        {
          q: "هل هناك تطبيق للجوال؟",
          a: "نعم، تطبيق كامل على أندرويد و iOS بهوية متجرك الخاصة.",
        },
        {
          q: "كيف أستقبل المدفوعات؟",
          a: "ندعم البوابات المحلية والدفع عند الاستلام والتحويل البنكي.",
        },
      ]
    : [
        {
          q: "How long does it take to launch?",
          a: "Just one minute to create the account, then a few more to add your first products.",
        },
        {
          q: "Are there any sales commissions?",
          a: "No, all Start and Growth plans have zero commission on sales.",
        },
        {
          q: "Can I customize the storefront?",
          a: "Yes — theme, colors, and logo are all editable.",
        },
        {
          q: "Is there a mobile app?",
          a: "Yes, a full Android and iOS app branded with your store identity.",
        },
        {
          q: "How do I receive payments?",
          a: "We support local gateways, cash on delivery, and bank transfer.",
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
