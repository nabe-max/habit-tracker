import { BookOpen, MessageSquare, Sparkles } from "lucide-react";

const FEATURES = [
  {
    icon: BookOpen,
    label: "企業研究",
    color: "bg-sky-100 text-sky-700",
  },
  {
    icon: MessageSquare,
    label: "面接対策",
    color: "bg-violet-100 text-violet-700",
  },
  {
    icon: Sparkles,
    label: "志望動機",
    color: "bg-amber-100 text-amber-700",
  },
] as const;

export function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-sky-100 bg-white/80 px-6 py-8 shadow-lg shadow-sky-100/50 sm:px-8">
      <div className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-sky-200/40 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-6 size-28 rounded-full bg-amber-200/40 blur-2xl" />

      <div className="relative space-y-5">
        <div className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-700">
          <span>🎓</span>
          就活生のための企業研究AI
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
            会社名とURLを入れるだけ。
            <br />
            <span className="bg-gradient-to-r from-sky-600 to-cyan-500 bg-clip-text text-transparent">
              企業研究が3分で終わる。
            </span>
          </h2>
          <p className="max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
            事業内容・強み・就活ポイント・面接のヒント・志望動機のたたき台まで、AIがまとめてくれます。
            <span className="mt-1 block text-sky-700">
              無料プラン：月3回まで利用できます。
            </span>
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {FEATURES.map(({ icon: Icon, label, color }) => (
            <span
              key={label}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${color}`}
            >
              <Icon className="size-3.5" />
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
