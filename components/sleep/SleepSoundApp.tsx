"use client";

import {
  CloudRain,
  Flame,
  Loader2,
  Moon,
  Pause,
  Play,
  Timer,
  TreePine,
  Volume2,
  Waves,
  Wind,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useSleepAudio } from "@/hooks/useSleepAudio";
import { SLEEP_SOUNDS, SLEEP_TIMER_OPTIONS } from "@/lib/sleep/sounds";
import { cn } from "@/lib/utils";

const SOUND_ICONS: Record<string, LucideIcon> = {
  river: Waves,
  wind: Wind,
  rain: CloudRain,
  ocean: Waves,
  forest: TreePine,
  fire: Flame,
  night: Moon,
};

function formatRemaining(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${String(secs).padStart(2, "0")}`;
}

export function SleepSoundApp() {
  const {
    activeSoundId,
    isPlaying,
    isLoading,
    volume,
    timerMinutes,
    remainingSeconds,
    selectSound,
    togglePlayback,
    setVolume,
    setTimerMinutes,
  } = useSleepAudio();

  const activeSound = SLEEP_SOUNDS.find((sound) => sound.id === activeSoundId);

  return (
    <div className="space-y-8">
      <section className="grid gap-3 sm:grid-cols-2">
        {SLEEP_SOUNDS.map((sound) => {
          const Icon = SOUND_ICONS[sound.id] ?? Waves;
          const isActive = activeSoundId === sound.id;

          return (
            <button
              key={sound.id}
              type="button"
              onClick={() => selectSound(sound.id)}
              className={cn(
                "group relative overflow-hidden rounded-2xl border p-5 text-left transition-all",
                "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10",
                isActive && "border-indigo-400/50 bg-indigo-500/10 ring-1 ring-indigo-400/30",
              )}
            >
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity group-hover:opacity-100",
                  sound.accent,
                  isActive && "opacity-100",
                )}
              />
              <div className="relative flex items-start gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-indigo-200">
                  <Icon className="size-5" />
                </div>
                <div>
                  <p className="font-semibold text-white">{sound.name}</p>
                  <p className="mt-1 text-sm text-slate-400">{sound.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-400">再生中</p>
            <p className="text-xl font-semibold text-white">
              {activeSound ? activeSound.name : "音を選んでください"}
            </p>
          </div>

          <Button
            type="button"
            size="lg"
            disabled={!activeSoundId || isLoading}
            onClick={() => void togglePlayback()}
            className="min-w-32 bg-indigo-500 hover:bg-indigo-400 text-white"
          >
            {isLoading ? (
              <Loader2 className="size-5 animate-spin" />
            ) : isPlaying ? (
              <>
                <Pause className="size-5" />
                一時停止
              </>
            ) : (
              <>
                <Play className="size-5" />
                再生
              </>
            )}
          </Button>
        </div>

        <div className="mt-6 space-y-5">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-slate-400">
              <Volume2 className="size-4" />
              音量
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(volume * 100)}
              onChange={(event) => setVolume(Number(event.target.value) / 100)}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-indigo-400"
            />
          </div>

          <div>
            <div className="mb-3 flex items-center gap-2 text-sm text-slate-400">
              <Timer className="size-4" />
              スリープタイマー
              {remainingSeconds !== null ? (
                <span className="ml-auto font-mono text-indigo-300">
                  {formatRemaining(remainingSeconds)}
                </span>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-2">
              {SLEEP_TIMER_OPTIONS.map((option) => (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => setTimerMinutes(option.minutes)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-sm transition-colors",
                    timerMinutes === option.minutes
                      ? "border-indigo-400/60 bg-indigo-500/20 text-indigo-100"
                      : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-slate-200",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <p className="text-center text-xs text-slate-500">
        環境音は途切れずループします。スリープタイマーで自動停止もできます。
      </p>
    </div>
  );
}
