import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useLanguage } from "@/i18n/LanguageContext";

const Privacy = () => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";

  const sections = isAr
    ? [
        {
          title: "١. نطاق التطبيق",
          body: "تنطبق هذه السياسة على جميع المستخدمين، بما في ذلك: التجار (أصحاب المتاجر)، العملاء (مستخدمي الخدمات)، المستهلكين (المشترين من المتاجر)، الشركاء (مزودي الخدمات والتطبيقات)، وزوار الموقع.",
        },
        {
          title: "٢. البيانات التي نقوم بجمعها",
          body: "أ) البيانات الشخصية: الاسم، البريد الإلكتروني، رقم الهاتف. ب) بيانات الاستخدام: عنوان IP، نوع الجهاز والمتصفح، سلوك التصفح داخل المنصة. ج) البيانات المالية: بيانات الدفع عند تنفيذ عمليات الشراء عبر مزودي دفع معتمدين.",
        },
        {
          title: "٣. كيفية استخدام البيانات",
          body: "نستخدم البيانات لتشغيل وتحسين خدمات المنصة، إنشاء وإدارة الحسابات، معالجة الطلبات والمدفوعات، دعم العملاء والتواصل، التحليلات والتطوير، والحماية من الاحتيال.",
        },
        {
          title: "٤. معالجة بيانات العملاء نيابة عن التجار",
          body: "قد تقوم شوب لانسر بمعالجة بيانات عملاء المتاجر نيابةً عن التجار بهدف تشغيل المتاجر الإلكترونية، وفي هذه الحالة يعمل التاجر كمتحكم بالبيانات.",
        },
        {
          title: "٥. مشاركة البيانات",
          body: "قد نشارك البيانات مع مزودي الخدمات (الدفع، الاستضافة، الحماية)، الشركاء المرتبطين بتشغيل الخدمات، والجهات القانونية عند الطلب. ولا يتم بيع البيانات لأي طرف ثالث.",
        },
        {
          title: "٦. حماية البيانات",
          body: "نطبق إجراءات أمنية تقنية وتنظيمية لحماية البيانات، ومع ذلك لا يمكن ضمان الأمان الكامل بنسبة 100%.",
        },
        {
          title: "٧. الاحتفاظ بالبيانات",
          body: "نحتفظ بالبيانات فقط للمدة اللازمة لتقديم الخدمات أو للامتثال للمتطلبات القانونية.",
        },
        {
          title: "٨. حقوق المستخدم",
          body: "يحق لك: الوصول إلى بياناتك، تعديلها أو تحديثها، طلب حذفها، وسحب الموافقة على استخدامها.",
        },
        {
          title: "٩. التعديلات",
          body: "قد يتم تحديث هذه السياسة من وقت لآخر، وسيتم نشر النسخة المحدثة عبر المنصة.",
        },
        {
          title: "١٠. التواصل",
          body: "لأي استفسارات تتعلق بالخصوصية، يمكن التواصل عبر البريد الإلكتروني: support@shoplancer.com",
        },
      ]
    : [
        {
          title: "1. Scope",
          body: "This policy applies to all users, including: merchants (store owners), customers (service users), consumers (store buyers), partners (service and app providers), and website visitors.",
        },
        {
          title: "2. Data We Collect",
          body: "A) Personal data: name, email, phone number. B) Usage data: IP address, device and browser type, browsing behavior on the platform. C) Financial data: payment information when completing purchases through certified payment providers.",
        },
        {
          title: "3. How We Use Data",
          body: "We use the data to operate and improve platform services, create and manage accounts, process orders and payments, support customers and communicate, analyze and develop, and protect against fraud.",
        },
        {
          title: "4. Processing Customer Data on Behalf of Merchants",
          body: "Shoplanser may process store customers' data on behalf of merchants to operate e-commerce stores. In this case, the merchant acts as the data controller.",
        },
        {
          title: "5. Data Sharing",
          body: "We may share data with service providers (payment, hosting, security), partners involved in operating the services, and legal authorities when requested. We do not sell data to any third party.",
        },
        {
          title: "6. Data Security",
          body: "We apply technical and organizational security measures to protect data. However, 100% security cannot be guaranteed.",
        },
        {
          title: "7. Data Retention",
          body: "We retain data only for as long as necessary to provide the services or comply with legal requirements.",
        },
        {
          title: "8. User Rights",
          body: "You have the right to: access your data, modify or update it, request deletion, and withdraw consent for its use.",
        },
        {
          title: "9. Changes",
          body: "This policy may be updated from time to time, and the updated version will be published on the platform.",
        },
        {
          title: "10. Contact",
          body: "For any privacy inquiries, please contact us at support@shoplancer.com",
        },
      ];

  return (
    <div className="min-h-screen bg-background pt-16">
      <Header />
      <main className="container-page py-16" dir={isAr ? "rtl" : "ltr"}>
        <h1
          className={`text-3xl font-extrabold tracking-tight sm:text-4xl ${isAr ? "font-arabic" : ""}`}
        >
          {isAr ? "سياسة الخصوصية" : "Privacy Policy"}
        </h1>
        <p
          className={`mt-4 text-muted-foreground ${isAr ? "font-arabic" : ""}`}
        >
          {isAr
            ? "توضح هذه السياسة كيفية قيام شوب لانسر بجمع واستخدام ومعالجة وحماية البيانات الشخصية عند استخدام المنصة أو أي من خدماتها."
            : "This policy explains how SHOPLANCER collects, uses, processes, and protects personal data when using the platform or any of its services."}
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

export default Privacy;
