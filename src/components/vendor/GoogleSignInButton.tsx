import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";

const GOOGLE_SCRIPT_SRC = "https://accounts.google.com/gsi/client";
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as
  string | undefined;

type GoogleCredentialResponse = {
  credential?: string;
};

type GoogleAccounts = {
  accounts: {
    id: {
      initialize: (options: {
        client_id: string;
        callback: (response: GoogleCredentialResponse) => void;
        ux_mode?: "popup" | "redirect";
      }) => void;
      renderButton: (
        parent: HTMLElement,
        options: {
          theme?: "outline" | "filled_blue" | "filled_black";
          size?: "large" | "medium" | "small";
          type?: "standard" | "icon";
          shape?: "rectangular" | "pill" | "circle" | "square";
          text?: "signin_with" | "signup_with" | "continue_with" | "signin";
          width?: number;
          locale?: string;
        },
      ) => void;
    };
  };
};

declare global {
  interface Window {
    google?: GoogleAccounts;
  }
}

export interface GoogleVendorUser {
  email: string;
  fullName: string;
  avatarUrl?: string;
}

let googleScriptPromise: Promise<void> | null = null;
let googleInitializedClientId: string | null = null;
let activeCredentialHandler:
  ((response: GoogleCredentialResponse) => void | Promise<void>) | null = null;

const loadGoogleScript = () => {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.google?.accounts?.id) return Promise.resolve();
  if (googleScriptPromise) return googleScriptPromise;

  googleScriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${GOOGLE_SCRIPT_SRC}"]`,
    );

    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("Google script failed to load")),
        { once: true },
      );
      return;
    }

    const script = document.createElement("script");
    script.src = GOOGLE_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Google script failed to load"));
    document.head.appendChild(script);
  });

  return googleScriptPromise;
};

const textFromMetadata = (
  metadata: Record<string, unknown>,
  keys: string[],
) => {
  for (const key of keys) {
    const value = metadata[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
};

const initializeGoogle = (clientId: string) => {
  if (!window.google?.accounts?.id) return;
  if (googleInitializedClientId === clientId) return;

  window.google.accounts.id.initialize({
    client_id: clientId,
    ux_mode: "popup",
    callback: (response) => {
      void activeCredentialHandler?.(response);
    },
  });
  googleInitializedClientId = clientId;
};

export const GoogleSignInButton = ({
  lang,
  onSuccess,
  onError,
  disabled,
  text = "continue_with",
}: {
  lang: "ar" | "en";
  onSuccess: (user: GoogleVendorUser) => void | Promise<void>;
  onError: (message: string) => void;
  disabled?: boolean;
  text?: "signin_with" | "signup_with" | "continue_with" | "signin";
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const render = async () => {
      if (!GOOGLE_CLIENT_ID) {
        setLoading(false);
        return;
      }

      try {
        await loadGoogleScript();
        if (
          cancelled ||
          !containerRef.current ||
          !window.google?.accounts?.id
        ) {
          return;
        }

        const credentialHandler = async (
          response: GoogleCredentialResponse,
        ) => {
          if (!response.credential) {
            onError(
              lang === "ar"
                ? "تعذر تسجيل الدخول عبر Google."
                : "Could not sign in with Google.",
            );
            return;
          }

          const { data, error } = await supabase.auth.signInWithIdToken({
            provider: "google",
            token: response.credential,
          });

          if (error || !data.user?.email) {
            onError(
              error?.message ||
                (lang === "ar"
                  ? "تعذر تأكيد حساب Google."
                  : "Could not verify Google account."),
            );
            return;
          }

          const metadata = data.user.user_metadata as Record<string, unknown>;
          const fullName =
            textFromMetadata(metadata, ["full_name", "name"]) ||
            data.user.email.split("@")[0];

          await onSuccess({
            email: data.user.email,
            fullName,
            avatarUrl: textFromMetadata(metadata, ["avatar_url", "picture"]),
          });
        };

        activeCredentialHandler = credentialHandler;
        containerRef.current.innerHTML = "";
        initializeGoogle(GOOGLE_CLIENT_ID);
        window.google.accounts.id.renderButton(containerRef.current, {
          theme: "outline",
          size: "large",
          type: "standard",
          shape: "pill",
          text,
          width: Math.min(containerRef.current.offsetWidth || 360, 420),
          locale: lang === "ar" ? "ar" : "en",
        });
      } catch (error) {
        onError(
          error instanceof Error
            ? error.message
            : lang === "ar"
              ? "تعذر تحميل تسجيل الدخول عبر Google."
              : "Could not load Google sign-in.",
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    render();

    return () => {
      cancelled = true;
      activeCredentialHandler = null;
    };
  }, [lang, onError, onSuccess, text]);

  if (!GOOGLE_CLIENT_ID) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-muted/30 px-4 py-3 text-center text-sm font-semibold text-muted-foreground">
        {lang === "ar"
          ? "تسجيل Google غير مهيأ حالياً."
          : "Google sign-in is not configured yet."}
      </div>
    );
  }

  return (
    <div
      className={`relative min-h-11 overflow-hidden rounded-full ${disabled ? "pointer-events-none opacity-60" : ""}`}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center rounded-full border border-border bg-background">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
        </div>
      )}
      <div ref={containerRef} className="flex justify-center" />
    </div>
  );
};
