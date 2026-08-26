import { createFileRoute } from "@tanstack/react-router";
import VendorDashboard from "@/pages/VendorDashboard";

export const Route = createFileRoute("/vendor/dashboard")({
  // Private area: never server-render it, and keep it out of search results.
  // The session token lives in the browser only, so the server can't gate it.
  ssr: false,
  head: () => ({
    meta: [
      { title: "لوحة البائع — شوب لانسر" },
      { name: "robots", content: "noindex, nofollow" },
      {
        name: "description",
        content: "أدر كل متاجرك على شوب لانسر من مكان واحد.",
      },
    ],
  }),
  component: VendorDashboard,
});
