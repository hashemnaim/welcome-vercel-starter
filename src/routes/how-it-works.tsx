import { createFileRoute } from "@tanstack/react-router";

import { pageHead, SITE_URL } from "@/lib/seo";
import HowItWorks from "@/pages/HowItWorks";

export const Route = createFileRoute("/how-it-works")({
  head: () =>
    pageHead({
      title: "كيف تعمل شوب لانسر؟ — خطوات إنشاء وتسجيل متجرك",
      description:
        "تعرّف على طريقة عمل منصة شوب لانسر وخطوات تسجيل متجرك من بيانات المتجر والموقع والتوصيل وحتى اختيار الباقة وإنشاء حساب صاحب المتجر.",
      path: "/how-it-works",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: "كيف تسجل متجرك على شوب لانسر",
        description: "شرح طريقة عمل شوب لانسر وخطوات تسجيل متجر جديد.",
        url: `${SITE_URL}/how-it-works`,
        inLanguage: "ar",
        step: [
          "بيانات المتجر",
          "موقع المتجر",
          "التوصيل ومواعيد العمل",
          "اختيار الأصناف",
          "اختيار الباقة",
          "إنشاء حساب صاحب المتجر",
        ].map((name, index) => ({
          "@type": "HowToStep",
          position: index + 1,
          name,
        })),
      },
    }),
  component: HowItWorks,
});
