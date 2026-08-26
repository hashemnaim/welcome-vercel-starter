import { createFileRoute } from "@tanstack/react-router";
import VendorSuccess from "@/pages/VendorSuccess";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/vendor/success")({
  head: () =>
    pageHead({
      title: "متجرك جاهز — شوب لانسر",
      description:
        "صفحة خاصة تعرض رابط المتجر ورمز QR بعد إكمال إنشاء متجر شوب لانسر.",
      path: "/vendor/success",
      robots: "noindex, nofollow",
    }),
  component: VendorSuccess,
});
