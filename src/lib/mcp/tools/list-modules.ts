import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "list_modules",
  title: "List store modules",
  description:
    "List the Shoplanser store modules (business types), optionally filtered by zone.",
  inputSchema: {
    zone_id: z
      .number()
      .int()
      .positive()
      .optional()
      .describe("Optional zone id to filter modules."),
  },
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async ({ zone_id }) => {
    const path = zone_id ? `/module?zone_id=${zone_id}` : "/module";
    const headers: Record<string, string> = {
      "X-localization": "en",
      Accept: "application/json",
    };
    if (zone_id) headers.zoneId = `[${zone_id}]`;
    const res = await fetch(`https://dashboard.shoplanser.com/api/v1${path}`, {
      headers,
    });
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
