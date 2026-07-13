"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Habit, HabitColorId } from "@/types/habit";
import { MAX_HABITS } from "@/types/habit";
import { toDateKey } from "@/utils/dates";
import { loadHabits, saveHabits } from "@/utils/habitStorage";
import {
  calculateBestStreak,
  calculateCurrentStreak,
} from "@/utils/streak";

interface UseHabitsReturn {
  habits: Habit[];
  isReady: boolean;
  todayKey: string;
  stats: {
    total: number;
    completedToday: number;
    bestStreak: number;
  };
  addHabit: (name: string, color: HabitColorId) => boolean;
  removeHabit: (id: string) => void;
  toggleToday: (id: string) => void;
  isCompletedToday: (habit: Habit) => boolean;
}

export function useHabits(): UseHabitsReturn {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isReady, setIsReady] = useState(false);
  const todayKey = toDateKey(new Date());

  useEffect(() => {
    setHabits(loadHabits());
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (isReady) {
      saveHabits(habits);
    }
  }, [habits, isReady]);

  const addHabit = useCallback((name: string, color: HabitColorId) => {
    const trimmed = name.trim();
    if (!trimmed) return false;

    let added = false;
    setHabits((current) => {
      if (current.length >= MAX_HABITS) return current;

      added = true;
      const habit: Habit = {
        id: crypto.randomUUID(),
        name: trimmed,
        color,
        createdAt: new Date().toISOString(),
        completions: [],
      };
      return [...current, habit];
    });
    return added;
  }, []);

  const removeHabit = useCallback((id: string) => {
    setHabits((current) => current.filter((habit) => habit.id !== id));
  }, []);

  const toggleToday = useCallback((id: string) => {
    setHabits((current) =>
      current.map((habit) => {
        if (habit.id !== id) return habit;

        const hasToday = habit.completions.includes(todayKey);
        return {
          ...habit,
          completions: hasToday
            ? habit.completions.filter((date) => date !== todayKey)
            : [...habit.completions, todayKey],
        };
      }),
    );
  }, [todayKey]);

  const isCompletedToday = useCallback(
    (habit: Habit) => habit.completions.includes(todayKey),
    [todayKey],
  );

  const stats = useMemo(() => {
    const completedToday = habits.filter((habit) =>
      habit.completions.includes(todayKey),
    ).length;

    const bestStreak = habits.reduce((max, habit) => {
      const current = calculateCurrentStreak(habit.completions);
      const best = calculateBestStreak(habit.completions);
      return Math.max(max, current, best);
    }, 0);

    return {
      total: habits.length,
      completedToday,
      bestStreak,
    };
  }, [habits, todayKey]);

  return {
    habits,
    isReady,
    todayKey,
    stats,
    addHabit,
    removeHabit,
    toggleToday,
    isCompletedToday,
  };
}
