import { describe, it, expect, vi, beforeEach } from "vitest";
import { getEnv, getServerEnv, getServerOptionalEnv } from "./env";

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
      expect.stringContaining("Missing environment variable: NEXT_PUBLIC_API_URL")
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
      "Missing required server environment variable: HUGGINGFACE_API_KEY"
    );
  });

  it("throws when HUGGINGFACE_API_KEY is not set", () => {
    vi.stubEnv("HUGGINGFACE_API_KEY", "");

    expect(() => getServerEnv()).toThrow(
      "Missing required server environment variable: HUGGINGFACE_API_KEY"
    );
  });
});

describe("getServerOptionalEnv", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns empty when HF_FLUX_ENDPOINT is not set", () => {
    vi.stubEnv("HF_FLUX_ENDPOINT", "");

    const result = getServerOptionalEnv();
    expect(result.HF_FLUX_ENDPOINT).toBeUndefined();
  });

  it("returns custom FLUX endpoint when env var is set", () => {
    vi.stubEnv("HF_FLUX_ENDPOINT", "https://flux-private-endpoint.hf.space");

    const result = getServerOptionalEnv();
    expect(result.HF_FLUX_ENDPOINT).toBe("https://flux-private-endpoint.hf.space");
  });

  it("returns custom Stable Diffusion endpoint when env var is set", () => {
    vi.stubEnv("HF_STABLE_DIFFUSION_ENDPOINT", "https://sd-private-endpoint.hf.space");

    const result = getServerOptionalEnv();
    expect(result.HF_STABLE_DIFFUSION_ENDPOINT).toBe("https://sd-private-endpoint.hf.space");
  });

  it("returns both endpoints when both are set", () => {
    vi.stubEnv("HF_FLUX_ENDPOINT", "https://flux-endpoint.hf.space");
    vi.stubEnv("HF_STABLE_DIFFUSION_ENDPOINT", "https://sd-endpoint.hf.space");

    const result = getServerOptionalEnv();
    expect(result.HF_FLUX_ENDPOINT).toBe("https://flux-endpoint.hf.space");
    expect(result.HF_STABLE_DIFFUSION_ENDPOINT).toBe("https://sd-endpoint.hf.space");
  });
});
