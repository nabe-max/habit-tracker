import { formatOpenAIError } from "@/lib/openai";

export function formatGeoServiceError(error: unknown): string {
  if (error && typeof error === "object") {
    const message =
      "message" in error && typeof error.message === "string" ? error.message : null;

    if (message) {
      if (message.includes("custom_prompts")) {
        return "DBに custom_prompts 列がありません。Supabase SQL Editor で geo-schema-custom-prompts.sql を実行してください。";
      }
      if (message.includes("geo_prompt_suggestions")) {
        return "DBに geo_prompt_suggestions テーブルがありません。Supabase SQL Editor で geo-schema-prompt-suggestions.sql を実行してください。";
      }
      return message;
    }
  }

  return formatOpenAIError(error);
}
