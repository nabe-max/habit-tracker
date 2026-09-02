"use client";

import { useState } from "react";
import { Loader2, Plus, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MAX_PROMPT_LENGTH } from "@/lib/geo/prompts";
import type { GeoMonitorClient, GeoPromptsResponse } from "@/lib/geo/types";

interface GeoCustomPromptsProps {
  client: GeoMonitorClient;
  defaultPrompts: string[];
  customPrompts: string[];
  canAddMore: boolean;
  maxCustomPrompts: number;
  manualOnly?: boolean;
  onUpdated?: (options?: { rescanStarted?: boolean }) => void;
}

export function GeoCustomPrompts({
  client,
  defaultPrompts,
  customPrompts,
  canAddMore,
  maxCustomPrompts,
  manualOnly = false,
  onUpdated,
}: GeoCustomPromptsProps) {
  const [prompt, setPrompt] = useState("");
  const [adding, setAdding] = useState(false);
  const [removingPrompt, setRemovingPrompt] = useState<string | null>(null);

  const totalPrompts = manualOnly ? customPrompts.length : defaultPrompts.length + customPrompts.length;

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
          prompt,
        }),
      });

      const data = (await res.json()) as GeoPromptsResponse & { error?: string };
      if (!res.ok) {
        throw new Error(data.error ?? "追加に失敗しました");
      }

      setPrompt("");
      onUpdated?.({ rescanStarted: data.rescanStarted });
      toast.success("プロンプトを追加しました。30〜60秒後に結果が更新されます");

      if (data.rescanStarted) {
        window.setTimeout(() => onUpdated?.(), 45000);
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

      onUpdated?.({ rescanStarted: data.rescanStarted });
      toast.success("プロンプトを削除しました");

      if (data.rescanStarted) {
        window.setTimeout(() => onUpdated?.(), 45000);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "削除に失敗しました");
    } finally {
      setRemovingPrompt(null);
    }
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-6 py-4">
        <div className="flex items-center gap-2">
          <Sparkles className="size-5 text-violet-600" />
          <h3 className="font-semibold text-slate-900">プロンプト設定</h3>
        </div>
        <p className="mt-1 text-sm text-slate-500">
          {manualOnly
            ? `手動設定 ${customPrompts.length}/${maxCustomPrompts}件`
            : `標準 ${defaultPrompts.length}件 + カスタム ${customPrompts.length}/${maxCustomPrompts}件（計 ${totalPrompts}件）`}
        </p>
      </div>

      <div className="space-y-6 px-6 py-5">
        {!manualOnly ? (
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              標準プロンプト（自動）
            </p>
            <ul className="space-y-2">
              {defaultPrompts.map((item) => (
                <li
                  key={item}
                  className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700 ring-1 ring-slate-100"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            {manualOnly ? "監視プロンプト" : "カスタムプロンプト"}
          </p>
          {customPrompts.length === 0 ? (
            <p className="rounded-lg bg-slate-50 px-3 py-3 text-sm text-slate-500">
              {manualOnly
                ? "まだプロンプトがありません。下のフォームから追加してください。"
                : "まだ追加されていません。下のフォームから監視したい質問を追加できます。"}
            </p>
          ) : (
            <ul className="space-y-2">
              {customPrompts.map((item) => (
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

        <form onSubmit={(event) => void handleAdd(event)} className="rounded-xl border border-dashed border-violet-200 bg-violet-50/40 p-4">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">
              {manualOnly ? "監視プロンプトを追加" : "独自プロンプトを追加"}
            </span>
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
                : `プロンプトは最大${maxCustomPrompts}件までです`}
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
