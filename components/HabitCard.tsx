"use client";

import { HABIT_COLORS, type Habit } from "@/types/habit";
import { getWeekDateKeys, WEEKDAY_LABELS } from "@/utils/dates";
import { calculateCurrentStreak } from "@/utils/streak";
import { cn } from "@/lib/utils";

interface WeekDotsProps {
  habit: Habit;
  todayKey: string;
  dotClass: string;
}

export function WeekDots({ habit, todayKey, dotClass }: WeekDotsProps) {
  const weekDates = getWeekDateKeys(new Date());
  const completionSet = new Set(habit.completions);

  return (
    <div className="grid grid-cols-7 gap-2">
      {weekDates.map((dateKey, index) => {
        const isCompleted = completionSet.has(dateKey);
        const isToday = dateKey === todayKey;

        return (
          <div key={dateKey} className="flex flex-col items-center gap-1.5">
            <span className="text-[10px] font-medium text-muted-foreground">
              {WEEKDAY_LABELS[index]}
            </span>
            <span
              className={cn(
                "size-3 rounded-full border-2 transition-colors",
                isCompleted ? cn("border-transparent", dotClass) : "border-muted-foreground/30 bg-transparent",
                isToday && !isCompleted && "border-primary/50",
                isToday && isCompleted && "ring-2 ring-offset-1 ring-primary/30",
              )}
            />
          </div>
        );
      })}
    </div>
  );
}

interface HabitCardProps {
  habit: Habit;
  todayKey: string;
  isCompletedToday: boolean;
  onToggleToday: () => void;
  onRemove: () => void;
}

export function HabitCard({
  habit,
  todayKey,
  isCompletedToday,
  onToggleToday,
  onRemove,
}: HabitCardProps) {
  const color = HABIT_COLORS.find((option) => option.id === habit.color);
  const streak = calculateCurrentStreak(habit.completions, parseToday(todayKey));

  return (
    <article className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
                color?.soft,
              )}
            >
              {habit.name}
            </span>
            {streak > 0 && (
              <span className="text-xs text-muted-foreground">
                🔥 {streak}日連続
              </span>
            )}
          </div>

          <WeekDots
            habit={habit}
            todayKey={todayKey}
            dotClass={color?.dot ?? "bg-emerald-500"}
          />
        </div>

        <div className="flex shrink-0 flex-col items-center gap-2">
          <button
            type="button"
            onClick={onToggleToday}
            aria-label={isCompletedToday ? "今日の記録を解除" : "今日完了にする"}
            className={cn(
              "flex size-12 items-center justify-center rounded-full border-2 text-lg font-semibold transition-all",
              isCompletedToday
                ? cn(color?.dot, "border-transparent text-white")
                : "border-border bg-background text-muted-foreground hover:border-primary/40",
            )}
          >
            {isCompletedToday ? "✓" : ""}
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="text-xs text-muted-foreground transition-colors hover:text-destructive"
          >
            削除
          </button>
        </div>
      </div>
    </article>
  );
}

function parseToday(todayKey: string): Date {
  const [year, month, day] = todayKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}
