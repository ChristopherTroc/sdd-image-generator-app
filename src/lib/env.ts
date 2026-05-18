/**
 * Environment variables type definitions
 * Provides type-safe access to environment variables
 */

const envSchema = {
  // Public variables (accessible in browser)
  NEXT_PUBLIC_API_URL: {
    default: "http://localhost:3000/api",
    description: "API base URL",
  },
} as const;

// Server-only environment variables (not exposed to client)
const serverEnvSchema = {
  HUGGINGFACE_API_KEY: {
    description:
      "Hugging Face Inference API token (get one at https://huggingface.co/settings/tokens)",
  },
} as const;

const serverOptionalSchema = {
  HF_FLUX_ENDPOINT: {
    description: "Custom endpoint for black-forest-labs/FLUX.1-schnell private inference instance (optional)",
  },
  HF_STABLE_DIFFUSION_ENDPOINT: {
    description: "Custom endpoint for stable-diffusion-xl-base-1-0-hnm private inference instance (optional)",
  },
} as const;

// Type for validated environment variables
export type Env = {
  [K in keyof typeof envSchema]: string;
};

export type ServerEnv = {
  [K in keyof typeof serverEnvSchema]: string;
};

// Validate and get client-safe environment variables
export function getEnv(): Env {
  const env: Record<string, string> = {};

  for (const [key, config] of Object.entries(envSchema)) {
    const value = process.env[key];
    if (!value) {
      console.warn(`Missing environment variable: ${key}. Using default: ${config.default}`);
      env[key] = config.default;
    } else {
      env[key] = value;
    }
  }

  return env as Env;
}

// Validate and get server-only environment variables
export function getServerEnv(): ServerEnv {
  const env: Record<string, string> = {};

  for (const [key, config] of Object.entries(serverEnvSchema)) {
    const value = process.env[key];
    if (!value) {
      throw new Error(
        `Missing required server environment variable: ${key}. ${config.description}`
      );
    }
    env[key] = value;
  }

  return env as ServerEnv;
}

// Export validated environment
export const env = getEnv();

// Validate and get optional server-only environment variables
export function getServerOptionalEnv(): { HF_FLUX_ENDPOINT?: string; HF_STABLE_DIFFUSION_ENDPOINT?: string } {
  const result: Record<string, string | undefined> = {};

  for (const [key] of Object.entries(serverOptionalSchema)) {
    const value = process.env[key];
    if (value) {
      result[key] = value;
    }
  }

  return result as { HF_FLUX_ENDPOINT?: string; HF_STABLE_DIFFUSION_ENDPOINT?: string };
}
