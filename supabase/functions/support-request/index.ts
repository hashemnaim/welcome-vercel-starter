// Receives support / contact form submissions, stores them in the database
// and (when RESEND_API_KEY is configured) emails the support team.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";

const baseHeaders = {
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  Vary: "Origin",
};

// Only our own front-ends may call this endpoint from a browser.
const ALLOWED_ORIGINS = [
  "https://shoplanser.com",
  "https://www.shoplanser.com",
  "http://localhost:8080",
];

const originAllowed = (origin: string | null) => {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  try {
    return /\.lovable\.app$/.test(new URL(origin).hostname);
  } catch {
    return false;
  }
};

const corsFor = (origin: string | null) => ({
  ...baseHeaders,
  "Access-Control-Allow-Origin": originAllowed(origin)
    ? origin!
    : ALLOWED_ORIGINS[0],
});

// Simple sliding-window rate limit, per warm instance.
const RATE_LIMIT = 3; // submissions
const RATE_WINDOW_MS = 10 * 60 * 1000; // per 10 minutes
const hits = new Map<string, number[]>();

const rateLimited = (key: string) => {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  return false;
};

const SUPPORT_EMAIL = Deno.env.get("SUPPORT_EMAIL") ?? "support@shoplancer.com";

const str = (v: unknown, max: number) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");
  const cors = corsFor(origin);

  const json = (data: unknown, status = 200) =>
    new Response(JSON.stringify(data), {
      status,
      headers: { ...cors, "Content-Type": "application/json" },
    });

  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  // Browser calls must come from one of our own origins.
  if (origin && !originAllowed(origin))
    return json({ error: "forbidden_origin" }, 403);

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("cf-connecting-ip") ||
    "unknown";
  if (rateLimited(ip)) return json({ error: "rate_limited" }, 429);

  try {
    const body = await req.json().catch(() => ({}));

    // Honeypot: real users never fill this hidden field.
    if (str(body.company, 100)) return json({ ok: true, id: null });

    const name = str(body.name, 100);
    const email = str(body.email, 255).toLowerCase();
    const phone = str(body.phone, 40);
    const subject = str(body.subject, 150);
    const category = str(body.category, 40) || "general";
    const message = str(body.message, 3000);
    const source = str(body.source, 60) || "website";

    const errors: string[] = [];
    if (!name) errors.push("name");
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errors.push("email");
    if (!message || message.length < 10) errors.push("message");
    if (errors.length)
      return json({ error: "invalid_input", fields: errors }, 400);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } },
    );

    const { data, error } = await supabase
      .from("support_requests")
      .insert({
        name,
        email,
        phone: phone || null,
        subject: subject || null,
        category,
        message,
        source,
      })
      .select("id")
      .single();

    if (error) {
      console.error("insert failed", error.message);
      return json({ error: "storage_failed" }, 500);
    }

    // Optional email notification
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (resendKey) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Shoplanser <onboarding@resend.dev>",
            to: [SUPPORT_EMAIL],
            reply_to: email,
            subject: `[${category}] ${subject || "New support request"}`,
            html: `<h3>New support request</h3>
<p><b>Name:</b> ${name}</p>
<p><b>Email:</b> ${email}</p>
<p><b>Phone:</b> ${phone || "-"}</p>
<p><b>Category:</b> ${category}</p>
<p><b>Subject:</b> ${subject || "-"}</p>
<p><b>Message:</b><br/>${message.replace(/</g, "&lt;").replace(/\n/g, "<br/>")}</p>`,
          }),
        });
      } catch (e) {
        console.error("email notification failed", (e as Error).message);
      }
    }

    return json({ ok: true, id: data.id });
  } catch (e) {
    console.error("unexpected error", (e as Error).message);
    return json({ error: "unexpected" }, 500);
  }
});
