// Direct client for shoplanser dashboard API (no Supabase proxy).
const BASE_URL = "https://dashboard.shoplanser.com/api/v1";

let currentLocale: "ar" | "en" = (() => {
  if (typeof window === "undefined") return "ar";
  const saved = window.localStorage.getItem("shoplancer-lang");
  return saved === "en" ? "en" : "ar";
})();
export const setApiLocale = (locale: "ar" | "en") => {
  currentLocale = locale;
};
export const getApiLocale = () => currentLocale;

const baseHeaders = (
  extra?: Record<string, string>,
): Record<string, string> => ({
  "X-localization": currentLocale,
  Accept: "application/json",
  ...(extra ?? {}),
});

const apiGet = async <T>(
  path: string,
  extraHeaders?: Record<string, string>,
): Promise<T> => {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: baseHeaders(extraHeaders),
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(
      `shoplanser ${path} failed (${res.status}): ${text.slice(0, 300)}`,
    );
  }
  try {
    return JSON.parse(text) as T;
  } catch {
    return text as unknown as T;
  }
};

export interface ApiZone {
  id: number;
  name: string;
}

export interface ApiModule {
  id: number;
  module_name?: string;
  name?: string;
  module_type?: string;
  icon_full_url?: string;
  thumbnail_full_url?: string;
}

export interface ApiStoreTranslation {
  locale: string;
  key: string;
  value: string;
}

export interface ApiStore {
  id: number;
  name: string;
  slug: string;
  logo_full_url?: string | null;
  cover_photo_full_url?: string | null;
  website_color?: string | null;
  delivery_time?: string | null;
  avg_rating?: number;
  rating_count?: number;
  address?: string | null;
  current_opening_time?: string;
  translations?: ApiStoreTranslation[];
}

export interface ApiCategory {
  id: number;
  name: string;
  image_full_url?: string;
  slug?: string;
  childes?: { id: number; name: string; slug?: string }[];
}

export interface ApiPackageFeature {
  title: string;
  description: string;
  enabled: number;
}

export interface ApiPackage {
  id: number;
  package_name: string;
  price: number;
  validity: number;
  max_order?: string;
  max_product?: string;
  module_type?: string;
  text?: string;
  custom_features?: ApiPackageFeature[];
}

export interface RegisterStorePayload {
  f_name: string;
  l_name: string;
  email: string;
  phone: string;
  country_code?: string;
  password: string;
  store_name: string; // English store name
  store_name_ar?: string; // Arabic store name (optional, falls back to store_name)
  address: string; // English address
  address_ar?: string; // Arabic address (optional, falls back to address)
  latitude: number;
  longitude: number;
  zone_id: number;
  module_id: number;
  category_id?: number;
  category_ids?: number[];
  slug?: string;
  color?: string;
  delivery_time_type: string; // "minute" | "hour"
  minimum_delivery_time?: string;
  maximum_delivery_time?: string;
  business_plan?: string; // "commission" | "subscription"
  package_id?: string;
  subscription_term?: string;
  pickup_zone_id?: (number | string)[];
  tin?: string;
  tin_expire_date?: string; // YYYY-MM-DD
  logo?: File | null;
  cover_photo?: File | null;
  tin_certificate_image?: File | null;
  // Delivery & schedule
  delivery_price?: string | number;
  delivery_currency?: string;
  opening_time?: string; // HH:mm
  closing_time?: string; // HH:mm
  is_open_24_hours?: boolean;
}

export interface SlugCheckResult {
  exist: boolean;
  message?: string;
}

/** GET /store/check-slug/{slug} → { exist: boolean, message: string } */
export const checkSlug = async (slug: string): Promise<SlugCheckResult> => {
  const clean = slug.trim();
  if (!clean) return { exist: false };
  const data = await apiGet<unknown>(
    `/store/check-slug/${encodeURIComponent(clean)}`,
  );
  if (data && typeof data === "object") {
    const obj = data as { exist?: unknown; message?: unknown };
    return {
      exist: Boolean(obj.exist),
      message: typeof obj.message === "string" ? obj.message : undefined,
    };
  }
  return { exist: false };
};

export const fetchZones = async (): Promise<ApiZone[]> => {
  const data = await apiGet<unknown>("/zone/list");
  if (Array.isArray(data)) return data as ApiZone[];
  if (
    data &&
    typeof data === "object" &&
    Array.isArray((data as { zones?: unknown }).zones)
  ) {
    return (data as { zones: ApiZone[] }).zones;
  }
  return [];
};

