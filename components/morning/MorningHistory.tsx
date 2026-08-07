import { formatDeliveryLocal } from "@/lib/morning/schedule";
import type { MorningMessage, MorningUser } from "@/types/morning";

interface MorningHistoryProps {
  user: MorningUser;
  history: MorningMessage[];
}

export function MorningHistory({ user, history }: MorningHistoryProps) {
  if (history.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white/70 p-6 text-sm text-slate-500">
        まだ履歴がありません。今夜の一言を登録してみてください。
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="font-semibold text-slate-800">これまでの一言</h2>
      <ul className="space-y-3">
        {history.map((message) => (
          <li
            key={message.id}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <p className="whitespace-pre-wrap text-slate-800">{message.body}</p>
            <p className="mt-2 text-xs text-slate-500">
              {message.sent_at
                ? `送信済み · ${formatDeliveryLocal(message.sent_at, user.timezone)}`
                : `予約 · ${formatDeliveryLocal(message.deliver_at, user.timezone)}`}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
