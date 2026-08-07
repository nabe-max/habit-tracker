"use client";

import { useState } from "react";
import { Loader2, SendHorizonal } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { formatDeliveryLocal } from "@/lib/morning/schedule";
import type { MorningMessage, MorningUser } from "@/types/morning";

interface MorningMessageFormProps {
  user: MorningUser;
  pending: MorningMessage | null;
  onSaved: () => void;
}

export function MorningMessageForm({ user, pending, onSaved }: MorningMessageFormProps) {
  const [body, setBody] = useState(pending?.body ?? "");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/morning/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
      });
      const data = (await res.json()) as { error?: string; message?: MorningMessage };

      if (!res.ok) {
        throw new Error(data.error ?? "保存に失敗しました");
      }

      toast.success("明日の朝に届けます");
      onSaved();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "保存に失敗しました");
    } finally {
      setLoading(false);
    }
  }

  const nextDelivery = pending
    ? formatDeliveryLocal(pending.deliver_at, user.timezone)
    : null;

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-amber-100 bg-white p-6 shadow-sm"
    >
      <div>
        <h2 className="text-lg font-semibold text-slate-800">今夜の一言</h2>
        <p className="mt-1 text-sm text-slate-500">
          明日の朝 {String(user.morning_hour).padStart(2, "0")}:
          {String(user.morning_minute).padStart(2, "0")} にメールで届きます
        </p>
      </div>

      <textarea
        value={body}
        onChange={(event) => setBody(event.target.value)}
        placeholder="例：今日も1ページ進めれば十分。完璧じゃなくていい。"
        maxLength={500}
        rows={5}
        required
        className="w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
      />

      <div className="flex items-center justify-between gap-3 text-xs text-slate-500">
        <span>{body.length}/500</span>
        {nextDelivery ? <span>予約中：{nextDelivery}</span> : null}
      </div>

      <Button
        type="submit"
        disabled={loading || !body.trim()}
        className="w-full bg-amber-500 hover:bg-amber-600 text-white"
      >
        {loading ? <Loader2 className="size-4 animate-spin" /> : <SendHorizonal className="size-4" />}
        明日の自分に届ける
      </Button>
    </form>
  );
}
