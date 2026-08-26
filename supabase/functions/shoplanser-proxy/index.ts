// Edge Function proxy to mallapp.online to bypass browser CORS.
// Endpoints (mallapp vendor API):
//   GET  /api/v1/zone/list                 -> zones
//   GET  /api/v1/module?zone_id=...        -> modules (optionally filtered by zone)
//   GET  /api/v1/vendor/package-view       -> subscription packages
//   GET  /api/v1/config/geocode-api        -> reverse geocode
//   POST /api/v1/auth/vendor/register      -> vendor registration (multipart)
//
// The `categories` route still proxies the shopZone marketplace API
// (market.shoplanser.com) because mallapp does not expose a public catalog
// categories endpoint for the storefront wizard.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-localization, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const UPSTREAM =
  Deno.env.get("SHOPLANSER_API_URL") ??
  "https://dashboard.shoplanser.com/api/v1";
const MARKET_UPSTREAM =
  Deno.env.get("SHOPLANSER_MARKET_API_URL") ??
  "https://market.shoplanser.com/api/v1";

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const buildHeaders = (req: Request): Record<string, string> => ({
  Accept: "application/json",
  "X-software-id": "33571750",
  "X-server": "lovable-edge",
  "X-localization": req.headers.get("X-localization") ?? "en",
  zoneId: req.headers.get("zoneId") ?? "[1]",
  moduleId: req.headers.get("moduleId") ?? "1",
});

const passThrough = async (upstreamRes: Response, upstreamUrl: string) => {
  const body = await upstreamRes.text();
  const contentType = upstreamRes.headers.get("Content-Type") ?? "";
  if (!upstreamRes.ok && contentType.includes("text/html")) {
    console.error(
      `proxy upstream HTML error (${upstreamRes.status}) from ${upstreamUrl}:`,
      body.slice(0, 1000),
    );
    return json(
      {
        error:
          "Upstream service is temporarily unavailable. Please try again later.",
        upstream_status: upstreamRes.status,
      },
      502,
    );
  }
  return new Response(body, {
    status: upstreamRes.status,
    headers: {
      ...corsHeaders,
      "Content-Type": contentType || "application/json",
    },
  });
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const segments = url.pathname.split("/").filter(Boolean);
    const route = segments[segments.length - 1] ?? "";
    const headers = buildHeaders(req);

    if (route === "zones") {
      const target = `${UPSTREAM}/zone/list`;
      const upstream = await fetch(target, { headers });
      return passThrough(upstream, target);
    }

    if (route === "modules") {
      const zoneId = url.searchParams.get("zone_id");
      const target = zoneId
        ? `${UPSTREAM}/module?zone_id=${encodeURIComponent(zoneId)}`
        : `${UPSTREAM}/module`;
      const reqHeaders = zoneId
        ? { ...headers, zoneId: `[${zoneId}]` }
        : headers;
      const upstream = await fetch(target, { headers: reqHeaders });
      return passThrough(upstream, target);
    }

    if (route === "packages") {
      const target = `${UPSTREAM}/vendor/package-view`;
      const upstream = await fetch(target, { headers });
      return passThrough(upstream, target);
    }

    if (route === "geocode") {
      const lat = url.searchParams.get("lat");
      const lng = url.searchParams.get("lng");
      const target = `${UPSTREAM}/config/geocode-api?lat=${encodeURIComponent(
        lat ?? "",
      )}&lng=${encodeURIComponent(lng ?? "")}`;
      const upstream = await fetch(target, { headers });
      return passThrough(upstream, target);
    }

    if (route === "categories") {
      // Catalog categories still come from the shopZone marketplace API.
      const target = `${MARKET_UPSTREAM}/categories`;
      const upstream = await fetch(target, { headers });
      return passThrough(upstream, target);
    }

    if (route === "register-store" && req.method === "POST") {
      const target = `${UPSTREAM}/auth/vendor/register`;
      const incomingType = req.headers.get("Content-Type") ?? "";
      const buffer = await req.arrayBuffer();
      console.log(
        "proxy: POST",
        target,
        "content-type:",
        incomingType,
        "bytes:",
        buffer.byteLength,
      );
      const upstream = await fetch(target, {
        method: "POST",
        headers: { ...headers, "Content-Type": incomingType },
        body: buffer,
      });
      return passThrough(upstream, target);
    }

    return json({ error: `Unknown route: ${route}` }, 404);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("proxy error:", message);
    return json({ error: message }, 500);
  }
});
