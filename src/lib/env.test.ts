import { describe, it, expect, vi, beforeEach } from "vitest";
import { getEnv, getServerEnv } from "./env";

describe("getEnv", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns default values when environment variables are not set", () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "");

    const result = getEnv();
    expect(result.NEXT_PUBLIC_API_URL).toBe("http://localhost:3000/api");
  });

  it("returns the environment variable value when set", () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com");

    const result = getEnv();
    expect(result.NEXT_PUBLIC_API_URL).toBe("https://api.example.com");
  });

  it("warns when using default values", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.stubEnv("NEXT_PUBLIC_API_URL", "");

    getEnv();

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining("Missing environment variable: NEXT_PUBLIC_API_URL"),
    );
    warnSpy.mockRestore();
  });

  it("does not warn when environment variable is set", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com");

    getEnv();

    expect(warnSpy).not.toHaveBeenCalled();
    warnSpy.mockRestore();
  });
});

describe("getServerEnv", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns the API key when set", () => {
    vi.stubEnv("HUGGINGFACE_API_KEY", "hf_test_key");

    const result = getServerEnv();
    expect(result.HUGGINGFACE_API_KEY).toBe("hf_test_key");
  });

  it("throws when HUGGINGFACE_API_KEY is missing", () => {
    vi.stubEnv("HUGGINGFACE_API_KEY", "");

    expect(() => getServerEnv()).toThrow(
      "Missing required server environment variable: HUGGINGFACE_API_KEY",
    );
  });

  it("throws when HUGGINGFACE_API_KEY is not set", () => {
    vi.stubEnv("HUGGINGFACE_API_KEY", "");

    expect(() => getServerEnv()).toThrow(
      "Missing required server environment variable: HUGGINGFACE_API_KEY",
    );
  });
});
