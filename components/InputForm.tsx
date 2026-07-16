"use client";

import { useState, type FormEvent } from "react";
import { Loader2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { GenerateRequest, Target, Tone } from "@/types/post";
import {
  TARGETS,
  TONES,
  COUNT_MIN,
  COUNT_MAX,
  isValidCount,
  THEME_MAX_LENGTH,
  PAST_POSTS_MAX_LENGTH,
} from "@/types/post";

interface InputFormProps {
  onSubmit: (params: GenerateRequest) => void;
  isLoading: boolean;
}

export function InputForm({ onSubmit, isLoading }: InputFormProps) {
  const [theme, setTheme] = useState("");
  const [target, setTarget] = useState<Target | "">("");
  const [tone, setTone] = useState<Tone | "">("");
  const [count, setCount] = useState(20);
  const [pastPosts, setPastPosts] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const validate = (): string | null => {
    if (!theme.trim()) return "テーマは必須です";
    if (theme.length > THEME_MAX_LENGTH) {
      return `テーマは${THEME_MAX_LENGTH}文字以内で入力してください`;
    }
    if (!target) return "ターゲットは必須です";
    if (!tone) return "トーンは必須です";
    if (!isValidCount(count)) {
      return `生成数は${COUNT_MIN}〜${COUNT_MAX}の整数で入力してください`;
    }
    if (pastPosts.length > PAST_POSTS_MAX_LENGTH) {
      return `過去投稿は${PAST_POSTS_MAX_LENGTH}文字以内で入力してください`;
    }
    return null;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const error = validate();
    if (error) {
      setValidationError(error);
      return;
    }
    setValidationError(null);
    onSubmit({
      theme: theme.trim(),
      target,
      tone,
      count,
      pastPosts: pastPosts.trim() || undefined,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-xl border bg-card p-6 shadow-sm sm:p-8"
    >
      <div className="space-y-2">
        <label htmlFor="theme" className="text-sm font-medium">
          テーマ <span className="text-destructive">*</span>
        </label>
        <Input
          id="theme"
          placeholder="例: 副業、AI、筋トレ、恋愛"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          maxLength={THEME_MAX_LENGTH}
          disabled={isLoading}
          aria-invalid={!!validationError && !theme.trim()}
        />
        <p className="text-xs text-muted-foreground">
          {theme.length}/{THEME_MAX_LENGTH} 文字
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="space-y-2">
          <label htmlFor="target" className="text-sm font-medium">
            ターゲット <span className="text-destructive">*</span>
          </label>
          <Select
            value={target}
            onValueChange={(v) => setTarget(v as Target)}
            disabled={isLoading}
          >
            <SelectTrigger id="target" className="w-full">
              <SelectValue placeholder="選択してください" />
            </SelectTrigger>
            <SelectContent>
              {TARGETS.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label htmlFor="tone" className="text-sm font-medium">
            トーン <span className="text-destructive">*</span>
          </label>
          <Select
            value={tone}
            onValueChange={(v) => setTone(v as Tone)}
            disabled={isLoading}
          >
            <SelectTrigger id="tone" className="w-full">
              <SelectValue placeholder="選択してください" />
            </SelectTrigger>
            <SelectContent>
              {TONES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label htmlFor="count" className="text-sm font-medium">
            生成数
          </label>
          <Input
            id="count"
            type="number"
            min={COUNT_MIN}
            max={COUNT_MAX}
            step={1}
            value={count}
            onChange={(e) => {
              const next = e.target.valueAsNumber;
              if (!Number.isNaN(next)) setCount(next);
            }}
            disabled={isLoading}
          />
          <p className="text-xs text-muted-foreground">
            {COUNT_MIN}〜{COUNT_MAX}件
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="pastPosts" className="text-sm font-medium">
          過去投稿{" "}
          <span className="font-normal text-muted-foreground">（任意）</span>
        </label>
        <Textarea
          id="pastPosts"
          placeholder="過去の投稿を貼り付けると、文体を学習して同じ型で生成します"
          value={pastPosts}
          onChange={(e) => setPastPosts(e.target.value)}
          maxLength={PAST_POSTS_MAX_LENGTH}
          rows={5}
          disabled={isLoading}
        />
        <p className="text-xs text-muted-foreground">
          {pastPosts.length}/{PAST_POSTS_MAX_LENGTH} 文字
        </p>
      </div>

      {validationError && (
        <p className="text-sm text-destructive" role="alert">
          {validationError}
        </p>
      )}

      <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            生成中...
          </>
        ) : (
          <>
            <Sparkles className="size-4" />
            投稿案を生成
          </>
        )}
      </Button>
    </form>
  );
}
