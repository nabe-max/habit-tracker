export function getGeoConfig() {
  return {
    supabaseUrl: process.env.SUPABASE_URL ?? "",
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
    cronSecret: process.env.CRON_SECRET?.trim() ?? "",
  };
}

export function isGeoDbConfigured(): boolean {
  const config = getGeoConfig();
  return Boolean(config.supabaseUrl && config.supabaseServiceRoleKey);
}
