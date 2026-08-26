import { createFileRoute } from "@tanstack/react-router";
import Terms from "@/pages/Terms";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/legal/terms")({
  head: () =>
    pageHead({
      title: "الشروط والأحكام — شوب لانسر",
      description:
        "شروط استخدام منصة شوب لانسر للبائعين والعملاء: الحسابات، الباقات، المدفوعات والمسؤوليات.",
      path: "/legal/terms",
    }),
  component: Terms,
});
