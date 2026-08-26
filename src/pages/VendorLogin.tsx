import { useCallback, useState } from "react";
import {
  ArrowLeft,
  Check,
  Loader2,
  LogIn,
  Mail,
  Smartphone,
} from "lucide-react";

import { Logo } from "@/components/brand/Logo";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/i18n/LanguageContext";
import { fetchVendorProfile, loginVendor } from "@/lib/shoplanserApi";
import { Link, useNavigate } from "@/lib/router-compat";

const normalizePhoneLogin = (raw: string) => {
  if (/@/.test(raw)) return raw.trim();
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("0020")) digits = digits.slice(4);
  if (digits.startsWith("20")) digits = digits.slice(2);
  if (digits.startsWith("0")) digits = digits.slice(1);
  return digits;
};

const VendorLogin = () => {
  const { lang, dir } = useLanguage();
  const isAr = lang === "ar";
  const tx = useCallback((en: string, ar: string) => (isAr ? ar : en), [isAr]);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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
        navigate("/vendor/apply", {
          replace: true,
        });
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
      toast({
        title: tx("Could not sign in", "تعذر تسجيل الدخول"),
        description: message,
        variant: "destructive",
      });
    },
    [toast, tx],
  );

  const handleLogin = async () => {
    if (loading) return;
    const cleanIdentifier = normalizePhoneLogin(identifier);
    if (!cleanIdentifier || !password) {
      showLoginError(
        tx(
          "Enter your mobile number and password.",
          "أدخل رقم الموبايل وكلمة المرور.",
        ),
      );
      return;
    }

    setLoading(true);
    try {
      const result = await loginVendor(cleanIdentifier, password);
      if (!result.token) {
        throw new Error(
          tx(
            "The login response did not include an access token.",
            "استجابة الدخول لا تحتوي على رمز وصول.",
          ),
        );
      }
      await goToQrPage(result.token);
    } catch (error) {
      showLoginError(
        error instanceof Error
          ? error.message.replace(/^login failed \(\d+\):\s*/i, "")
          : tx("Unexpected error.", "حدث خطأ غير متوقع."),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      dir={dir}
      className="flex min-h-screen flex-col bg-gradient-to-b from-background via-muted/30 to-background"
    >
      <main className="flex flex-1 items-center py-10">
        <div className="container-page w-full">
          <div className="mx-auto max-w-xl">
            <div className="flex items-center justify-between gap-4">
              <Link to="/" aria-label="Shoplanser home">
                <Logo size={44} tone="dark" />
              </Link>
              <Link
                to="/vendor/apply"
                className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
              >
                <ArrowLeft
                  className={`h-4 w-4 ${dir === "rtl" ? "rotate-180" : ""}`}
                />
                {tx("Create store", "إنشاء متجر")}
              </Link>
            </div>

            <section className="mt-8 rounded-2xl border border-border bg-card p-5 shadow-card sm:p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <LogIn className="h-6 w-6" />
              </div>
              <h1 className="mt-4 text-2xl font-extrabold sm:text-3xl">
                {tx("Enter your store", "الدخول إلى متجرك")}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {tx(
                  "Sign in to return to the store QR page and sharing links.",
                  "سجّل الدخول للرجوع إلى صفحة QR وروابط مشاركة المتجر.",
                )}
              </p>

              <div className="mt-6 space-y-4">
                <div>
                  <Label className="text-sm font-bold">
                    {tx("Mobile number", "رقم الموبايل")}
                  </Label>
                  <div className="relative mt-2">
                    <Input
                      dir="ltr"
                      value={identifier}
                      onChange={(event) => setIdentifier(event.target.value)}
                      placeholder={tx("01000000000", "01000000000")}
                      className="ps-10"
                    />
                    <Mail className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-bold">
                    {tx("Password", "كلمة المرور")}
                  </Label>
                  <div className="relative mt-2">
                    <Input
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") handleLogin();
                      }}
                      className="ps-10"
                    />
                    <Smartphone className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>
              </div>

              <Button
                type="button"
                onClick={handleLogin}
                disabled={loading}
                className="mt-6 w-full gap-2"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                {tx("Open QR page", "فتح صفحة QR")}
              </Button>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default VendorLogin;
