import { createFileRoute } from "@tanstack/react-router";
import VendorLogin from "@/pages/VendorLogin";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/vendor/login")({
  head: () =>
    pageHead({
      title: "تسجيل دخول البائع — شوب لانسر",
      description:
        "سجّل الدخول إلى حساب التاجر للرجوع إلى صفحة QR وروابط مشاركة متجرك على شوب لانسر.",
      path: "/vendor/login",
      robots: "noindex, nofollow",
    }),
  component: VendorLogin,
});
