import { getApiLocale } from "@/lib/shoplanserApi";

const LOGIN_URL = "https://dashboard.shoplanser.com/api/v1/auth/vendor/login";

export type VendorLoginMode = "phone" | "email";

export interface VendorLoginResult {
  token?: string;
  vendor_id?: number;
  store_id?: number;
  message?: string;
  [key: string]: unknown;
}

export const normalizeEgyptPhone = (raw: string): string | null => {
  let digits = raw.replace(/\D/g, "");

  if (digits.startsWith("0020")) digits = digits.slice(4);
  else if (digits.startsWith("20")) digits = digits.slice(2);

  if (digits.startsWith("0")) digits = digits.slice(1);

  return /^1\d{9}$/.test(digits) ? digits : null;
};

const extractErrorMessage = (parsed: unknown, fallback: string) => {
  if (parsed && typeof parsed === "object") {
    if ("message" in parsed && typeof parsed.message === "string") {
      return parsed.message;
    }

    if (
      "errors" in parsed &&
      Array.isArray(parsed.errors) &&
      parsed.errors[0] &&
      typeof parsed.errors[0] === "object" &&
      "message" in parsed.errors[0] &&
      typeof parsed.errors[0].message === "string"
    ) {
      return parsed.errors[0].message;
    }
  }

  return fallback;
};

export const loginVendorAccount = async ({
  identifier,
  password,
  mode,
}: {
  identifier: string;
  password: string;
  mode: VendorLoginMode;
}): Promise<VendorLoginResult> => {
  const cleanIdentifier = identifier.trim();
  const phone = mode === "phone" ? normalizeEgyptPhone(cleanIdentifier) : null;

  if (mode === "phone" && !phone) {
    throw new Error("INVALID_EGYPT_PHONE");
  }

  if (mode === "email" && !/^\S+@\S+\.\S+$/.test(cleanIdentifier)) {
    throw new Error("INVALID_EMAIL");
  }

  const loginId = mode === "phone" ? phone! : cleanIdentifier;
  const body: Record<string, string> = {
    email_or_phone: loginId,
    password,
    phone: loginId,
    email: mode === "email" ? cleanIdentifier : "",
  };

  if (mode === "phone") {
    body.country_code = "+20";
  }

  const response = await fetch(LOGIN_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-localization": getApiLocale(),
    },
    body: JSON.stringify(body),
  });

  const text = await response.text();
  let parsed: unknown;

  try {
    parsed = JSON.parse(text);
  } catch {
    parsed = text;
  }

  if (!response.ok) {
    throw new Error(
      extractErrorMessage(parsed, text.slice(0, 400) || "LOGIN_FAILED"),
    );
  }

  return parsed as VendorLoginResult;
};
