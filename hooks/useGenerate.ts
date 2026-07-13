"use client";

import { useState, useCallback } from "react";
import type { PostIdea, GenerateRequest } from "@/types/post";

interface UseGenerateReturn {
  posts: PostIdea[];
  isLoading: boolean;
  error: string | null;
  generate: (params: GenerateRequest) => Promise<void>;
  reset: () => void;
}

export function useGenerate(): UseGenerateReturn {
  const [posts, setPosts] = useState<PostIdea[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async (params: GenerateRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      const data: unknown = await res.json();

      if (!res.ok) {
        const errorData = data as { error?: string };
        throw new Error(errorData.error ?? "生成に失敗しました");
      }

      if (!Array.isArray(data)) {
        throw new Error("応答形式が不正です");
      }

      const ideas: PostIdea[] = data.map((item: Omit<PostIdea, "id">) => ({
        ...item,
        id: crypto.randomUUID(),
      }));

      setPosts(ideas);
    } catch (err) {
      setPosts([]);
      setError(
        err instanceof Error ? err.message : "通信エラーが発生しました",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setPosts([]);
    setError(null);
  }, []);

  return { posts, isLoading, error, generate, reset };
}
