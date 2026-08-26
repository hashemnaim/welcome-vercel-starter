import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send } from "lucide-react";

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  subject: z.string().trim().max(150).optional().or(z.literal("")),
  category: z.string().min(1).max(40),
  message: z.string().trim().min(10).max(3000),
});

export const SupportForm = ({
  source = "contact-page",
}: {
  source?: string;
}) => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const { toast } = useToast();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    category: "general",
    message: "",
  });
  // Honeypot — hidden from real users; bots that fill it get silently dropped.
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (k: keyof typeof form) => (v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const categories = [
    { value: "general", label: isAr ? "استفسار عام" : "General enquiry" },
    { value: "technical", label: isAr ? "دعم فني" : "Technical support" },
    {
      value: "billing",
      label: isAr ? "الاشتراكات والفواتير" : "Billing & subscriptions",
    },
    { value: "refund", label: isAr ? "طلب استرداد" : "Refund request" },
    { value: "partnership", label: isAr ? "شراكة / تعاون" : "Partnership" },
  ];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast({
        variant: "destructive",
        title: isAr ? "بيانات غير مكتملة" : "Incomplete details",
        description: isAr
          ? "يرجى إدخال الاسم وبريد إلكتروني صحيح ورسالة لا تقل عن 10 أحرف."
          : "Please enter your name, a valid email and a message of at least 10 characters.",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "support-request",
        {
          body: { ...parsed.data, source, company },
        },
      );

      if (error || (data as { error?: string })?.error)
        throw error ?? new Error("failed");

      setSent(true);
      setForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        category: "general",
        message: "",
      });
      toast({
        title: isAr ? "تم إرسال طلبك" : "Request sent",
        description: isAr
          ? "استلم فريق الدعم رسالتك وسيتم الرد خلال 24 ساعة عمل."
          : "Our support team received your message and will reply within 24 business hours.",
      });
    } catch {
      toast({
        variant: "destructive",
        title: isAr ? "تعذر الإرسال" : "Could not send",
        description: isAr
          ? "حدث خطأ أثناء إرسال الطلب، يرجى المحاولة مرة أخرى أو مراسلتنا على support@shoplancer.com"
          : "Something went wrong. Please try again or email support@shoplancer.com",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      dir={isAr ? "rtl" : "ltr"}
      className={`rounded-2xl border border-border bg-card p-6 shadow-sm ${isAr ? "font-arabic" : ""}`}
    >
      <h2 className="text-xl font-bold text-foreground">
        {isAr ? "نموذج طلب دعم" : "Support request form"}
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        {isAr
          ? "أرسل تفاصيل طلبك وسيصل تلقائيًا إلى فريق الدعم لدينا."
          : "Send your request details — it goes straight to our support team."}
      </p>

      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="sr-name">{isAr ? "الاسم" : "Name"} *</Label>
          <Input
            id="sr-name"
            value={form.name}
            maxLength={100}
            onChange={(e) => set("name")(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sr-email">
            {isAr ? "البريد الإلكتروني" : "Email"} *
          </Label>
          <Input
            id="sr-email"
            type="email"
            dir="ltr"
            value={form.email}
            maxLength={255}
            onChange={(e) => set("email")(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sr-phone">{isAr ? "رقم الهاتف" : "Phone"}</Label>
          <Input
            id="sr-phone"
            dir="ltr"
            value={form.phone}
            maxLength={40}
            onChange={(e) => set("phone")(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sr-category">
            {isAr ? "نوع الطلب" : "Request type"}
          </Label>
          <Select value={form.category} onValueChange={set("category")}>
            <SelectTrigger id="sr-category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="sr-subject">{isAr ? "الموضوع" : "Subject"}</Label>
          <Input
            id="sr-subject"
            value={form.subject}
            maxLength={150}
            onChange={(e) => set("subject")(e.target.value)}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="sr-message">{isAr ? "الرسالة" : "Message"} *</Label>
          <Textarea
            id="sr-message"
            rows={6}
            value={form.message}
            maxLength={3000}
            onChange={(e) => set("message")(e.target.value)}
            required
          />
          <p className="text-xs text-muted-foreground">
            {form.message.length}/3000
          </p>
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="mt-6 w-full sm:w-auto"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        <span className="mx-2">{isAr ? "إرسال الطلب" : "Send request"}</span>
      </Button>

      {sent && (
        <p className="mt-4 text-sm font-medium text-primary">
          {isAr ? "تم استلام طلبك بنجاح ✅" : "Your request was received ✅"}
        </p>
      )}
    </form>
  );
};
