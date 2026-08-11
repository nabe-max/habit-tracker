"use client";

import { useState } from "react";
import { Clock3, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { MorningUser } from "@/types/morning";

interface MorningSettingsFormProps {
  user: MorningUser;
  onUpdated: () => void;
}

export function MorningSettingsForm({ user, onUpdated }: MorningSettingsFormProps) {
  const [hour, setHour] = useState(String(user.morning_hour).padStart(2, "0"));
  const [minute, setMinute] = useState(String(user.morning_minute).padStart(2, "0"));
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);

    const morningHour = Number(hour);
    const morningMinute = Number(minute);

    try {
      const res = await fetch("/api/morning/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          timezone: user.timezone,
          morning_hour: morningHour,
          morning_minute: morningMinute,
        }),
      });
      const data = (await res.json()) as { error?: string };

      if (!res.ok) {
        throw new Error(data.error ?? "Failed to update settings");
      }

      toast.success("Delivery time updated");
      onUpdated();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update settings");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="flex items-center gap-2 text-slate-800">
        <Clock3 className="size-4" />
        <h2 className="font-semibold">Delivery time</h2>
      </div>
      <div className="flex items-center gap-2">
        <Input
          type="number"
          min={0}
          max={23}
          value={hour}
          onChange={(event) => setHour(event.target.value)}
          className="w-20"
        />
        <span>:</span>
        <Input
          type="number"
          min={0}
          max={59}
          value={minute}
          onChange={(event) => setMinute(event.target.value)}
          className="w-20"
        />
        <span className="text-sm text-slate-500">({user.timezone})</span>
      </div>
      <Button type="submit" disabled={loading} variant="outline">
        {loading ? <Loader2 className="size-4 animate-spin" /> : null}
        Save time
      </Button>
    </form>
  );
}
