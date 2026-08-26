import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "list_categories",
  title: "List categories",
  description:
    "List Shoplanser categories, optionally scoped to a store module.",
  inputSchema: {
    module_id: z
      .number()
      .int()
      .positive()
      .optional()
      .describe("Optional module id to filter categories."),
  },
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async ({ module_id }) => {
    const headers: Record<string, string> = {
      "X-localization": "en",
      Accept: "application/json",
    };
    if (module_id) headers.moduleId = String(module_id);
    const res = await fetch(
      `https://dashboard.shoplanser.com/api/v1/categories`,
      { headers },
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
