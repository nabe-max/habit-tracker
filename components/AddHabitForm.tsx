"use client";

import { useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  HABIT_COLORS,
  HABIT_NAME_MAX_LENGTH,
  type HabitColorId,
} from "@/types/habit";
import { cn } from "@/lib/utils";

interface AddHabitFormProps {
  onAdd: (name: string, color: HabitColorId) => boolean;
  disabled?: boolean;
}

export function AddHabitForm({ onAdd, disabled }: AddHabitFormProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState<HabitColorId>("emerald");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const success = onAdd(name, color);
    if (success) {
      setName("");
      toast.success("習慣を追加しました");
      return;
    }

    if (!name.trim()) {
      toast.error("習慣名を入力してください");
      return;
    }

    toast.error("習慣の上限に達しました");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl border bg-card p-6 shadow-sm"
    >
      <div>
        <h2 className="text-base font-semibold">新しい習慣を追加</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          毎日続けたいことを登録しましょう
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1 space-y-2">
          <label htmlFor="habit-name" className="text-sm font-medium">
            習慣名
          </label>
          <Input
            id="habit-name"
            placeholder="例: 朝ランニング、英語15分"
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={HABIT_NAME_MAX_LENGTH}
            disabled={disabled}
          />
        </div>

        <div className="space-y-2">
          <span className="text-sm font-medium">カラー</span>
          <div className="flex gap-2">
            {HABIT_COLORS.map((option) => (
              <button
                key={option.id}
                type="button"
                aria-label={option.label}
                disabled={disabled}
                onClick={() => setColor(option.id)}
                className={cn(
                  "size-8 rounded-full transition-transform hover:scale-105",
                  option.dot,
                  color === option.id &&
                    "ring-2 ring-offset-2 ring-foreground/30",
                )}
              />
            ))}
          </div>
        </div>
      </div>

      <Button type="submit" disabled={disabled}>
        <Plus className="size-4" />
        習慣を追加
      </Button>
    </form>
  );
}
