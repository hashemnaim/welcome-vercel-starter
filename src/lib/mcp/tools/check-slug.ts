import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "check_store_slug",
  title: "Check store slug availability",
  description: "Check whether a store slug is already taken on Shoplanser.",
  inputSchema: {
    slug: z.string().trim().min(1).describe("The store slug to check."),
  },
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async ({ slug }) => {
    const res = await fetch(
      `https://dashboard.shoplanser.com/api/v1/store/check-slug/${encodeURIComponent(slug)}`,
      { headers: { "X-localization": "en", Accept: "application/json" } },
    );
    const text = await res.text();
    if (!res.ok) {
      return {
        content: [
          {
            type: "text",
            text: `Failed (${res.status}): ${text.slice(0, 300)}`,
          },
        ],
        isError: true,
      };
    }
    return { content: [{ type: "text", text }] };
  },
});
