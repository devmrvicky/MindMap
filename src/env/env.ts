import { z } from "zod/v4";

export const EnvSchema = z.object({
  VITE_NODE_ENV: z.enum(["development", "production", "test"]),
  VITE_INDEXDB_NAME: z.enum(["LLM_CHATS_DB", "MODELS"]).default("LLM_CHATS_DB"),
  VITE_FREE_CHAT_ROOMS_LIMIT: z.number().default(5),
  VITE_OPENROUTER_BASE_URL: z
    .string()
    .url()
    .default("https://openrouter.ai/api/v1"),
  VITE_SERVER_ENDPOINT: z.string(),
  VITE_APP_NAME: z.string(),
});

/**
 * Creates an Env object from the import.meta.env object.
 *
 * @remarks
 * This function will throw an error if the environment variables are invalid.
 * @returns An Env object
 */
const createEnv = () => {
  const parsed = EnvSchema.safeParse(import.meta.env);
  if (!parsed.success) {
    console.error("❌ Invalid environment variables:", parsed.error.format());
    throw new Error("Invalid environment variables");
  }
  return parsed.data;
};

export const env = createEnv();

export type Env = z.infer<typeof EnvSchema>;
