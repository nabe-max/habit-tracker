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
        No history yet. Try leaving tonight&apos;s note.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="font-semibold text-slate-800">Past notes</h2>
      <ul className="space-y-3">
        {history.map((message) => (
          <li
            key={message.id}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <p className="whitespace-pre-wrap text-slate-800">{message.body}</p>
            <p className="mt-2 text-xs text-slate-500">
              {message.sent_at
                ? `Sent · ${formatDeliveryLocal(message.sent_at, user.timezone)}`
                : `Scheduled · ${formatDeliveryLocal(message.deliver_at, user.timezone)}`}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
