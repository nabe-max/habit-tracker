import type { PostIdea } from "@/types/post";

const STORAGE_KEY = "savedPosts";

export function getSavedPosts(): PostIdea[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PostIdea[]) : [];
  } catch {
    return [];
  }
}

export function savePost(post: PostIdea): void {
  const saved = getSavedPosts();
  if (saved.some((p) => p.id === post.id)) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...saved, post]));
}

export function removePost(id: string): void {
  const saved = getSavedPosts().filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
}

export function isPostSaved(id: string): boolean {
  return getSavedPosts().some((p) => p.id === id);
}
