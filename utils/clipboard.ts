import type { PostIdea } from "@/types/post";

export function formatPostForCopy(post: PostIdea): string {
  const tags = post.hashtags.join(" ");
  return `${post.title}\n\n${post.body}\n\n${tags}`;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
