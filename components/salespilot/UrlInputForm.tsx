"use client";

import { Loader2, Radar, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface UrlInputFormProps {
  isLoading: boolean;
  onSubmit: (url: string, companyName?: string) => void;
}

export function UrlInputForm({ isLoading, onSubmit }: UrlInputFormProps) {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const url = String(form.get("url") ?? "");
    const companyName = String(form.get("companyName") ?? "").trim();
    onSubmit(url, companyName || undefined);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Radar className="size-5" />
          </div>
          <div>
            <CardTitle>営業先URL入力</CardTitle>
            <CardDescription>
              URLを入力すると、サイトを解析して診断します
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="url" className="text-sm font-medium">
              営業先URL
            </label>
            <Input
              id="url"
              name="url"
              type="text"
              placeholder="https://example.com"
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="companyName" className="text-sm font-medium">
              会社名（任意）
            </label>
            <Input
              id="companyName"
              name="companyName"
              type="text"
              placeholder="株式会社〇〇"
              disabled={isLoading}
            />
          </div>
          <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                解析中...
              </>
            ) : (
              <>
                <Sparkles className="size-4" />
                サイトを診断する
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
