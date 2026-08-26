import { createFileRoute } from "@tanstack/react-router";
import Refund from "@/pages/Refund";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/legal/refund")({
  head: () =>
    pageHead({
      title: "سياسة الاسترداد — شوب لانسر",
      description:
        "سياسة الاسترداد الخاصة بمنصة شوب لانسر: الشروط، المدة الزمنية، وطريقة التواصل.",
      path: "/legal/refund",
    }),
  component: Refund,
});
