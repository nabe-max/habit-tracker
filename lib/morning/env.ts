export function getMorningConfig() {
  return {
    supabaseUrl: process.env.SUPABASE_URL ?? "",
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
    resendApiKey: process.env.RESEND_API_KEY ?? "",
    sessionSecret: process.env.MORNING_SESSION_SECRET ?? "",
    cronSecret: process.env.CRON_SECRET ?? "",
    fromEmail: process.env.MORNING_FROM_EMAIL ?? "Morning You <onboarding@resend.dev>",
    appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  };
}

export function isMorningConfigured(): boolean {
  const config = getMorningConfig();
  return Boolean(
    config.supabaseUrl &&
      config.supabaseServiceRoleKey &&
      config.resendApiKey &&
      config.sessionSecret,
  );
}
