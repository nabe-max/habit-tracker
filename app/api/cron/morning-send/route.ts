import { NextRequest, NextResponse } from "next/server";

import { isCronAuthorized } from "@/lib/cron-auth";
import { listDueMessages, markMessageSent } from "@/lib/morning/db";
import { sendMorningMotivationEmail } from "@/lib/morning/email";
import { getMorningConfig, isMorningConfigured } from "@/lib/morning/env";

export async function GET(req: NextRequest) {
  if (!isMorningConfigured()) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  const cronSecret = getMorningConfig().cronSecret.trim();
  if (!isCronAuthorized(req, cronSecret)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const due = await listDueMessages();
    let sent = 0;

    for (const row of due) {
      const user = row.morning_users;
      if (!user?.email) continue;

      await sendMorningMotivationEmail({
        to: user.email,
        body: row.body,
        timezone: user.timezone,
        deliverAt: row.deliver_at,
      });
      await markMessageSent(row.id);
      sent += 1;
    }

    return NextResponse.json({ ok: true, sent, checked: due.length });
  } catch (error) {
    console.error("[GET /api/cron/morning-send]", error);
    return NextResponse.json({ error: "Cron failed" }, { status: 500 });
  }
}
