import { createFileRoute } from "@tanstack/react-router";
import Privacy from "@/pages/Privacy";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/legal/privacy")({
  head: () =>
    pageHead({
      title: "سياسة الخصوصية — شوب لانسر",
      description:
        "كيف تجمع منصة شوب لانسر البيانات الشخصية وتستخدمها وتحميها، وحقوقك تجاهها.",
      path: "/legal/privacy",
    }),
  component: Privacy,
});
