import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useLanguage } from "@/i18n/LanguageContext";

const Refund = () => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";

  const sections = isAr
    ? [
        {
          title: "١. نطاق التطبيق",
          body: "تنطبق هذه السياسة على جميع عمليات الشراء والاشتراكات التي تتم عبر منصة شوب لانسر، بما في ذلك اشتراكات التجار والمنتجات والخدمات المدفوعة.",
        },
        {
          title: "٢. حق الاسترداد",
          body: "يحق للمستخدم طلب استرداد المبلغ المدفوع خلال 14 يوماً من تاريخ الشراء أو تفعيل الاشتراك، شريطة ألا يكون قد استخدم الخدمة بشكل مؤثر أو تسبب في تكلفة إضافية على المنصة.",
        },
        {
          title: "٣. طرق الاسترداد",
          body: "تتم عمليات الاسترداد عبر نفس وسيلة الدفع التي استُخدمت في الشراء، أو عبر التحويل البنكي أو رصيد المنصة، بحسب طبيعة المعاملة وموافقة الطرفين.",
        },
        {
          title: "٤. حالات لا تُسترد",
          body: "لا يتم استرداد المبالغ في الحالات التالية: الاشتراكات التي تم استخدامها بشكل فعّال، المنتجات الرقمية التي تم تسليمها، أو الطلبات التي تنتهك شروط استخدام المنصة.",
        },
        {
          title: "٥. إلغاء الاشتراك",
          body: "يمكن إلغاء الاشتراك في أي وقت من لوحة التحكم، ويتوقف التجديد التلقائي في الفترة التالية. لا يُسترد جزء من الاشتراك المستخدم إلا بموافقة إدارة المنصة.",
        },
        {
          title: "٦. مدة معالجة الاسترداد",
          body: "تُعالج طلبات الاسترداد خلال 5 إلى 10 أيام عمل، وقد تستغرق المبالغ المستردة وقتاً إضافياً لظهورها في حساب المستخدم حسب سياسة البنك أو مزود الدفع.",
        },
        {
          title: "٧. التواصل",
          body: "لأي استفسار أو طلب استرداد، يمكن التواصل معنا عبر البريد الإلكتروني: support@shoplancer.com",
        },
      ]
    : [
        {
          title: "1. Scope",
          body: "This policy applies to all purchases and subscriptions made through the Shoplanser platform, including merchant subscriptions, products, and paid services.",
        },
        {
          title: "2. Right to Refund",
          body: "Users may request a refund within 14 days of purchase or subscription activation, provided the service has not been materially used or caused additional cost to the platform.",
        },
        {
          title: "3. Refund Methods",
          body: "Refunds are issued through the original payment method used for the purchase, or via bank transfer or platform credit, depending on the transaction type and mutual agreement.",
        },
        {
          title: "4. Non-Refundable Cases",
          body: "Refunds are not granted for: subscriptions that have been actively used, delivered digital products, or orders that violate the platform's terms of use.",
        },
        {
          title: "5. Subscription Cancellation",
          body: "Subscriptions can be cancelled anytime from the dashboard, and automatic renewal stops for the next billing period. No partial refund is given for used subscriptions unless approved by platform management.",
        },
        {
          title: "6. Refund Processing Time",
          body: "Refund requests are processed within 5 to 10 business days. Refunded amounts may take additional time to appear in the user's account depending on bank or payment provider policies.",
        },
        {
          title: "7. Contact",
          body: "For any refund inquiry, please contact us at support@shoplancer.com",
        },
      ];

  return (
    <div className="min-h-screen bg-background pt-16">
      <Header />
      <main className="container-page py-16" dir={isAr ? "rtl" : "ltr"}>
        <h1
          className={`text-3xl font-extrabold tracking-tight sm:text-4xl ${isAr ? "font-arabic" : ""}`}
        >
          {isAr ? "سياسة الاسترداد" : "Refund Policy"}
        </h1>
        <p
          className={`mt-4 text-muted-foreground ${isAr ? "font-arabic" : ""}`}
        >
          {isAr
            ? "توضح هذه السياسة شروط وإجراءات استرداد المبالغ المدفوعة عبر منصة شوب لانسر."
            : "This policy outlines the conditions and procedures for refunding payments made through the SHOPLANCER platform."}
        </p>
        <div className="mt-8 space-y-6 text-sm leading-relaxed text-foreground/90">
          {sections.map((s) => (
            <section key={s.title} className={isAr ? "font-arabic" : ""}>
              <h2 className="text-lg font-bold">{s.title}</h2>
              <p className="mt-2 text-muted-foreground">{s.body}</p>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Refund;
