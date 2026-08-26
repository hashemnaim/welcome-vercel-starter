import { useCallback, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  LogIn,
  Mail,
  ShieldCheck,
  Smartphone,
  Store,
} from "lucide-react";

import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/i18n/LanguageContext";
import { fetchVendorProfile } from "@/lib/shoplanserApi";
import {
  loginVendorAccount,
  normalizeEgyptPhone,
  type VendorLoginMode,
} from "@/lib/vendorLogin";
import { Link, useNavigate } from "@/lib/router-compat";

const phoneInputValue = (raw: string) => {
  let digits = raw.replace(/\D/g, "");

  if (digits.startsWith("0020")) digits = digits.slice(4);
  else if (digits.startsWith("20") && digits.length > 10) digits = digits.slice(2);

  if (digits.startsWith("0")) digits = digits.slice(1);

  return digits.slice(0, 10);
};

const VendorLogin = () => {
  const { lang, setLang, dir } = useLanguage();
  const isAr = lang === "ar";
  const tx = useCallback((en: string, ar: string) => (isAr ? ar : en), [isAr]);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [mode, setMode] = useState<VendorLoginMode>("phone");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inlineError, setInlineError] = useState("");

  const goToQrPage = useCallback(
    async (token: string, message?: string) => {
      localStorage.setItem("shoplanser_vendor_token", token);
      const profile = await fetchVendorProfile(token);
      const firstStore = profile.stores?.[0];

      if (!firstStore?.slug) {
        toast({
          title: tx("No stores found", "لا توجد متاجر"),
          description: tx(
            "Create your first store to generate its QR page.",
            "أنشئ متجرك الأول حتى تظهر صفحة الـ QR الخاصة به.",
          ),
        });
        navigate("/vendor/apply", { replace: true });
        return;
      }

      navigate("/vendor/success", {
        replace: true,
        state: {
          slug: firstStore.slug,
          storeName: firstStore.name,
          ownerEmail: profile.email,
          apiResult: {
            store_id: firstStore.id,
            message:
              message ?? tx("Signed in to your store.", "تم الدخول إلى متجرك."),
          },
        },
      });
    },
    [navigate, toast, tx],
  );

  const showLoginError = useCallback(
    (message: string) => {
      setInlineError(message);
      toast({
        title: tx("Could not sign in", "تعذر تسجيل الدخول"),
        description: message,
        variant: "destructive",
      });
    },
    [toast, tx],
  );

  const changeMode = (nextMode: VendorLoginMode) => {
    setMode(nextMode);
    setIdentifier("");
    setInlineError("");
  };

  const handleLogin = async () => {
    if (loading) return;

    const cleanIdentifier = identifier.trim();
    if (!cleanIdentifier || !password) {
      showLoginError(
        tx(
          "Enter your login details and password.",
          "أدخل بيانات الدخول وكلمة المرور.",
        ),
      );
      return;
    }

    if (mode === "phone" && !normalizeEgyptPhone(cleanIdentifier)) {
      showLoginError(
        tx(
          "Enter a valid Egyptian mobile number.",
          "أدخل رقم موبايل مصري صحيح مكوّن من 10 أرقام بعد +20.",
        ),
      );
      return;
    }

    setLoading(true);
    setInlineError("");

    try {
      const result = await loginVendorAccount({
        identifier: cleanIdentifier,
        password,
        mode,
      });

      if (!result.token) {
        throw new Error(
          tx(
            "The login response did not include an access token.",
            "استجابة الدخول لا تحتوي على رمز وصول.",
          ),
        );
      }

      await goToQrPage(result.token, result.message);
    } catch (error) {
      const rawMessage = error instanceof Error ? error.message : "";
      const message =
        rawMessage === "INVALID_EGYPT_PHONE"
          ? tx(
              "Enter a valid Egyptian mobile number.",
              "أدخل رقم موبايل مصري صحيح.",
            )
          : rawMessage === "INVALID_EMAIL"
            ? tx("Enter a valid email address.", "أدخل بريدًا إلكترونيًا صحيحًا.")
            : rawMessage || tx("Unexpected error.", "حدث خطأ غير متوقع.");

      showLoginError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir={dir} className="min-h-screen bg-muted/20">
      <header className="border-b border-border/80 bg-background">
        <div className="container-page flex h-16 items-center justify-between gap-3">
          <Link to="/" aria-label="Shoplanser home">
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
              <Link to="/vendor/apply">
                <Store className="h-4 w-4" />
                {tx("Create a new store", "إنشاء متجر جديد")}
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

      <main className="container-page py-8 sm:py-12">
        <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl border border-border bg-card shadow-card lg:grid-cols-[0.82fr_1.18fr]">
          <aside className="hidden bg-primary p-8 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h2 className="mt-6 text-2xl font-black">
                {tx("Welcome back", "أهلًا بعودتك")}
              </h2>
              <p className="mt-3 text-sm leading-7 text-primary-foreground/80">
                {tx(
                  "Sign in to manage your store, return to its QR page, and access your sharing links.",
                  "سجّل الدخول لإدارة متجرك والرجوع إلى صفحة الـ QR وروابط مشاركة المتجر.",
                )}
              </p>

              <div className="mt-8 space-y-4 text-sm font-semibold">
                {[
                  tx(lang, "Your store remains linked to your account", "متجرك مرتبط بحسابك"),
                  tx(lang, "Use phone or email to sign in", "يمكنك الدخول بالموبايل أو البريد"),
                  tx(lang, "Egypt phone prefix is handled automatically", "مقدمة مصر يتم التعامل معها تلقائيًا"),
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-10 text-xs leading-6 text-primary-foreground/70">
              {tx(
                "Do not share your password with anyone. Shoplanser support will never ask you for it.",
                "لا تشارك كلمة المرور مع أي شخص. دعم شوب لانسر لن يطلب منك كلمة المرور.",
              )}
            </p>
          </aside>

          <section className="p-5 sm:p-8 lg:p-10">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft
                className={`h-4 w-4 ${dir === "rtl" ? "rotate-180" : ""}`}
              />
              {tx("Back to home", "العودة للرئيسية")}
            </Link>

            <div className="mt-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary lg:hidden">
                <LogIn className="h-6 w-6" />
              </div>
              <h1 className="mt-4 text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                {tx("Sign in to your store", "تسجيل الدخول إلى متجرك")}
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-7 text-muted-foreground">
                {tx(
                  "Choose how you want to sign in. For Egyptian mobile numbers, +20 is added automatically.",
                  "اختر طريقة الدخول. لأرقام الموبايل المصرية، مقدمة +20 تتم إضافتها تلقائيًا.",
                )}
              </p>
            </div>

            <div className="mt-7 grid grid-cols-2 rounded-xl bg-muted p-1">
              <button
                type="button"
                onClick={() => changeMode("phone")}
                aria-pressed={mode === "phone"}
                className={`flex h-10 items-center justify-center gap-2 rounded-lg text-sm font-extrabold transition ${
                  mode === "phone"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Smartphone className="h-4 w-4" />
                {tx("Mobile", "الموبايل")}
              </button>
              <button
                type="button"
                onClick={() => changeMode("email")}
                aria-pressed={mode === "email"}
                className={`flex h-10 items-center justify-center gap-2 rounded-lg text-sm font-extrabold transition ${
                  mode === "email"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Mail className="h-4 w-4" />
                {tx("Email", "البريد")}
              </button>
            </div>

            {inlineError && (
              <div
                role="alert"
                className="mt-5 rounded-xl border border-destructive/25 bg-destructive/5 px-4 py-3 text-sm font-semibold leading-6 text-destructive"
              >
                {inlineError}
              </div>
            )}

            <div className="mt-6 space-y-5">
              {mode === "phone" ? (
                <div>
                  <Label className="text-sm font-bold text-foreground">
                    {tx("Mobile number", "رقم الموبايل")}
                  </Label>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    {tx(
                      "Enter the 10 digits after +20. Pasting 010… or +20… is corrected automatically.",
                      "اكتب 10 أرقام بعد +20. ولو لصقت الرقم بصيغة 010… أو +20… سنصححه تلقائيًا.",
                    )}
                  </p>
                  <div
                    dir="ltr"
                    className="mt-2 flex h-12 overflow-hidden rounded-md border border-input bg-background focus-within:ring-2 focus-within:ring-ring"
                  >
                    <span className="flex items-center border-r border-border bg-muted px-3 font-bold text-foreground">
                      +20
                    </span>
                    <Input
                      dir="ltr"
                      inputMode="tel"
                      autoComplete="tel"
                      value={identifier}
                      onChange={(event) => {
                        setIdentifier(phoneInputValue(event.target.value));
                        setInlineError("");
                      }}
                      placeholder="1080140222"
                      className="h-full border-0 text-base tracking-wide focus-visible:ring-0"
                      autoFocus
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <Label className="text-sm font-bold text-foreground">
                    {tx("Email address", "البريد الإلكتروني")}
                  </Label>
                  <div className="relative mt-2">
                    <Input
                      type="email"
                      dir="ltr"
                      autoComplete="email"
                      value={identifier}
                      onChange={(event) => {
                        setIdentifier(event.target.value);
                        setInlineError("");
                      }}
                      placeholder="name@example.com"
                      className="h-12 pe-11"
                      autoFocus
                    />
                    <Mail className="absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between gap-3">
                  <Label className="text-sm font-bold text-foreground">
                    {tx("Password", "كلمة المرور")}
                  </Label>
                </div>
                <div className="relative mt-2">
                  <LockKeyhole className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      setInlineError("");
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") handleLogin();
                    }}
                    className="h-12 px-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={tx(
                      showPassword ? "Hide password" : "Show password",
                      showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور",
                    )}
                    className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <Button
              type="button"
              onClick={handleLogin}
              disabled={loading}
              className="mt-7 h-12 w-full gap-2 text-base font-extrabold"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogIn className="h-4 w-4" />
              )}
              {loading
                ? tx("Signing in…", "جارٍ تسجيل الدخول…")
                : tx("Sign in", "تسجيل الدخول")}
            </Button>

            <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-border pt-5 text-sm sm:flex-row">
              <span className="text-muted-foreground">
                {tx("Don't have a store yet?", "ليس لديك متجر حتى الآن؟")}
              </span>
              <Link
                to="/vendor/apply"
                className="inline-flex items-center gap-2 font-extrabold text-primary hover:underline"
              >
                <Store className="h-4 w-4" />
                {tx("Create your store", "أنشئ متجرك")}
              </Link>
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t border-border bg-background py-5">
        <div className="container-page flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
          <Link to="/legal/privacy" className="hover:text-foreground">
            {tx("Privacy", "الخصوصية")}
          </Link>
          <Link to="/legal/terms" className="hover:text-foreground">
            {tx("Terms", "الشروط")}
          </Link>
          <a
            href="https://wa.me/201036850264"
            target="_blank"
            rel="noreferrer"
            className="font-bold text-primary hover:underline"
          >
            {tx("Need help? WhatsApp support", "تحتاج مساعدة؟ دعم واتساب")}
          </a>
        </div>
      </footer>
    </div>
  );
};

export default VendorLogin;