export const fetchModules = async (
  zoneId?: number | string,
): Promise<ApiModule[]> => {
  const path = zoneId
    ? `/module?zone_id=${encodeURIComponent(String(zoneId))}`
    : "/module";
  const extra = zoneId ? { zoneId: `[${zoneId}]` } : undefined;
  const data = await apiGet<unknown>(path, extra);
  if (Array.isArray(data)) return data as ApiModule[];
  if (
    data &&
    typeof data === "object" &&
    Array.isArray((data as { modules?: unknown }).modules)
  ) {
    return (data as { modules: ApiModule[] }).modules;
  }
  return [];
};

export const fetchPackages = async (): Promise<ApiPackage[]> => {
  const data = await apiGet<unknown>("/vendor/package-view");
  if (
    data &&
    typeof data === "object" &&
    Array.isArray((data as { packages?: unknown }).packages)
  ) {
    return (data as { packages: ApiPackage[] }).packages;
  }
  if (Array.isArray(data)) return data as ApiPackage[];
  return [];
};

export const fetchCategories = async (
  moduleId?: number | string,
): Promise<ApiCategory[]> => {
  const extra = moduleId ? { moduleId: String(moduleId) } : undefined;
  const data = await apiGet<unknown>("/categories", extra);
  if (Array.isArray(data)) return data as ApiCategory[];
  if (
    data &&
    typeof data === "object" &&
    Array.isArray((data as { categories?: unknown }).categories)
  ) {
    return (data as { categories: ApiCategory[] }).categories;
  }
  return [];
};

export interface FetchStoresOptions {
  zoneId?: number[];
  latitude?: number;
  longitude?: number;
  offset?: number;
  limit?: number;
}

export const fetchStoresByModule = async (
  moduleId: number | string,
  opts: FetchStoresOptions = {},
): Promise<ApiStore[]> => {
  const {
    zoneId = [1],
    latitude = 30.033333,
    longitude = 31.233334,
    offset = 1,
    limit = 50,
  } = opts;
  const data = await apiGet<unknown>(
    `/stores/get-stores/all?offset=${offset}&limit=${limit}`,
    {
      moduleId: String(moduleId),
      zoneId: `[${zoneId.join(",")}]`,
      latitude: String(latitude),
      longitude: String(longitude),
    },
  );
  if (
    data &&
    typeof data === "object" &&
    Array.isArray((data as { stores?: unknown }).stores)
  ) {
    return (data as { stores: ApiStore[] }).stores;
  }
  if (Array.isArray(data)) return data as ApiStore[];
  return [];
};

/**
 * POST https://dashboard.shoplanser.com/api/v1/auth/vendor/register  (multipart)
 * Direct from the frontend. Mirrors the upstream curl exactly.
 */
