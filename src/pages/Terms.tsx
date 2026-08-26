import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useLanguage } from "@/i18n/LanguageContext";

const Terms = () => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";

  const sections = isAr
    ? [
        {
          title: "١. التعريفات",
          body: 'تشير "المنصة" إلى شوب لانسر وجميع خدماتها الرقمية. تشير "الخدمة" إلى الأدوات والمنتجات التي تتيح إنشاء وإدارة المتاجر الإلكترونية. يشير "المستخدم" إلى أي شخص يستخدم المنصة، بما في ذلك التجار والعملاء والزوار.',
        },
        {
          title: "٢. القبول والاستخدام",
          body: "باستخدامك للمنصة، فإنك توافق على الالتزام بهذه الشروط وسياسة الخصوصية. إذا كنت لا توافق على هذه الشروط، يجب عليك التوقف عن استخدام الخدمة. يجب أن تكون فوق 18 عامًا أو لديك أهلية قانونية لاستخدام الخدمات.",
        },
        {
          title: "٣. الحسابات",
          body: "يجب تقديم بيانات صحيحة ومحدثة. المستخدم مسؤول عن حماية بيانات تسجيل الدخول. يحق للمنصة تعليق أو إلغاء أي حساب في حال المخالفة.",
        },
        {
          title: "٤. طبيعة الخدمة",
          body: "توفر المنصة أدوات لإدارة المتاجر الإلكترونية، ولا تعتبر طرفًا في العلاقة بين التاجر والمستهلك. يتحمل التاجر كامل المسؤولية عن المنتجات، التسعير، الشحن، وخدمة العملاء.",
        },
        {
          title: "٥. المدفوعات والاشتراكات",
          body: "يتم فرض رسوم عمولة مقابل استخدام الخدمات. جميع المدفوعات غير قابلة للاسترداد إلا في الحالات المحددة. يجوز تعديل الأسعار وتغيير الباقات مع إشعار المستخدم مسبقًا.",
        },
        {
          title: "٦. المعاملات المالية",
          body: "تتم عمليات الدفع عبر مزودي خدمات طرف ثالث. يوافق المستخدم على شروط مزودي الدفع. يحق للمنصة إلغاء أي عملية مشبوهة أو غير قانونية.",
        },
        {
          title: "٧. المحتوى",
          body: "المستخدم مسؤول عن أي محتوى يقوم بنشره. يجب ألا ينتهك القوانين، حقوق الملكية الفكرية، أو سياسات المنصة. تحتفظ المنصة بحق حذف أي محتوى مخالف وتقييد الحسابات المخالفة.",
        },
        {
          title: "٨. الالتزامات القانونية للتجار",
          body: "يلتزم التاجر بالامتثال للقوانين المحلية، عرض بيانات النشاط التجاري بوضوح، توفير سياسة استرجاع واستبدال، وإصدار فواتير للعملاء.",
        },
        {
          title: "٩. خدمات الطرف الثالث",
          body: "قد تتكامل المنصة مع خدمات خارجية (مثل الدفع أو الشحن)، ولا تتحمل المنصة أي مسؤولية عن أداء هذه الخدمات.",
        },
        {
          title: "١٠. الملكية الفكرية",
          body: "جميع حقوق المنصة (التصميم، البرمجيات، العلامة التجارية) محفوظة، ولا يجوز استخدامها دون إذن مسبق.",
        },
        {
          title: "١١. حدود المسؤولية",
          body: 'الخدمة مقدمة "كما هي". لا نضمن خلوها من الأخطاء أو الانقطاع. لا نتحمل أي خسائر مباشرة أو غير مباشرة ناتجة عن الاستخدام.',
        },
        {
          title: "١٢. إنهاء الحساب",
          body: "يحق للمنصة تعليق أو إنهاء الحساب في أي وقت عند المخالفة. ويحق للمستخدم إلغاء حسابه في أي وقت.",
        },
        {
          title: "١٣. الاسترجاع",
          body: "تخضع طلبات الاسترجاع لشروط محددة حسب نوع الاشتراك. قد يتم رفض الطلب في حال استخدام الخدمة. يتم معالجة الطلب خلال مدة محددة.",
        },
        {
          title: "١٤. التعديلات",
          body: "يحق للمنصة تعديل الشروط في أي وقت، ويعد استمرار الاستخدام موافقة على التحديثات.",
        },
        {
          title: "١٥. القوة القاهرة",
          body: "لا تتحمل المنصة المسؤولية عن أي تأخير أو فشل ناتج عن ظروف خارجة عن السيطرة.",
        },
        {
          title: "١٦. التواصل",
          body: "لأي استفسارات: support@shoplancer.com",
        },
      ]
    : [
        {
          title: "1. Definitions",
          body: '"Platform" refers to Shoplanser and all its digital services. "Service" refers to the tools and products that enable creating and managing e-commerce stores. "User" refers to any person using the platform, including merchants, customers, and visitors.',
        },
        {
          title: "2. Acceptance and Use",
          body: "By using the platform, you agree to comply with these terms and the privacy policy. If you do not agree, you must stop using the service. You must be over 18 or have the legal capacity to use the services.",
        },
        {
          title: "3. Accounts",
          body: "Accurate and up-to-date information must be provided. The user is responsible for protecting login credentials. The platform reserves the right to suspend or cancel any account in case of violation.",
        },
        {
          title: "4. Nature of the Service",
          body: "The platform provides tools for managing e-commerce stores and is not a party to the relationship between the merchant and the consumer. The merchant bears full responsibility for products, pricing, shipping, and customer service.",
        },
        {
          title: "5. Payments and Subscriptions",
          body: "Commission fees are charged for using the services. All payments are non-refundable except in specified cases. Prices and plans may be changed with prior notice to the user.",
        },
        {
          title: "6. Financial Transactions",
          body: "Payments are processed through third-party service providers. The user agrees to the payment providers' terms. The platform reserves the right to cancel any suspicious or unlawful transaction.",
        },
        {
          title: "7. Content",
          body: "The user is responsible for any content they publish. It must not violate laws, intellectual property rights, or platform policies. The platform reserves the right to remove any violating content and restrict violating accounts.",
        },
        {
          title: "8. Legal Obligations of Merchants",
          body: "The merchant must comply with local laws, clearly display business information, provide a return and exchange policy, and issue invoices to customers.",
        },
        {
          title: "9. Third-Party Services",
          body: "The platform may integrate with external services (such as payment or shipping), and the platform is not responsible for the performance of these services.",
        },
        {
          title: "10. Intellectual Property",
          body: "All platform rights (design, software, trademarks) are reserved and may not be used without prior permission.",
        },
        {
          title: "11. Limitation of Liability",
          body: 'The service is provided "as is." We do not guarantee it is free from errors or interruptions. We are not liable for any direct or indirect losses resulting from use.',
        },
        {
          title: "12. Account Termination",
          body: "The platform reserves the right to suspend or terminate an account at any time for violations. The user may also cancel their account at any time.",
        },
        {
          title: "13. Refunds",
          body: "Refund requests are subject to specific terms depending on the subscription type. The request may be refused if the service has been used. Requests are processed within a specified period.",
        },
        {
          title: "14. Changes",
          body: "The platform may modify these terms at any time, and continued use constitutes acceptance of the updates.",
        },
        {
          title: "15. Force Majeure",
          body: "The platform is not responsible for any delay or failure caused by circumstances beyond its control.",
        },
        {
          title: "16. Contact",
          body: "For any inquiries: support@shoplancer.com",
        },
      ];

  return (
    <div className="min-h-screen bg-background pt-16">
      <Header />
      <main className="container-page py-16" dir={isAr ? "rtl" : "ltr"}>
        <h1
          className={`text-3xl font-extrabold tracking-tight sm:text-4xl ${isAr ? "font-arabic" : ""}`}
        >
          {isAr ? "الشروط والأحكام" : "Terms & Conditions"}
        </h1>
        <p
          className={`mt-4 text-muted-foreground ${isAr ? "font-arabic" : ""}`}
        >
          {isAr
            ? "باستخدامك لمنصة شوب لانسر فإنك توافق على الشروط التالية. يرجى قراءتها بعناية."
            : "By using the SHOPLANCER platform you agree to the following terms. Please read carefully."}
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

export default Terms;
