import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Morning You Setup",
};

export default function MorningSetupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 px-4 py-10">
      <div className="mx-auto max-w-2xl space-y-6 rounded-2xl border border-amber-100 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Morning You Setup</h1>
        <ol className="list-decimal space-y-4 pl-5 text-sm text-slate-700">
          <li>
            Create a <strong>Supabase</strong> project and run{" "}
            <code className="rounded bg-slate-100 px-1">supabase/morning-schema.sql</code> in the SQL
            Editor
          </li>
          <li>
            Create a <strong>Resend</strong> API key (and configure the sender email)
          </li>
          <li>
            Add environment variables to <code className="rounded bg-slate-100 px-1">.env.local</code>
          </li>
          <li>Add the same variables to Vercel and Redeploy</li>
        </ol>

        <pre className="overflow-x-auto rounded-xl bg-slate-950 p-4 text-xs text-slate-100">
{`SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
RESEND_API_KEY=re_...
MORNING_SESSION_SECRET=long-random-string
CRON_SECRET=another-random-string
MORNING_FROM_EMAIL=Morning You <notify@yourdomain.com>
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app`}
        </pre>

        <p className="text-sm text-slate-500">
          Use an external cron service (e.g. cron-job.org) to call{" "}
          <code>/api/cron/morning-send</code> every hour. Messages are sent once their delivery time
          has passed.
        </p>
      </div>
    </div>
  );
}