export const registerStore = async (payload: RegisterStorePayload) => {
  const fd = new FormData();
  const append = (k: string, v: unknown) => {
    if (v === undefined || v === null || v === "") return;
    if (v instanceof File) fd.append(k, v);
    else fd.append(k, String(v));
  };

  // Localized translations (name + address, en/ar)
  const nameEn = payload.store_name;
  const nameAr = payload.store_name_ar || payload.store_name;
  const addrEn = payload.address;
  const addrAr = payload.address_ar || payload.address;
  // Verified upstream payload shape (probed against the live
  // dashboard.shoplanser.com endpoint):
  //   * translations are a JSON string with objects `{lang, key, value}`
  //     — NOT `{locale, key, value}` (the controller reads $t['lang'] and
  //     throws "Undefined array key 'lang'" otherwise).
  //   * the store's name MUST be sent as the scalar `store_name`
  //     (a plain `name` scalar is ignored — the upstream controller reads
  //     `$request->store_name`, which is why probes with only `name` left
  //     the `stores.name` column NULL).
  //   * the store's address is sent as the scalar `address`.
  const translations = [
    { lang: "en", key: "name", value: nameEn },
    { lang: "ar", key: "name", value: nameAr },
    { lang: "en", key: "address", value: addrEn },
    { lang: "ar", key: "address", value: addrAr },
  ];
  fd.append("translations", JSON.stringify(translations));

  const nameValue = nameEn || nameAr;
  const addrValue = addrEn || addrAr;
  append("store_name", nameValue);
  append("address", addrValue);

  append("minimum_delivery_time", payload.minimum_delivery_time ?? "20");
  append("maximum_delivery_time", payload.maximum_delivery_time ?? "60");
  const dtt = (payload.delivery_time_type || "minute").toLowerCase();
  append("delivery_time_type", dtt.startsWith("hour") ? "hour" : "minute");

  append("latitude", payload.latitude);
  append("longitude", payload.longitude);
  append("f_name", payload.f_name);
  append("l_name", payload.l_name);
  append("phone", payload.phone);
  append("country_code", payload.country_code);
  append("email", payload.email);
  append("password", payload.password);
  append("zone_id", payload.zone_id);
  append("module_id", payload.module_id);
  if (payload.category_ids && payload.category_ids.length > 0) {
    payload.category_ids.forEach((id, i) =>
      fd.append(`category_id[${i}]`, String(id)),
    );
  } else if (payload.category_id !== undefined) {
    fd.append("category_id[0]", String(payload.category_id));
  }
  append("slug", payload.slug);
  append("website_color", payload.color);

  const plan = (payload.business_plan ?? "").toLowerCase();
  append(
    "business_plan",
    plan === "subscription" ? "subscription" : "commission",
  );
  // package_id may be empty string per curl — always send the field
  fd.append(
    "package_id",
    payload.package_id && /^\d+$/.test(String(payload.package_id))
      ? String(payload.package_id)
      : "",
  );
  append("subscription_term", payload.subscription_term);

  // pickup_zone_id: JSON-encoded array of strings (defaults to [zone_id])
  const pickupRaw =
    payload.pickup_zone_id && payload.pickup_zone_id.length > 0
      ? payload.pickup_zone_id
      : [payload.zone_id];
  fd.append("pickup_zone_id", JSON.stringify(pickupRaw.map((z) => String(z))));

  append("tin", payload.tin);
  append("tin_expire_date", payload.tin_expire_date);

  // Delivery & schedule — `delivery_price` is NOT NULL upstream; always send a value
  // (defaults to 0). Verified via live probe: omitting it returns
  // "Column 'delivery_price' cannot be null".
  const deliveryPriceValue =
    payload.delivery_price !== undefined && payload.delivery_price !== ""
      ? payload.delivery_price
      : 0;
  fd.append("delivery_price", String(deliveryPriceValue));
  append("delivery_currency", payload.delivery_currency);
  const is24 = !!payload.is_open_24_hours;
  fd.append("is_open_24_hours", is24 ? "1" : "0");
  if (!is24) {
    append("opening_time", payload.opening_time);
    append("closing_time", payload.closing_time);
  }

  if (payload.logo) fd.append("logo", payload.logo);
  if (payload.cover_photo) fd.append("cover_photo", payload.cover_photo);
  if (payload.tin_certificate_image)
    fd.append("tin_certificate_image", payload.tin_certificate_image);

  const res = await fetch(`${BASE_URL}/auth/vendor/register`, {
    method: "POST",
    headers: baseHeaders(),
    body: fd,
  });
  const text = await res.text();
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    parsed = text;
  }
  if (!res.ok) {
    const msg =
      typeof parsed === "object" && parsed && "message" in parsed
        ? String((parsed as { message?: unknown }).message)
        : text.slice(0, 400);
    throw new Error(`register failed (${res.status}): ${msg}`);
  }
  return parsed as {
    message?: string;
    store_id?: number;
    [k: string]: unknown;
  };
};

export interface VendorLoginResult {
  token?: string;
  vendor_id?: number;
  store_id?: number;
  message?: string;
  [k: string]: unknown;
}

/**
 * POST https://dashboard.shoplanser.com/api/v1/auth/vendor/login
 * Upstream requires explicit `phone` and `email_or_phone` fields even when
 * the user signs in with email, so `phone` intentionally mirrors the login id.
 */
