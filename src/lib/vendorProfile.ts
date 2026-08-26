export interface VendorProfile {
  fullName: string;
  phone: string;
}

const key = (email: string) =>
  `vendor_profile_${email.toLowerCase().replace(/[^a-z0-9]/g, "_")}`;

export const getVendorProfile = (email: string): VendorProfile | null => {
  try {
    const raw = localStorage.getItem(key(email));
    if (!raw) return null;
    const v = JSON.parse(raw);
    if (!v || typeof v !== "object") return null;
    if (!v.fullName || !v.phone) return null;
    return {
      fullName: String(v.fullName),
      phone: String(v.phone),
    };
  } catch {
    return null;
  }
};

export const saveVendorProfile = (email: string, p: VendorProfile) => {
  try {
    localStorage.setItem(key(email), JSON.stringify(p));
  } catch {
    /* ignore */
  }
};
