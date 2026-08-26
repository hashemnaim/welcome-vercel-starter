// Edge function that returns HTML with per-store OG tags for social crawlers
// (WhatsApp, Facebook, Twitter, LinkedIn, Slack, Telegram, Discord) and
// 302-redirects real browsers to the SPA store page.
//
// Share links like:
//   https://<project-ref>.supabase.co/functions/v1/store-og?slug=<slug>
//
// Bots see server-rendered OG tags. Users get bounced to /store/<slug>.

import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";

const SITE = "https://shoplanser.com";
const DEFAULT_OG = `${SITE}/og-image.png`;
const EXTERNAL_API =
  Deno.env.get("SHOPLANSER_API_URL") ??
  "https://dashboard.shoplanser.com/api/v1";

const BOT_UA =
  /facebookexternalhit|Facebot|Twitterbot|WhatsApp|LinkedInBot|Slackbot|TelegramBot|Discordbot|SkypeUriPreview|Pinterest|redditbot|Applebot|Googlebot|bingbot|DuckDuckBot|YandexBot|Baiduspider|vkShare|W3C_Validator/i;

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

interface StoreInfo {
  name: string;
  description: string;
  image: string;
  slug: string;
}

const escapeHtml = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );

const absolute = (url: string | null | undefined): string | null => {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith("//")) return `https:${url}`;
  return null;
};

async function fetchExternalStore(
  slug: string,
): Promise<Partial<StoreInfo> | null> {
  try {
    const res = await fetch(
      `${EXTERNAL_API}/stores/details/${encodeURIComponent(slug)}`,
      {
        headers: {
          Accept: "application/json",
          "X-localization": "ar",
          zoneId: "[1]",
          moduleId: "1",
        },
      },
    );
    if (!res.ok) return null;
    const data = await res.json();
    const s = data?.data ?? data;
    if (!s || typeof s !== "object") return null;

    const logo =
      absolute(s.logo_full_url) ??
      absolute(s.cover_photo_full_url) ??
      absolute(s.logo) ??
      absolute(s.cover_photo) ??
      absolute(s.items?.[0]?.image_full_url) ??
      absolute(s.items?.[0]?.image);

    return {
      name: s.name ?? s.store_name,
      description:
        s.description ??
        s.address ??
        (s.name
          ? `${s.name} — اطلب الآن من متجرك المفضل على شوب لانسر.`
          : undefined),
      image: logo ?? undefined,
    };
  } catch (e) {
    console.error("external store fetch failed:", e);
    return null;
  }
}

async function fetchVendorStore(
  slug: string,
): Promise<Partial<StoreInfo> | null> {
  const { data, error } = await supabase
    .from("vendor_stores")
    .select("store_name, slug, api_result")
    .eq("slug", slug)
    .maybeSingle();
  if (error || !data) return null;
  const api = (data.api_result ?? {}) as Record<string, unknown>;
  return {
    name: data.store_name,
    description:
      (api.description as string) ?? `${data.store_name} على شوب لانسر`,
    image:
      absolute(
        (api.logo_full_url as string) ?? (api.cover_photo_full_url as string),
      ) ?? undefined,
  };
}

async function resolveStore(slug: string): Promise<StoreInfo> {
  const ext = await fetchExternalStore(slug);
  const local = ext?.image && ext?.name ? null : await fetchVendorStore(slug);
  const merged = { ...(local ?? {}), ...(ext ?? {}) };
  return {
    slug,
    name: merged.name || "SHOPLANCER",
    description:
      merged.description || "اكتشف المتاجر المحلية واطلب أونلاين مع شوب لانسر.",
    image: merged.image || DEFAULT_OG,
  };
}

function renderHtml(store: StoreInfo, redirectUrl: string): string {
  const title = `${store.name} — SHOPLANCER`;
  const t = escapeHtml(title);
  const d = escapeHtml(store.description);
  const img = escapeHtml(store.image);
  const url = escapeHtml(redirectUrl);
  return `<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${t}</title>
<meta name="description" content="${d}" />
<link rel="canonical" href="${url}" />
<link rel="icon" href="${img}" />
<link rel="apple-touch-icon" href="${img}" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="SHOPLANCER" />
<meta property="og:title" content="${t}" />
<meta property="og:description" content="${d}" />
<meta property="og:url" content="${url}" />
<meta property="og:image" content="${img}" />
<meta property="og:image:secure_url" content="${img}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="${escapeHtml(store.name)}" />
<meta property="og:locale" content="ar_AR" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${t}" />
<meta name="twitter:description" content="${d}" />
<meta name="twitter:image" content="${img}" />
<meta http-equiv="refresh" content="0; url=${url}" />
<script>window.location.replace(${JSON.stringify(redirectUrl)});</script>
</head>
<body>
<h1>${t}</h1>
<p>${d}</p>
<p><a href="${url}">افتح المتجر</a></p>
<img src="${img}" alt="${escapeHtml(store.name)}" width="600" />
</body>
</html>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  try {
    const url = new URL(req.url);
    const slug =
      url.searchParams.get("slug") ??
      url.pathname.split("/").filter(Boolean).pop() ??
      "";
    if (!slug || !/^[a-z0-9-]{1,80}$/i.test(slug)) {
      return new Response("Invalid slug", {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "text/plain" },
      });
    }
    const spaUrl = `${SITE}/store/${encodeURIComponent(slug)}`;
    const ua = req.headers.get("user-agent") ?? "";
    const isBot = BOT_UA.test(ua);

    if (!isBot) {
      return new Response(null, {
        status: 302,
        headers: { ...corsHeaders, Location: spaUrl },
      });
    }

    const store = await resolveStore(slug);
    return new Response(renderHtml(store, spaUrl), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=300, s-maxage=600",
      },
    });
  } catch (err) {
    console.error("store-og error:", err);
    return new Response("Internal Error", {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "text/plain" },
    });
  }
});
