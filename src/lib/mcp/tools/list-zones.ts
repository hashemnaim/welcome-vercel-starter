import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "list_zones",
  title: "List delivery zones",
  description: "List the Shoplanser delivery zones available for stores.",
  inputSchema: {},
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async () => {
    const res = await fetch(
      "https://dashboard.shoplanser.com/api/v1/zone/list",
      {
        headers: { "X-localization": "en", Accept: "application/json" },
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
