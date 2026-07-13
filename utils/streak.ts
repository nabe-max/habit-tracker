import { addDays, parseDateKey, toDateKey } from "@/utils/dates";

export function calculateCurrentStreak(
  completions: string[],
  today: Date = new Date(),
): number {
  const completionSet = new Set(completions);
  let cursor = new Date(today);
  cursor.setHours(0, 0, 0, 0);

  if (!completionSet.has(toDateKey(cursor))) {
    cursor = addDays(cursor, -1);
  }

  let streak = 0;
  while (completionSet.has(toDateKey(cursor))) {
    streak++;
    cursor = addDays(cursor, -1);
  }

  return streak;
}

export function calculateBestStreak(completions: string[]): number {
  const uniqueDates = [...new Set(completions)].sort();
  if (uniqueDates.length === 0) return 0;
  if (uniqueDates.length === 1) return 1;

  let best = 1;
  let current = 1;

  for (let index = 1; index < uniqueDates.length; index++) {
    const previous = parseDateKey(uniqueDates[index - 1]);
    const currentDate = parseDateKey(uniqueDates[index]);
    const diffDays =
      (currentDate.getTime() - previous.getTime()) / (1000 * 60 * 60 * 24);

    if (diffDays === 1) {
      current++;
      best = Math.max(best, current);
    } else {
      current = 1;
    }
  }

  return best;
}