export const loginVendor = async (
  emailOrPhone: string,
  password: string,
): Promise<VendorLoginResult> => {
  const isEmail = /@/.test(emailOrPhone);
  const body: Record<string, string> = {
    email_or_phone: emailOrPhone,
    password,
    phone: emailOrPhone,
    email: isEmail ? emailOrPhone : "",
  };
  const res = await fetch(`${BASE_URL}/auth/vendor/login`, {
    method: "POST",
    headers: baseHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(body),
  });

  const text = await res.text();
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    parsed = text;
  }
  if (!res.ok) {
    const msg =
      typeof parsed === "object" && parsed && "message" in parsed
        ? String((parsed as { message?: unknown }).message)
        : typeof parsed === "object" &&
            parsed &&
            Array.isArray((parsed as { errors?: unknown }).errors) &&
            (parsed as { errors: { message?: unknown }[] }).errors[0]?.message
          ? String(
              (parsed as { errors: { message?: unknown }[] }).errors[0].message,
            )
          : text.slice(0, 400);
    throw new Error(`login failed (${res.status}): ${msg}`);
  }
  return parsed as VendorLoginResult;
};

export interface GoogleCheckResult {
  status: "success" | "needs_profile";
  token?: string;
  vendor_id?: number;
  has_store?: boolean;
  message?: string;
}

/** Check if google email is already registered in backend */
export const checkGoogleAccount = async (
  email: string,
): Promise<GoogleCheckResult> => {
  const url = `${BASE_URL}/auth/vendor/google-check`;
  const headers = baseHeaders({ "Content-Type": "application/json" });
  const body = { email };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const text = await res.text();
    if (!res.ok) throw new Error(`Google account check failed: ${text}`);
    return JSON.parse(text) as GoogleCheckResult;
  } catch (error) {
    console.error(`[API ERROR] POST ${url}`, error);
    throw error;
  }
};

export interface GoogleRegisterPayload {
  f_name: string;
  l_name: string;
  email: string;
  phone: string;
  country_code?: string;
  password: string;
}

/** Register new Vendor account on backend */
export const registerVendorOnly = async (payload: GoogleRegisterPayload) => {
  const url = `${BASE_URL}/auth/vendor/google-register`;
  const headers = baseHeaders({ "Content-Type": "application/json" });

  try {
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    if (!res.ok) throw new Error(`Vendor registration failed: ${text}`);
    return JSON.parse(text) as {
      token: string;
      vendor_id: number;
      status: string;
    };
  } catch (error) {
    console.error(`[API ERROR] POST ${url}`, error);
    throw error;
  }
};

/** Create store for authenticated vendor */
export const createVendorStore = async (
  payload: RegisterStorePayload,
  token: string,
) => {
  const fd = new FormData();

  const append = (k: string, v: unknown) => {
    if (v === undefined || v === null || v === "") return;
    if (v instanceof File) fd.append(k, v);
    else fd.append(k, String(v));
  };

  const nameEn = payload.store_name;
  const nameAr = payload.store_name_ar || payload.store_name;
  const addrEn = payload.address;
  const addrAr = payload.address_ar || payload.address;

  const translations = [
    { lang: "en", key: "name", value: nameEn },
    { lang: "ar", key: "name", value: nameAr },
    { lang: "en", key: "address", value: addrEn },
    { lang: "ar", key: "address", value: addrAr },
  ];
  fd.append("translations", JSON.stringify(translations));

  append("store_name", nameEn || nameAr);
  append("address", addrEn || addrAr);
  append("minimum_delivery_time", payload.minimum_delivery_time ?? "20");
  append("maximum_delivery_time", payload.maximum_delivery_time ?? "60");
  append(
    "delivery_time_type",
    (payload.delivery_time_type || "minute").toLowerCase().startsWith("hour")
      ? "hour"
      : "minute",
  );
  append("latitude", payload.latitude);
  append("longitude", payload.longitude);
  append("zone_id", payload.zone_id);
  append("module_id", payload.module_id);

  if (payload.category_ids && payload.category_ids.length > 0) {
    payload.category_ids.forEach((id, i) =>
      fd.append(`category_id[${i}]`, String(id)),
    );
  }

  append("slug", payload.slug);
  append("website_color", payload.color);
  append("business_plan", payload.business_plan);

  fd.append(
    "package_id",
    payload.package_id && /^\d+$/.test(String(payload.package_id))
      ? String(payload.package_id)
      : "",
  );
  append("subscription_term", payload.subscription_term);

  const pickupRaw =
    payload.pickup_zone_id && payload.pickup_zone_id.length > 0
      ? payload.pickup_zone_id
      : [payload.zone_id];
  fd.append("pickup_zone_id", JSON.stringify(pickupRaw.map((z) => String(z))));

  append("tin", payload.tin);
  append("tin_expire_date", payload.tin_expire_date);

  const deliveryPriceValue =
    payload.delivery_price !== undefined && payload.delivery_price !== ""
      ? payload.delivery_price
      : 0;
  fd.append("delivery_price", String(deliveryPriceValue));
  append("delivery_currency", payload.delivery_currency);

  const is24 = !!payload.is_open_24_hours;
  fd.append("is_open_24_hours", is24 ? "1" : "0");
  if (!is24) {
    append("opening_time", payload.opening_time);
    append("closing_time", payload.closing_time);
  }

  if (payload.logo) fd.append("logo", payload.logo);
  if (payload.cover_photo) fd.append("cover_photo", payload.cover_photo);
  if (payload.tin_certificate_image)
    fd.append("tin_certificate_image", payload.tin_certificate_image);

  const url = `${BASE_URL}/auth/vendor/create-store`;
  const headers = {
    "X-localization": getApiLocale(),
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: fd,
    });

    const text = await res.text();
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = text;
    }

    if (!res.ok) {
      const msg =
        typeof parsed === "object" && parsed && "message" in parsed
          ? String((parsed as { message?: unknown }).message)
          : text.slice(0, 400);
      throw new Error(`Store creation failed (${res.status}): ${msg}`);
    }

    return parsed as {
      message?: string;
      store_id?: number;
      redirect_url?: string;
    };
  } catch (error) {
    console.error(`[API ERROR] POST ${url}`, error);
    throw error;
  }
};

