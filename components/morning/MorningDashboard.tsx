"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, LogOut, Sun } from "lucide-react";
import { toast } from "sonner";

import { MorningHistory } from "@/components/morning/MorningHistory";
import { MorningLoginForm } from "@/components/morning/MorningLoginForm";
import { MorningMessageForm } from "@/components/morning/MorningMessageForm";
import { MorningSettingsForm } from "@/components/morning/MorningSettingsForm";
import { Button } from "@/components/ui/button";
import type { MorningMessage, MorningUser } from "@/types/morning";

interface DashboardData {
  user: MorningUser;
  pending: MorningMessage | null;
  history: MorningMessage[];
}

export function MorningDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/morning/me");
      if (res.status === 401) {
        setAuthed(false);
        setData(null);
        return;
      }
      if (!res.ok) {
        throw new Error("Failed to load");
      }
      const json = (await res.json()) as DashboardData;
      setData(json);
      setAuthed(true);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleLogout() {
    await fetch("/api/morning/auth/logout", { method: "POST" });
    setAuthed(false);
    setData(null);
    toast.success("Signed out");
  }

  if (loading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center text-slate-500">
        <Loader2 className="size-6 animate-spin" />
      </div>
    );
  }

  if (!authed || !data) {
    return <MorningLoginForm />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-100 bg-white px-5 py-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white">
            <Sun className="size-5" />
          </div>
          <div>
            <p className="font-semibold text-slate-800">{data.user.email}</p>
            <p className="text-sm text-slate-500">Last night&apos;s you → This morning&apos;s email</p>
          </div>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={handleLogout}>
          <LogOut className="size-4" />
          Sign out
        </Button>
      </div>

      <MorningMessageForm user={data.user} pending={data.pending} onSaved={load} />
      <MorningSettingsForm user={data.user} onUpdated={load} />
      <MorningHistory user={data.user} history={data.history} />
    </div>
  );
}
