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

// Type for validated environment variables
export type Env = {
  [K in keyof typeof envSchema]: string;
};

// Validate and get environment variables
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

// Export validated environment
export const env = getEnv();
