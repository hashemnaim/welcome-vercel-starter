import { describe, expect, it } from "vitest";
import { normalizeEgyptPhone } from "./vendorLogin";

describe("normalizeEgyptPhone", () => {
  it.each([
    ["01080140222", "1080140222"],
    ["+201080140222", "1080140222"],
    ["00201080140222", "1080140222"],
    ["201080140222", "1080140222"],
    ["1080140222", "1080140222"],
  ])("normalizes %s", (input, expected) => {
    expect(normalizeEgyptPhone(input)).toBe(expected);
  });

  it("rejects incomplete or non-Egyptian mobile numbers", () => {
    expect(normalizeEgyptPhone("108014022")).toBeNull();
    expect(normalizeEgyptPhone("5555555555")).toBeNull();
  });
});
