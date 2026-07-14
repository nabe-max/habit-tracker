import { Flame, ListChecks, Target } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

interface StatsBarProps {
  total: number;
  completedToday: number;
  bestStreak: number;
}

export function StatsBar({ total, completedToday, bestStreak }: StatsBarProps) {
  const items = [
    {
      label: "登録した副業習慣",
      value: `${total}件`,
      icon: Target,
    },
    {
      label: "今日の達成",
      value: total > 0 ? `${completedToday}/${total}` : "0/0",
      icon: ListChecks,
    },
    {
      label: "最長ストリーク",
      value: `${bestStreak}日`,
      icon: Flame,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {items.map((item) => (
        <Card key={item.label}>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <item.icon className="size-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="text-lg font-semibold">{item.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
