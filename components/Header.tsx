import { Target } from "lucide-react";

export function Header() {
  return (
    <header className="border-b bg-card/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-5 sm:px-6">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Target className="size-5" />
        </div>
        <div>
          <h1 className="text-lg font-semibold tracking-tight sm:text-xl">
            副業習慣トラッカー
          </h1>
          <p className="text-sm text-muted-foreground">
            本業後の1時間を、習慣にする。
          </p>
        </div>
      </div>
    </header>
  );
}
