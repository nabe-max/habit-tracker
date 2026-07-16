export interface PostIdea {
  id: string;
  title: string;
  body: string;
  hashtags: string[];
}

export interface GenerateRequest {
  theme: string;
  target: string;
  tone: string;
  count: number;
  pastPosts?: string;
}

export interface GenerateResponseItem {
  title: string;
  body: string;
  hashtags: string[];
}

export const TARGETS = [
  "20代会社員",
  "学生",
  "フリーランス",
  "経営者",
  "主婦",
  "その他",
] as const;

export const TONES = [
  "砕けた",
  "真面目",
  "熱量高め",
  "親しみやすい",
  "プロフェッショナル",
] as const;

export const COUNT_MIN = 1;
export const COUNT_MAX = 30;

export type Target = (typeof TARGETS)[number];
export type Tone = (typeof TONES)[number];

export function isValidCount(count: number): boolean {
  return Number.isInteger(count) && count >= COUNT_MIN && count <= COUNT_MAX;
}

export const THEME_MAX_LENGTH = 50;
export const PAST_POSTS_MAX_LENGTH = 3000;
