import { useEffect, useRef } from "react";
import { useLocation } from "@/lib/router-compat";

/**
 * Resets scroll on real route changes. Same-pathname updates (e.g. switching
 * marketplace category filter via `replace`) are ignored so the page does not
 * jump while the user is browsing. Hash links smooth-scroll to the target.
 */
const ScrollToTop = () => {
  const { pathname, hash, key } = useLocation();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (hash) {
      // Wait for the target section to mount, then smooth-scroll to it.
      const id = hash.replace("#", "");
      // Try a few times in case the section mounts asynchronously.
      let attempts = 0;
      const tick = () => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        }
        if (attempts++ < 20) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      lastPath.current = pathname;
      return;
    }
    // Only reset when pathname actually changes — preserves scroll for
    // same-route URL updates like marketplace filter clicks.
    if (lastPath.current !== pathname) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      lastPath.current = pathname;
    }
  }, [pathname, hash, key]);

  return null;
};

export default ScrollToTop;
