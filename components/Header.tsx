import { GraduationCap } from "lucide-react";
import Link from "next/link";

export function Header() {
  return (
    <header className="border-b bg-card/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-5 sm:px-6">
        <Link href="/shuukatsu" className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-cyan-500 text-white">
            <GraduationCap className="size-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight sm:text-xl">
              企業研究AI
            </h1>
            <p className="text-sm text-muted-foreground">
              就活生のための企業分析ツール
            </p>
          </div>
        </Link>
      </div>
    </header>
  );
}
