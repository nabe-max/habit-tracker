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
        throw new Error(data.error ?? "Failed to save message");
      }

      toast.success("Scheduled for tomorrow morning");
      onSaved();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save message");
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
        <h2 className="text-lg font-semibold text-slate-800">Tonight&apos;s note</h2>
        <p className="mt-1 text-sm text-slate-500">
          Arrives by email tomorrow at {String(user.morning_hour).padStart(2, "0")}:
          {String(user.morning_minute).padStart(2, "0")}
        </p>
      </div>

      <textarea
        value={body}
        onChange={(event) => setBody(event.target.value)}
        placeholder="e.g. One page today is enough. You don't have to be perfect."
        maxLength={500}
        rows={5}
        required
        className="w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
      />

      <div className="flex items-center justify-between gap-3 text-xs text-slate-500">
        <span>{body.length}/500</span>
        {nextDelivery ? <span>Scheduled: {nextDelivery}</span> : null}
      </div>

      <Button
        type="submit"
        disabled={loading || !body.trim()}
        className="w-full bg-amber-500 hover:bg-amber-600 text-white"
      >
        {loading ? <Loader2 className="size-4 animate-spin" /> : <SendHorizonal className="size-4" />}
        Send to tomorrow&apos;s me
      </Button>
    </form>
  );
}
