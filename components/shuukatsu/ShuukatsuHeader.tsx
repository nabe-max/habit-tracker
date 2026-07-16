import { GraduationCap } from "lucide-react";

export function ShuukatsuHeader() {
  return (
    <header className="border-b border-sky-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center px-4 py-5 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-cyan-500 text-white shadow-md shadow-sky-200">
            <GraduationCap className="size-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-slate-800 sm:text-xl">
              企業研究AI
            </h1>
            <p className="text-sm text-slate-500">
              就活生のための企業分析ツール
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
