import { supabase } from "@/integrations/supabase/client";

/**
 * Full vendor sign-out: clears the Supabase session AND every piece of
 * local registration state (upstream vendor token + per-user vendor profile
 * draft saved during onboarding). Use this everywhere the user logs out so
 * the next visit starts from a clean login page.
 */
export const vendorSignOut = async () => {
  try {
    await supabase.auth.signOut();
  } catch {
    /* ignore — we still want to clear local state */
  }
  try {
    localStorage.removeItem("shoplanser_vendor_token");
    localStorage.removeItem("shoplanser_google_user");
    // Clear any saved vendor profile drafts (keys are `vendor_profile_`).
    const toRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i += 1) {
      const k = localStorage.key(i);
      if (k && k.startsWith("vendor_profile_")) toRemove.push(k);
    }
    toRemove.forEach((k) => localStorage.removeItem(k));
  } catch {
    /* ignore */
  }
};
