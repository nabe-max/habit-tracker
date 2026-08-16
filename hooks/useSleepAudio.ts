"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { findSleepSound } from "@/lib/sleep/sounds";

const FADE_MS = 2000;

function fadeVolume(
  audio: HTMLAudioElement,
  from: number,
  to: number,
  durationMs: number,
): Promise<void> {
  return new Promise((resolve) => {
    const start = performance.now();

    function step(now: number) {
      const progress = Math.min((now - start) / durationMs, 1);
      audio.volume = from + (to - from) * progress;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        resolve();
      }
    }

    requestAnimationFrame(step);
  });
}

export function useSleepAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<number | null>(null);
  const endsAtRef = useRef<number | null>(null);

  const [activeSoundId, setActiveSoundId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.7);
  const [timerMinutes, setTimerMinutesState] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const clearSleepTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    endsAtRef.current = null;
    setRemainingSeconds(null);
  }, []);

  const stopPlayback = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) {
      setIsPlaying(false);
      return;
    }

    if (!audio.paused) {
      await fadeVolume(audio, audio.volume, 0, FADE_MS);
      audio.pause();
    }

    setIsPlaying(false);
  }, []);

  const startSleepTimer = useCallback(
    (minutes: number) => {
      clearSleepTimer();
      if (minutes <= 0) return;

      endsAtRef.current = Date.now() + minutes * 60 * 1000;
      setRemainingSeconds(minutes * 60);

      timerRef.current = window.setInterval(() => {
        if (endsAtRef.current === null) return;
        const left = Math.max(0, Math.ceil((endsAtRef.current - Date.now()) / 1000));
        setRemainingSeconds(left > 0 ? left : null);

        if (left <= 0) {
          clearSleepTimer();
          void stopPlayback();
        }
      }, 1000);
    },
    [clearSleepTimer, stopPlayback],
  );

  const setTimerMinutes = useCallback(
    (minutes: number) => {
      setTimerMinutesState(minutes);
      if (isPlaying && minutes > 0) {
        startSleepTimer(minutes);
      } else {
        clearSleepTimer();
      }
    },
    [clearSleepTimer, isPlaying, startSleepTimer],
  );

  const setVolume = useCallback((value: number) => {
    const next = Math.min(1, Math.max(0, value));
    setVolumeState(next);
    if (audioRef.current) {
      audioRef.current.volume = next;
    }
  }, []);

  const selectSound = useCallback(
    async (soundId: string) => {
      const sound = findSleepSound(soundId);
      if (!sound) return;

      setIsLoading(true);

      try {
        if (audioRef.current) {
          await fadeVolume(audioRef.current, audioRef.current.volume, 0, 600);
          audioRef.current.pause();
        }

        const audio = new Audio(sound.src);
        audio.loop = true;
        audio.volume = 0;
        audioRef.current = audio;

        await audio.play();
        await fadeVolume(audio, 0, volume, FADE_MS);

        setActiveSoundId(soundId);
        setIsPlaying(true);

        if (timerMinutes > 0) {
          startSleepTimer(timerMinutes);
        }
      } catch {
        setIsPlaying(false);
        setActiveSoundId(null);
      } finally {
        setIsLoading(false);
      }
    },
    [startSleepTimer, timerMinutes, volume],
  );

  const togglePlayback = useCallback(async () => {
    if (!activeSoundId) return;

    const audio = audioRef.current;
    if (!audio) {
      await selectSound(activeSoundId);
      return;
    }

    if (isPlaying) {
      await stopPlayback();
      clearSleepTimer();
      return;
    }

    try {
      audio.volume = 0;
      await audio.play();
      await fadeVolume(audio, 0, volume, FADE_MS);
      setIsPlaying(true);
      if (timerMinutes > 0) {
        startSleepTimer(timerMinutes);
      }
    } catch {
      setIsPlaying(false);
    }
  }, [
    activeSoundId,
    clearSleepTimer,
    isPlaying,
    selectSound,
    startSleepTimer,
    stopPlayback,
    timerMinutes,
    volume,
  ]);

  useEffect(() => {
    return () => {
      clearSleepTimer();
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, [clearSleepTimer]);

  return {
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
  };
}
