"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { SeamlessAmbientPlayer } from "@/lib/sleep/seamlessPlayer";
import { findSleepSound } from "@/lib/sleep/sounds";

export function useSleepAudio() {
  const playerRef = useRef<SeamlessAmbientPlayer | null>(null);
  const timerRef = useRef<number | null>(null);
  const endsAtRef = useRef<number | null>(null);

  const [activeSoundId, setActiveSoundId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.7);
  const [timerMinutes, setTimerMinutesState] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getPlayer = useCallback(() => {
    if (!playerRef.current) {
      playerRef.current = new SeamlessAmbientPlayer();
    }
    return playerRef.current;
  }, []);

  const clearSleepTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    endsAtRef.current = null;
    setRemainingSeconds(null);
  }, []);

  const stopPlayback = useCallback(async () => {
    await getPlayer().stop(true);
    setIsPlaying(false);
  }, [getPlayer]);

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

  const setVolume = useCallback(
    (value: number) => {
      const next = Math.min(1, Math.max(0, value));
      setVolumeState(next);
      getPlayer().setVolume(next);
    },
    [getPlayer],
  );

  const selectSound = useCallback(
    async (soundId: string) => {
      const sound = findSleepSound(soundId);
      if (!sound) return;

      setIsLoading(true);

      try {
        const player = getPlayer();
        if (isPlaying) {
          await player.stop(true);
        }

        await player.load(sound.src);
        player.setVolume(volume);
        await player.play();

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
    [getPlayer, isPlaying, startSleepTimer, timerMinutes, volume],
  );

  const togglePlayback = useCallback(async () => {
    if (!activeSoundId) return;

    if (isPlaying) {
      await stopPlayback();
      clearSleepTimer();
      return;
    }

    try {
      const player = getPlayer();
      player.setVolume(volume);
      await player.play();
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
    getPlayer,
    isPlaying,
    startSleepTimer,
    stopPlayback,
    timerMinutes,
    volume,
  ]);

  useEffect(() => {
    return () => {
      clearSleepTimer();
      playerRef.current?.destroy();
      playerRef.current = null;
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
