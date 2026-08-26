import { useLanguage } from "@/i18n/LanguageContext";
import { useNavigate } from "@/lib/router-compat";
import { QrCode, ArrowLeft, ArrowRight } from "lucide-react";
import qrImage from "@/assets/qr-banner.webp";

export const QRBannerFigma = () => {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const isAr = lang === "ar";
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  return (
    <section className="bg-background py-6 md:py-10">
      <div className="container-page">
        <div
          className="relative overflow-hidden rounded-[2rem] p-6 sm:p-10 shadow-elevated"
          style={{ backgroundColor: "hsl(var(--brand-navy))" }}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(circle at 90% 10%, hsl(var(--brand-orange)/0.4), transparent 45%)",
            }}
          />
          <div className="relative grid items-center gap-8 md:grid-cols-[1fr_320px]">
            <div className={isAr ? "font-arabic" : ""}>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80 ring-1 ring-white/20">
                <QrCode className="h-3.5 w-3.5" />
                {isAr ? "QR جاهز" : "QR ready"}
              </span>
              <h3 className="mt-3 text-2xl font-extrabold text-white sm:text-3xl">
                {isAr
                  ? "احصل على QR محلي لمتجرك"
                  : "Get a local QR for your store"}
              </h3>
              <p className="mt-2 max-w-lg text-white/75">
                {isAr
                  ? "اطبع الكود، ألصقه على واجهة محلك، وابدأ باستقبال الطلبات من عملائك على الفور."
                  : "Print it, stick it on your shop window, and start receiving orders instantly."}
              </p>
              <button
                onClick={() => navigate("/vendor/apply")}
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-[hsl(var(--brand-orange))] px-6 py-3 text-sm font-bold text-white shadow-card transition-transform hover:scale-105"
              >
                {isAr ? "أنشئ QR الآن" : "Create QR now"}
                <Arrow className="h-4 w-4" />
              </button>
            </div>
            <img
              src={qrImage}
              alt=""
              loading="lazy"
              width={640}
              height={640}
              className="mx-auto w-full max-w-xs rounded-2xl object-cover shadow-card"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
