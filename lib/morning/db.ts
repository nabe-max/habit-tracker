import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { getMorningConfig, isMorningConfigured } from "@/lib/morning/env";
import type { MorningMessage, MorningUser } from "@/types/morning";

let client: SupabaseClient | null = null;

export function getMorningDb(): SupabaseClient {
  if (!isMorningConfigured()) {
    throw new Error("Morning You is not configured");
  }

  if (!client) {
    const config = getMorningConfig();
    client = createClient(config.supabaseUrl, config.supabaseServiceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  return client;
}

export async function findUserByEmail(email: string): Promise<MorningUser | null> {
  const db = getMorningDb();
  const { data, error } = await db
    .from("morning_users")
    .select("*")
    .eq("email", email)
    .maybeSingle();

  if (error) throw error;
  return data as MorningUser | null;
}

export async function upsertUser(email: string): Promise<MorningUser> {
  const db = getMorningDb();
  const existing = await findUserByEmail(email);
  if (existing) return existing;

  const { data, error } = await db
    .from("morning_users")
    .insert({ email })
    .select("*")
    .single();

  if (error) throw error;
  return data as MorningUser;
}

export async function getUserById(id: string): Promise<MorningUser | null> {
  const db = getMorningDb();
  const { data, error } = await db.from("morning_users").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data as MorningUser | null;
}

export async function updateUserSettings(
  userId: string,
  settings: Pick<MorningUser, "timezone" | "morning_hour" | "morning_minute">,
): Promise<MorningUser> {
  const db = getMorningDb();
  const { data, error } = await db
    .from("morning_users")
    .update(settings)
    .eq("id", userId)
    .select("*")
    .single();

  if (error) throw error;
  return data as MorningUser;
}

export async function createAuthToken(email: string, token: string, expiresAt: Date): Promise<void> {
  const db = getMorningDb();
  const { error } = await db.from("morning_auth_tokens").insert({
    token,
    email,
    expires_at: expiresAt.toISOString(),
  });
  if (error) throw error;
}

export async function consumeAuthToken(token: string): Promise<string | null> {
  const db = getMorningDb();
  const { data, error } = await db
    .from("morning_auth_tokens")
    .select("email, expires_at")
    .eq("token", token)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  if (new Date(data.expires_at) < new Date()) {
    await db.from("morning_auth_tokens").delete().eq("token", token);
    return null;
  }

  await db.from("morning_auth_tokens").delete().eq("token", token);
  return data.email as string;
}

export async function getPendingMessage(userId: string): Promise<MorningMessage | null> {
  const db = getMorningDb();
  const { data, error } = await db
    .from("morning_messages")
    .select("*")
    .eq("user_id", userId)
    .is("sent_at", null)
    .order("deliver_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data as MorningMessage | null;
}

export async function upsertPendingMessage(
  userId: string,
  body: string,
  deliverAt: Date,
): Promise<MorningMessage> {
  const db = getMorningDb();
  const pending = await getPendingMessage(userId);

  if (pending) {
    const { data, error } = await db
      .from("morning_messages")
      .update({ body, deliver_at: deliverAt.toISOString() })
      .eq("id", pending.id)
      .select("*")
      .single();
    if (error) throw error;
    return data as MorningMessage;
  }

  const { data, error } = await db
    .from("morning_messages")
    .insert({
      user_id: userId,
      body,
      deliver_at: deliverAt.toISOString(),
    })
    .select("*")
    .single();

  if (error) throw error;
  return data as MorningMessage;
}

export async function listMessages(userId: string, limit = 20): Promise<MorningMessage[]> {
  const db = getMorningDb();
  const { data, error } = await db
    .from("morning_messages")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as MorningMessage[];
}

export async function listDueMessages(now = new Date()): Promise<
  Array<MorningMessage & { morning_users: MorningUser }>
> {
  const db = getMorningDb();
  const { data, error } = await db
    .from("morning_messages")
    .select("*, morning_users(*)")
    .is("sent_at", null)
    .lte("deliver_at", now.toISOString())
    .limit(100);

  if (error) throw error;
  return (data ?? []) as Array<MorningMessage & { morning_users: MorningUser }>;
}

export async function markMessageSent(messageId: string): Promise<void> {
  const db = getMorningDb();
  const { error } = await db
    .from("morning_messages")
    .update({ sent_at: new Date().toISOString() })
    .eq("id", messageId);
  if (error) throw error;
}
