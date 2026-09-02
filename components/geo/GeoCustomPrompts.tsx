"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Plus, Sparkles, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MAX_PROMPT_LENGTH } from "@/lib/geo/prompts";
import type { GeoMonitorClient, GeoPromptsResponse } from "@/lib/geo/types";

interface GeoCustomPromptsProps {
  client: GeoMonitorClient;
  activePrompts: string[];
  suggested: GeoPromptsResponse["suggested"];
  canAddMore: boolean;
  maxPrompts: number;
  onUpdated?: (options?: { rescanStarted?: boolean }) => void;
}

export function GeoCustomPrompts({
  client,
  activePrompts,
  suggested,
  canAddMore,
  maxPrompts,
  onUpdated,
}: GeoCustomPromptsProps) {
  const [prompt, setPrompt] = useState("");
  const [adding, setAdding] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [removingPrompt, setRemovingPrompt] = useState<string | null>(null);
  const [actionPrompt, setActionPrompt] = useState<string | null>(null);
  const [localSuggested, setLocalSuggested] = useState(suggested);

  useEffect(() => {
    setLocalSuggested(suggested);
  }, [suggested]);

  async function refreshFromApi(options?: { rescanStarted?: boolean }) {
    onUpdated?.(options);
  }

  async function handleAdd(event: React.FormEvent) {
    event.preventDefault();
    if (!prompt.trim()) return;

    setAdding(true);
    try {
      const res = await fetch(`/api/geo/prompts/${client.brandId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: client.viewToken,
          action: "add",
          prompt,
        }),
      });

      const data = (await res.json()) as GeoPromptsResponse & { error?: string };
      if (!res.ok) {
        throw new Error(data.error ?? "追加に失敗しました");
      }

      setPrompt("");
      setLocalSuggested(data.suggested);
      await refreshFromApi({ rescanStarted: data.rescanStarted });
      toast.success("プロンプトを追加しました。30〜60秒後に結果が更新されます");

      if (data.rescanStarted) {
        window.setTimeout(() => refreshFromApi(), 45000);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "追加に失敗しました");
    } finally {
      setAdding(false);
    }
  }

  async function handleRemove(target: string) {
    setRemovingPrompt(target);
    try {
      const res = await fetch(`/api/geo/prompts/${client.brandId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: client.viewToken,
          prompt: target,
        }),
      });

      const data = (await res.json()) as GeoPromptsResponse & { error?: string };
      if (!res.ok) {
        throw new Error(data.error ?? "削除に失敗しました");
      }

      setLocalSuggested(data.suggested);
      await refreshFromApi({ rescanStarted: data.rescanStarted });
      toast.success("プロンプトを削除しました");

      if (data.rescanStarted) {
        window.setTimeout(() => refreshFromApi(), 45000);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "削除に失敗しました");
    } finally {
      setRemovingPrompt(null);
    }
  }

  async function handleSuggestionAction(action: "track" | "reject", target: string) {
    setActionPrompt(target);
    try {
      const res = await fetch(`/api/geo/prompts/${client.brandId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: client.viewToken,
          action,
          prompt: target,
        }),
      });

      const data = (await res.json()) as GeoPromptsResponse & { error?: string };
      if (!res.ok) {
        throw new Error(data.error ?? "更新に失敗しました");
      }

      setLocalSuggested(data.suggested);
      await refreshFromApi({ rescanStarted: data.rescanStarted });
      toast.success(
        action === "track"
          ? "プロンプトを監視対象に追加しました。30〜60秒後に結果が更新されます"
          : "提案を除外しました",
      );

      if (action === "track" && data.rescanStarted) {
        window.setTimeout(() => refreshFromApi(), 45000);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "更新に失敗しました");
    } finally {
      setActionPrompt(null);
    }
  }

  const handleGenerate = useCallback(async () => {
    setGenerating(true);
    try {
      const res = await fetch(`/api/geo/prompts/${client.brandId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: client.viewToken,
          action: "generate",
        }),
      });

      const data = (await res.json()) as GeoPromptsResponse & { error?: string };
      if (!res.ok) {
        throw new Error(data.error ?? "AI提案の生成に失敗しました");
      }

      setLocalSuggested(data.suggested);
      toast.success("AI提案を生成しました");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "AI提案の生成に失敗しました");
    } finally {
      setGenerating(false);
    }
  }, [client.brandId, client.viewToken]);

  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-6 py-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="size-5 text-violet-600" />
              <h3 className="font-semibold text-slate-900">プロンプト設定</h3>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              監視 {activePrompts.length}/{maxPrompts}件 · AI提案または手動入力
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={generating}
            onClick={() => void handleGenerate()}
            className="border-violet-200 text-violet-700 hover:bg-violet-50"
          >
            {generating ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            AI提案を生成
          </Button>
        </div>
      </div>

      <div className="space-y-6 px-6 py-5">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            監視中
          </p>
          {activePrompts.length === 0 ? (
            <p className="rounded-lg bg-slate-50 px-3 py-3 text-sm text-slate-500">
              まだ監視プロンプトがありません。AI提案から Track するか、下のフォームから手動追加してください。
            </p>
          ) : (
            <ul className="space-y-2">
              {activePrompts.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 rounded-lg bg-violet-50 px-3 py-2 ring-1 ring-violet-100"
                >
                  <p className="min-w-0 flex-1 text-sm text-slate-800">{item}</p>
                  <button
                    type="button"
                    onClick={() => void handleRemove(item)}
                    disabled={removingPrompt === item}
                    aria-label="プロンプトを削除"
                    className="shrink-0 rounded-md p-1 text-slate-400 hover:bg-white hover:text-rose-600 disabled:opacity-50"
                  >
                    {removingPrompt === item ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="size-3.5" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {localSuggested.length > 0 ? (
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
              AI提案
            </p>
            <div className="space-y-3">
              {localSuggested.map((item) => {
                const isBusy = actionPrompt === item.prompt;

                return (
                  <div
                    key={item.id}
                    className="flex flex-wrap items-start justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50 px-4 py-3"
                  >
                    <p className="min-w-0 flex-1 text-sm text-slate-800">{item.prompt}</p>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        disabled={isBusy || !canAddMore}
                        onClick={() => void handleSuggestionAction("track", item.prompt)}
                        className="bg-violet-600 text-white hover:bg-violet-500"
                      >
                        {isBusy ? <Loader2 className="size-4 animate-spin" /> : "Track"}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={isBusy}
                        onClick={() => void handleSuggestionAction("reject", item.prompt)}
                      >
                        <X className="size-4" />
                        Reject
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-500">
            AI提案はまだありません。「AI提案を生成」を押すと、ブランド情報から監視候補を作成します。
          </p>
        )}

        <form
          onSubmit={(event) => void handleAdd(event)}
          className="rounded-xl border border-dashed border-violet-200 bg-violet-50/40 p-4"
        >
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">手動でプロンプトを追加</span>
            <Input
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="例：大阪でヒアルロン酸注入が評判のクリニックは？"
              maxLength={MAX_PROMPT_LENGTH}
              disabled={!canAddMore || adding}
            />
          </label>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-slate-500">
              {canAddMore
                ? "追加後、自動で再スキャンしてグラフへ反映します"
                : `プロンプトは最大${maxPrompts}件までです`}
            </p>
            <Button
              type="submit"
              disabled={!canAddMore || adding || !prompt.trim()}
              className="bg-violet-600 text-white hover:bg-violet-500"
            >
              {adding ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
              追加する
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
