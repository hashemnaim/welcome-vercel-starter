import { createFileRoute } from "@tanstack/react-router";
import { BlogIndex } from "@/pages/Blog";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/blog/")({
  head: () =>
    pageHead({
      title: "المدونة — نصائح ومقالات للتجار | شوب لانسر",
      description:
        "مقالات ونصائح عملية للتجار المحليين: إطلاق المتجر الإلكتروني، جذب العملاء، العروض، والتسويق عبر شوب لانسر.",
      path: "/blog",
    }),
  component: BlogIndex,
});
