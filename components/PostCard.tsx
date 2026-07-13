"use client";

import { useEffect, useState } from "react";
import { Bookmark, BookmarkCheck, Copy } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { PostIdea } from "@/types/post";
import { copyToClipboard, formatPostForCopy } from "@/utils/clipboard";
import { isPostSaved, savePost } from "@/utils/storage";

interface PostCardProps {
  post: PostIdea;
}

export function PostCard({ post }: PostCardProps) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isPostSaved(post.id));
  }, [post.id]);

  const handleCopy = async () => {
    const success = await copyToClipboard(formatPostForCopy(post));
    if (success) {
      toast.success("Copied!");
    } else {
      toast.error("コピーに失敗しました");
    }
  };

  const handleSave = () => {
    if (saved) return;
    savePost(post);
    setSaved(true);
    toast.success("保存しました");
  };

  return (
    <Card className="flex h-full flex-col transition-shadow hover:shadow-md">
      <CardHeader>
        <CardTitle className="text-base leading-snug">{post.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
          {post.body}
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {post.hashtags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
            >
              {tag}
            </span>
          ))}
        </div>
      </CardContent>
      <CardFooter className="gap-2 border-t pt-6">
        <Button variant="outline" size="sm" onClick={handleCopy}>
          <Copy className="size-3.5" />
          Copy
        </Button>
        <Button
          variant={saved ? "secondary" : "outline"}
          size="sm"
          onClick={handleSave}
          disabled={saved}
        >
          {saved ? (
            <BookmarkCheck className="size-3.5" />
          ) : (
            <Bookmark className="size-3.5" />
          )}
          {saved ? "Saved" : "Save"}
        </Button>
      </CardFooter>
    </Card>
  );
}
