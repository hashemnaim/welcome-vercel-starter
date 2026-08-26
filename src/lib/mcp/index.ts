import { defineMcp } from "@lovable.dev/mcp-js";
import listZones from "./tools/list-zones";
import listModules from "./tools/list-modules";
import listCategories from "./tools/list-categories";
import listStores from "./tools/list-stores";
import checkSlug from "./tools/check-slug";

export default defineMcp({
  name: "shoplanser-mcp",
  title: "Shoplanser MCP",
  version: "0.1.0",
  instructions:
    "Public read-only tools for the Shoplanser marketplace: browse delivery zones, store modules (business types), categories, and stores, and check if a store slug is available before registering a new store.",
  tools: [listZones, listModules, listCategories, listStores, checkSlug],
});
