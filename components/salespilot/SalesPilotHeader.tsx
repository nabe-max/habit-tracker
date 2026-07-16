import { Rocket } from "lucide-react";
import Link from "next/link";

export function SalesPilotHeader() {
  return (
    <header className="border-b bg-card/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-5 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Rocket className="size-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight sm:text-xl">
              SalesPilot AI
            </h1>
            <p className="text-sm text-muted-foreground">
              Web制作営業をAIで効率化
            </p>
          </div>
        </div>
        <nav className="flex items-center gap-3 text-sm">
          <Link
            href="/"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            習慣トラッカー
          </Link>
          <Link
            href="/generate"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            SNS生成
          </Link>
        </nav>
      </div>
    </header>
  );
}
