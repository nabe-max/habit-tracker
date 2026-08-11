"use client";

import { useState } from "react";
import { Loader2, Mail, Sun } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MorningLoginFormProps {
  onSuccess?: () => void;
}

export function MorningLoginForm({ onSuccess }: MorningLoginFormProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/morning/auth/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json()) as { error?: string };

      if (!res.ok) {
        throw new Error(data.error ?? "Failed to send login link");
      }

      setSent(true);
      toast.success("Login link sent");
      onSuccess?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to send login link");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="rounded-2xl border border-amber-100 bg-white p-6 text-center shadow-sm">
        <Mail className="mx-auto size-10 text-amber-500" />
        <h2 className="mt-4 text-lg font-semibold text-slate-800">Check your email</h2>
        <p className="mt-2 text-sm text-slate-600">
          We sent a login link to <span className="font-medium text-slate-800">{email}</span>.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-amber-100 bg-white p-6 shadow-sm"
    >
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white">
          <Sun className="size-5" />
        </div>
        <div>
          <h2 className="font-semibold text-slate-800">Sign in with email</h2>
          <p className="text-sm text-slate-500">Your note will arrive here tomorrow morning</p>
        </div>
      </div>
      <Input
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="you@example.com"
        required
        className="border-amber-100"
      />
      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-amber-500 hover:bg-amber-600 text-white"
      >
        {loading ? <Loader2 className="size-4 animate-spin" /> : null}
        Send login link
      </Button>
    </form>
  );
}