export interface ApiStoreFromProfile {
  id: number;
  name: string;
  phone: string;
  email: string;
  logo: string | null;
  latitude: string;
  longitude: string;
  address: string;
  slug: string;
  website_color: string | null;
  logo_full_url: string | null;
  cover_photo_full_url: string | null;
  store_business_model: string;
  package_id: number | null;
  delivery_price: string;
  opening_time: string | null;
  closing_time: string | null;
  is_open_24_hours: number;
  module?: {
    id: number;
    module_name: string;
    module_type: string;
  };
  total_items?: number;
}

export interface ApiVendorProfile {
  id: number;
  f_name: string;
  l_name: string;
  phone: string;
  email: string;
  stores: ApiStoreFromProfile[];
  [key: string]: unknown;
}

/** GET /vendor/profile to fetch vendor and store data */
export const fetchVendorProfile = async (
  token: string,
): Promise<ApiVendorProfile> => {
  const url = `${BASE_URL}/vendor/profile`;
  const headers = {
    "Content-Type": "application/json; charset=UTF-8",
    "X-localization": getApiLocale(),
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
    vendorType: "owner",
    moduleId: "1",
  };

  try {
    const res = await fetch(url, {
      method: "GET",
      headers,
    });

    const text = await res.text();
    if (!res.ok) throw new Error(`Failed to fetch vendor profile: ${text}`);
    return JSON.parse(text) as ApiVendorProfile;
  } catch (error) {
    console.error(`[API ERROR] GET ${url}`, error);
    throw error;
  }
};

export const getStoreName = (s: ApiStore, isAr: boolean): string => {
  if (isAr) {
    const tr = s.translations?.find(
      (t) => t.locale === "ar" && (t.key === "name" || t.key === "store_name"),
    );
    if (tr?.value) return tr.value;
  }
  return s.name;
};

export const getStoreAddress = (s: ApiStore, isAr: boolean): string => {
  if (isAr) {
    const tr = s.translations?.find(
      (t) => t.locale === "ar" && t.key === "address",
    );
    if (tr?.value) return tr.value;
  }
  return s.address || "";
};

export interface ApiConfig {
  download_user_app_links?: {
    playstore_url_status?: string | number;
    playstore_url?: string | null;
    apple_store_url_status?: string | number;
    apple_store_url?: string | null;
  };
}

let cachedConfig: ApiConfig | null = null;
let configPromise: Promise<ApiConfig> | null = null;

export const fetchConfig = async (): Promise<ApiConfig> => {
  if (cachedConfig) return cachedConfig;
  if (configPromise) return configPromise;

  configPromise = apiGet<ApiConfig>("/config")
    .then((data) => {
      cachedConfig = data;
      configPromise = null;
      return data;
    })
    .catch((err) => {
      console.error("Failed to fetch config:", err);
      configPromise = null;
      return {};
    });

  return configPromise;
};
