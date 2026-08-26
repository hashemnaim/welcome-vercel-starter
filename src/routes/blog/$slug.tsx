import { createFileRoute } from "@tanstack/react-router";
import { BlogPost } from "@/pages/Blog";
import { pageHead, SITE_NAME, SITE_URL } from "@/lib/seo";

const POSTS: Record<
  string,
  { title: string; excerpt: string; image: string; datePublished: string }
> = {
  "launch-your-store": {
    title: "كيف تطلق متجرك الإلكتروني في عصر يوم واحد",
    excerpt:
      "خطة عملية خطوة بخطوة من التسجيل للهوية للمنتجات لأول طلب — كلها بأقل من 4 ساعات.",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&auto=format&fit=crop&q=70",
    datePublished: "2026-08-01",
  },
  "merchant-tips": {
    title: "7 عادات صغيرة تحوّل أول زبون إلى عميل دائم",
    excerpt:
      "الاحتفاظ بالعملاء أرخص من اكتسابهم. هاي 7 عادات بسيطة بتضاعف الطلبات المتكررة.",
    image:
      "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=1200&auto=format&fit=crop&q=70",
    datePublished: "2026-08-08",
  },
  "promo-ideas": {
    title: "10 أفكار عروض بتحقق مبيعات فعلية (مش مجرد زيارات)",
    excerpt:
      "10 صيغ عروض مجرّبة بيستخدمها التجار المحليون لرفع الإيراد الأسبوعي.",
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&auto=format&fit=crop&q=70",
    datePublished: "2026-08-15",
  },
  "qr-code-power": {
    title: "رمز QR على باب محلك هو أكثر قناة مبيعات مهمَلة عندك",
    excerpt:
      "كيف ملصق بسيط على واجهة محلك بيحوّل المارة لطلبات أونلاين على مدار الساعة.",
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&auto=format&fit=crop&q=70",
    datePublished: "2026-08-22",
  },
};

export const Route = createFileRoute("/blog/$slug")({
  head: ({ params }) => {
    const post = POSTS[params.slug];
    if (!post) {
      return pageHead({
        title: "المقال غير موجود — شوب لانسر",
        description: "لم نتمكن من العثور على هذا المقال في مدونة شوب لانسر.",
        path: `/blog/${params.slug}`,
      });
    }
    return pageHead({
      title: `${post.title} — شوب لانسر`,
      description: post.excerpt,
      path: `/blog/${params.slug}`,
      type: "article",
      image: post.image,
      imageAlt: post.title,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: post.title,
        description: post.excerpt,
        image: post.image,
        datePublished: post.datePublished,
        dateModified: post.datePublished,
        mainEntityOfPage: `${SITE_URL}/blog/${params.slug}`,
        author: {
          "@type": "Organization",
          name: SITE_NAME,
          url: SITE_URL,
        },
        publisher: {
          "@type": "Organization",
          "@id": `${SITE_URL}/#organization`,
          name: SITE_NAME,
        },
        inLanguage: "ar",
      },
    });
  },
  component: BlogPost,
});
