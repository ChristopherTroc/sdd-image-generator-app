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
    description: "Hugging Face Inference API token (get one at https://huggingface.co/settings/tokens)",
  },
} as const;

const serverOptionalSchema = {
  HF_INFERENCE_ENDPOINT: {
    default: "https://api-inference.huggingface.co",
    description: "Custom endpoint for Hugging Face Inference API (optional)",
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
        `Missing required server environment variable: ${key}. ${config.description}`,
      );
    }
    env[key] = value;
  }

  return env as ServerEnv;
}

// Export validated environment
export const env = getEnv();

// Validate and get optional server-only environment variables
export function getServerOptionalEnv(): { HF_INFERENCE_ENDPOINT: string } {
  const result: Record<string, string> = {};

  for (const [key, config] of Object.entries(serverOptionalSchema)) {
    const value = process.env[key];
    result[key] = value || config.default;
  }

  return result as { HF_INFERENCE_ENDPOINT: string };
}
