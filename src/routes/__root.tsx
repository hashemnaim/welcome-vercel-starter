import { useEffect } from "react";
import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
  useRouter,
} from "@tanstack/react-router";

import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/i18n/LanguageContext";
import ScrollToTop from "@/components/ScrollToTop";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import NotFound from "@/pages/NotFound";
import { reportLovableError } from "@/lib/lovable-error-reporting";
import {
  DEFAULT_IMAGE,
  GOOGLE_ANALYTICS_ID,
  GOOGLE_SITE_VERIFICATION,
  GOOGLE_TAG_MANAGER_ID,
  SITE_NAME,
} from "@/lib/seo";

import appCss from "../styles.css?url";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    head: () => ({
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1.0" },
        { name: "theme-color", content: "#2C5282" },
        {
          name: "keywords",
          content:
            "shoplanser, shoplancer, شوب لانسر, online store, ecommerce, marketplace, vendor storefront, متجر إلكتروني, تجارة إلكترونية",
        },
        { name: "author", content: SITE_NAME },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "1200" },
        ...(GOOGLE_SITE_VERIFICATION
          ? [
              {
                name: "google-site-verification",
                content: GOOGLE_SITE_VERIFICATION,
              },
            ]
          : []),
      ],
      links: [
        { rel: "stylesheet", href: appCss },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossOrigin: "anonymous",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Cairo:wght@400;500;600;700;800&family=Rubik:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap",
        },
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        {
          rel: "icon",
          type: "image/png",
          sizes: "16x16",
          href: "/favicon-16.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "32x32",
          href: "/favicon-32.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "48x48",
          href: "/favicon-48.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "192x192",
          href: "/favicon-192.png",
        },
        { rel: "apple-touch-icon", sizes: "180x180", href: "/favicon-180.png" },
        { rel: "image_src", href: DEFAULT_IMAGE },
      ],
      scripts: [
        ...(GOOGLE_ANALYTICS_ID
          ? [
              {
                async: true,
                src: `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`,
              },
              {
                children: [
                  "window.dataLayer = window.dataLayer || [];",
                  "function gtag(){dataLayer.push(arguments);}",
                  "gtag('js', new Date());",
                  `gtag('config', '${GOOGLE_ANALYTICS_ID}');`,
                ].join("\n"),
              },
            ]
          : []),
        ...(GOOGLE_TAG_MANAGER_ID
          ? [
              {
                children: [
                  "(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':",
                  "new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],",
                  "j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=",
                  "'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);",
                  `})(window,document,'script','dataLayer','${GOOGLE_TAG_MANAGER_ID}');`,
                ].join("\n"),
              },
            ]
          : []),
      ],
    }),
    ...(import.meta.env.VITE_STATIC_SPA ? {} : { shellComponent: RootShell }),
    component: RootComponent,
    notFoundComponent: NotFound,
    errorComponent: RootErrorComponent,
  },
);

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {GOOGLE_TAG_MANAGER_ID ? (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GOOGLE_TAG_MANAGER_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
              title="Google Tag Manager"
            />
          </noscript>
        ) : null}
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <ScrollToTop />
          <Outlet />
          <WhatsAppFloat />
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

function RootErrorComponent({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error(error);
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center text-foreground">
      <h1 className="text-2xl font-bold">This page didn&apos;t load</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        Something went wrong while rendering this page.
      </p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          Try again
        </button>
        <a
          href="/"
          className="rounded-md border border-border px-4 py-2 text-sm font-semibold text-foreground"
        >
          Go home
        </a>
      </div>
    </div>
  );
}
