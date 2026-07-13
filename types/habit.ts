export const HABIT_COLORS = [
  { id: "emerald", label: "グリーン", dot: "bg-emerald-500", soft: "bg-emerald-500/10 text-emerald-700" },
  { id: "blue", label: "ブルー", dot: "bg-blue-500", soft: "bg-blue-500/10 text-blue-700" },
  { id: "violet", label: "パープル", dot: "bg-violet-500", soft: "bg-violet-500/10 text-violet-700" },
  { id: "orange", label: "オレンジ", dot: "bg-orange-500", soft: "bg-orange-500/10 text-orange-700" },
  { id: "rose", label: "ピンク", dot: "bg-rose-500", soft: "bg-rose-500/10 text-rose-700" },
  { id: "amber", label: "イエロー", dot: "bg-amber-500", soft: "bg-amber-500/10 text-amber-700" },
] as const;

export type HabitColorId = (typeof HABIT_COLORS)[number]["id"];

export interface Habit {
  id: string;
  name: string;
  color: HabitColorId;
  createdAt: string;
  completions: string[];
}

export const HABIT_NAME_MAX_LENGTH = 30;
export const MAX_HABITS = 20;
