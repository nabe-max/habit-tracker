"use client";

import { Loader2, Search, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CompanyInputFormProps {
  isLoading: boolean;
  onSubmit: (companyName: string, url: string, keywords?: string) => void;
}

export function CompanyInputForm({
  isLoading,
  onSubmit,
}: CompanyInputFormProps) {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const companyName = String(form.get("companyName") ?? "").trim();
    const url = String(form.get("url") ?? "").trim();
    const keywords = String(form.get("keywords") ?? "").trim();
    onSubmit(companyName, url, keywords || undefined);
  }

  return (
    <Card className="border-sky-100 bg-white/90 shadow-lg shadow-sky-100/40">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
            <Search className="size-5" />
          </div>
          <div>
            <CardTitle className="text-slate-800">企業を入力</CardTitle>
            <CardDescription className="text-slate-500">
              会社名と公式サイトURLを入れると、AIが企業研究を自動でまとめます
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="companyName" className="text-sm font-medium text-slate-700">
              会社名 <span className="text-rose-500">*</span>
            </label>
            <Input
              id="companyName"
              name="companyName"
              type="text"
              placeholder="例: 株式会社サイバーエージェント"
              required
              disabled={isLoading}
              className="border-sky-100 bg-sky-50/30 focus-visible:ring-sky-300"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="url" className="text-sm font-medium text-slate-700">
              公式サイトURL <span className="text-rose-500">*</span>
            </label>
            <Input
              id="url"
              name="url"
              type="text"
              placeholder="https://www.example.co.jp"
              required
              disabled={isLoading}
              className="border-sky-100 bg-sky-50/30 focus-visible:ring-sky-300"
            />
            <p className="text-xs text-slate-500">
              公式サイトを解析して、正確な企業研究を行います
            </p>
          </div>
          <div className="space-y-2 rounded-2xl border border-violet-100 bg-violet-50/40 p-4">
            <label htmlFor="keywords" className="text-sm font-medium text-slate-700">
              詳細検索キーワード{" "}
              <span className="font-normal text-slate-500">（任意）</span>
            </label>
            <Input
              id="keywords"
              name="keywords"
              type="text"
              placeholder="例: 福利厚生, リモートワーク, 新卒採用"
              disabled={isLoading}
              className="border-violet-100 bg-white focus-visible:ring-violet-300"
            />
            <p className="text-xs text-slate-500">
              気になるキーワードを入れると、その企業の関連情報もまとめて表示します
            </p>
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-md shadow-sky-200 hover:from-sky-600 hover:to-cyan-600 sm:w-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                分析中...
              </>
            ) : (
              <>
                <Sparkles className="size-4" />
                企業を分析する
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
