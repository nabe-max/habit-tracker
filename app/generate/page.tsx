"use client";

import { AlertCircle } from "lucide-react";

import { Header } from "@/components/Header";
import { InputForm } from "@/components/InputForm";
import { Loading } from "@/components/Loading";
import { PostCard } from "@/components/PostCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useGenerate } from "@/hooks/useGenerate";

export default function GeneratePage() {
  const { posts, isLoading, error, generate } = useGenerate();

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-6xl space-y-10 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <section>
          <InputForm onSubmit={generate} isLoading={isLoading} />
        </section>

        {error && (
          <Alert variant="destructive">
            <AlertCircle />
            <AlertTitle>エラーが発生しました</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isLoading && <Loading count={6} />}

        {!isLoading && posts.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                生成結果（{posts.length}件）
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
