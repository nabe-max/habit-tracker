export interface MorningUser {
  id: string;
  email: string;
  timezone: string;
  morning_hour: number;
  morning_minute: number;
  created_at: string;
}

export interface MorningMessage {
  id: string;
  user_id: string;
  body: string;
  deliver_at: string;
  sent_at: string | null;
  created_at: string;
}

export interface MorningSession {
  userId: string;
  email: string;
}
