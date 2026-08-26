import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useLanguage } from "@/i18n/LanguageContext";
import { SupportForm } from "@/components/support/SupportForm";
import { Mail, MessageCircle, Phone, Clock } from "lucide-react";

const PHONE = "+201036850264";
const WHATSAPP = "https://wa.me/201036850264";
const EMAIL = "support@shoplancer.com";

const Contact = () => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";

  const items = [
    {
      icon: Phone,
      label: isAr ? "الهاتف" : "Phone",
      value: PHONE,
      href: `tel:${PHONE}`,
    },
    {
      icon: MessageCircle,
      label: isAr ? "واتساب" : "WhatsApp",
      value: PHONE,
      href: WHATSAPP,
      external: true,
    },
    {
      icon: Mail,
      label: isAr ? "البريد الإلكتروني" : "Email",
      value: EMAIL,
      href: `mailto:${EMAIL}`,
    },
    {
      icon: Clock,
      label: isAr ? "ساعات العمل" : "Working hours",
      value: isAr ? "السبت - الخميس، 9 ص - 6 م" : "Sat - Thu, 9am - 6pm",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main
        className={`container-page py-14 ${isAr ? "font-arabic" : ""}`}
        dir={isAr ? "rtl" : "ltr"}
      >
        <header className="max-w-2xl">
          <h1 className="text-3xl font-extrabold text-foreground md:text-4xl">
            {isAr ? "تواصل معنا" : "Contact us"}
          </h1>
          <p className="mt-3 text-muted-foreground">
            {isAr
              ? "فريق شوب لانسر جاهز لمساعدتك في أي استفسار عن المتاجر، الاشتراكات أو الدعم الفني."
              : "The Shoplanser team is ready to help with stores, subscriptions or technical support."}
          </p>
        </header>

        <div className="mt-10 grid gap-8 lg:grid-cols-[360px_1fr]">
          <aside className="space-y-4">
            {items.map((it) => {
              const Icon = it.icon;
              const content = (
                <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-5 transition hover:border-primary/40">
                  <span className="rounded-xl bg-primary/10 p-2.5 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {it.label}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground" dir="ltr">
                      {it.value}
                    </p>
                  </div>
                </div>
              );
              return it.href ? (
                <a
                  key={it.label}
                  href={it.href}
                  target={it.external ? "_blank" : undefined}
                  rel={it.external ? "noreferrer" : undefined}
                  className="block"
                >
                  {content}
                </a>
              ) : (
                <div key={it.label}>{content}</div>
              );
            })}

            <a
              href={WHATSAPP}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-5 py-3.5 text-sm font-bold text-white transition hover:opacity-90"
            >
              <MessageCircle className="h-4 w-4" />
              {isAr ? "محادثة واتساب مباشرة" : "Chat on WhatsApp"}
            </a>
          </aside>

          <SupportForm source="contact-page" />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
