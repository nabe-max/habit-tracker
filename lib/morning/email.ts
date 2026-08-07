import { Resend } from "resend";

import { getMorningConfig } from "@/lib/morning/env";
import { formatDeliveryLocal } from "@/lib/morning/schedule";

function getResend() {
  const apiKey = getMorningConfig().resendApiKey;
  if (!apiKey) throw new Error("RESEND_API_KEY is not set");
  return new Resend(apiKey);
}

export async function sendLoginEmail(email: string, loginUrl: string): Promise<void> {
  const { fromEmail } = getMorningConfig();
  const resend = getResend();

  const { error } = await resend.emails.send({
    from: fromEmail,
    to: email,
    subject: "Morning You — ログインリンク",
    html: `
      <div style="font-family:sans-serif;line-height:1.6;color:#1e293b;max-width:480px">
        <p>Morning You にログインするには、下のボタンを押してください。</p>
        <p style="margin:24px 0">
          <a href="${loginUrl}" style="background:#4f46e5;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;display:inline-block">
            ログインする
          </a>
        </p>
        <p style="font-size:13px;color:#64748b">このリンクは15分間有効です。</p>
      </div>
    `,
  });

  if (error) throw error;
}

export async function sendMorningMotivationEmail(params: {
  to: string;
  body: string;
  timezone: string;
  deliverAt: string;
}): Promise<void> {
  const { fromEmail } = getMorningConfig();
  const resend = getResend();
  const when = formatDeliveryLocal(params.deliverAt, params.timezone);

  const { error } = await resend.emails.send({
    from: fromEmail,
    to: params.to,
    subject: "昨日のあなたから 🌅",
    html: `
      <div style="font-family:sans-serif;line-height:1.7;color:#1e293b;max-width:520px">
        <p style="font-size:14px;color:#64748b;margin:0 0 8px">Morning You · ${when}</p>
        <h1 style="font-size:20px;margin:0 0 16px">おはよう。</h1>
        <p>昨日のあなたが、今日のあなたに残した言葉：</p>
        <blockquote style="margin:20px 0;padding:16px 20px;background:#f5f3ff;border-left:4px solid #7c3aed;border-radius:8px;font-size:18px">
          ${escapeHtml(params.body)}
        </blockquote>
        <p style="font-size:13px;color:#64748b">今夜も一言残す → ${getMorningConfig().appUrl}/morning</p>
      </div>
    `,
  });

  if (error) throw error;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
