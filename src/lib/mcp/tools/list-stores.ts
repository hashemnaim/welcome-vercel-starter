import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "list_stores",
  title: "List stores by module",
  description:
    "List Shoplanser stores for a given module (business type), with optional zone and pagination.",
  inputSchema: {
    module_id: z.number().int().positive().describe("The store module id."),
    zone_id: z
      .number()
      .int()
      .positive()
      .default(1)
      .describe("Zone id (defaults to 1)."),
    limit: z
      .number()
      .int()
      .min(1)
      .max(100)
      .default(20)
      .describe("Max stores to return."),
    offset: z
      .number()
      .int()
      .min(1)
      .default(1)
      .describe("Page offset (1-based)."),
  },
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async ({ module_id, zone_id, limit, offset }) => {
    const res = await fetch(
      `https://dashboard.shoplanser.com/api/v1/stores/get-stores/all?offset=${offset}&limit=${limit}`,
      {
        headers: {
          "X-localization": "en",
          Accept: "application/json",
          moduleId: String(module_id),
          zoneId: `[${zone_id}]`,
          latitude: "30.033333",
          longitude: "31.233334",
        },
      },
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
