"use client";

import { Target } from "lucide-react";

import { AddHabitForm } from "@/components/AddHabitForm";
import { HabitCard } from "@/components/HabitCard";
import { Header } from "@/components/Header";
import { StatsBar } from "@/components/StatsBar";
import { Skeleton } from "@/components/ui/skeleton";
import { useHabits } from "@/hooks/useHabits";

export default function HomePage() {
  const {
    habits,
    isReady,
    todayKey,
    stats,
    addHabit,
    removeHabit,
    toggleToday,
    isCompletedToday,
  } = useHabits();

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-3xl space-y-8 px-4 py-8 sm:px-6 sm:py-12">
        {!isReady ? (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : (
          <>
            <StatsBar
              total={stats.total}
              completedToday={stats.completedToday}
              bestStreak={stats.bestStreak}
            />

            <AddHabitForm onAdd={addHabit} />

            <section className="space-y-4">
              <div>
                <h2 className="text-base font-semibold">今日の副業習慣</h2>
                <p className="text-sm text-muted-foreground">
                  本業後の1時間、今日も達成したらチェック
                </p>
              </div>

              {habits.length === 0 ? (
                <div className="rounded-xl border border-dashed bg-card/50 px-6 py-12 text-center">
                  <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Target className="size-6" />
                  </div>
                  <p className="mt-4 font-medium">まだ副業習慣がありません</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    「副業1時間」など、最初の習慣を追加してみましょう
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {habits.map((habit) => (
                    <HabitCard
                      key={habit.id}
                      habit={habit}
                      todayKey={todayKey}
                      isCompletedToday={isCompletedToday(habit)}
                      onToggleToday={() => toggleToday(habit.id)}
                      onRemove={() => removeHabit(habit.id)}
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
