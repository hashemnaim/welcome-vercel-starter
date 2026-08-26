import { describe, expect, it } from "vitest";
import {
  DEFAULT_IMAGE,
  SITE_NAME,
  SITE_URL,
  absoluteUrl,
  pageHead,
} from "./seo";

describe("seo utilities", () => {
  it("builds absolute URLs from root-relative paths", () => {
    expect(absoluteUrl("/privacy")).toBe(`${SITE_URL}/privacy`);
  });

  it("keeps already absolute URLs unchanged", () => {
    const url = "https://cdn.example.com/image.png";
    expect(absoluteUrl(url)).toBe(url);
  });

  it("creates canonical and social metadata for a page", () => {
    const head = pageHead({
      title: "Test page",
      description: "Test description",
      path: "/test",
      image: DEFAULT_IMAGE,
    });

    expect(head.links).toContainEqual({
      rel: "canonical",
      href: `${SITE_URL}/test`,
    });

    expect(head.meta).toContainEqual({
      property: "og:title",
      content: "Test page",
    });

    expect(head.meta).toContainEqual({
      property: "og:site_name",
      content: SITE_NAME,
    });
  });
});
