import { beforeEach, describe, expect, it, vi } from "vitest";

import { getVendorProfile, saveVendorProfile } from "./vendorProfile";

const createLocalStorage = () => {
  const store = new Map<string, string>();

  return {
    getItem: vi.fn((key: string) => store.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store.set(key, value);
    }),
    removeItem: vi.fn((key: string) => {
      store.delete(key);
    }),
    clear: vi.fn(() => {
      store.clear();
    }),
  };
};

describe("vendorProfile", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", createLocalStorage());
  });

  it("stores only the non-sensitive vendor profile fields", () => {
    saveVendorProfile("vendor@example.com", {
      fullName: "Vendor User",
      phone: "01000000000",
    });

    const raw = vi.mocked(localStorage.setItem).mock.calls[0]?.[1];

    expect(raw).toBeTruthy();
    expect(JSON.parse(raw!)).toEqual({
      fullName: "Vendor User",
      phone: "01000000000",
    });
    expect(raw).not.toContain("password");
  });

  it("returns null for incomplete cached profiles", () => {
    localStorage.setItem("vendor_profile_vendor_example_com", "{}");

    expect(getVendorProfile("vendor@example.com")).toBeNull();
  });
});
