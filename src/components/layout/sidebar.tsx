"use client";

import { PostListItem } from "@/types/post";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  posts: PostListItem[];
  selectedPostId: string | null;
  onSelectPost: (postId: string) => void;
  onNewPost: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export function Sidebar({
  posts,
  selectedPostId,
  onSelectPost,
  onNewPost,
  onRefresh,
  isRefreshing,
}: SidebarProps) {
  return (
    <aside className="w-64 h-screen border-r bg-gray-50 flex flex-col">
      <div className="p-4 border-b space-y-2">
        <Button onClick={onNewPost} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          새 글 작성
        </Button>
        <Button
          variant="outline"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="w-full"
        >
          <RefreshCw
            className={cn("w-4 h-4 mr-2", isRefreshing && "animate-spin")}
          />
          {isRefreshing ? "새로고침 중..." : "새로고침"}
        </Button>
      </div>
      <nav className="flex-1 overflow-y-auto p-2">
        {posts.length === 0 ? (
          <p className="text-center text-gray-500 text-sm py-4">
            작성된 글이 없습니다
          </p>
        ) : (
          posts.map((post) => (
            <button
              key={post._id}
              onClick={() => onSelectPost(post._id)}
              className={cn(
                "w-full text-left p-3 rounded-lg mb-1 hover:bg-gray-200 transition-colors",
                selectedPostId === post._id && "bg-gray-200"
              )}
            >
              <h3 className="font-medium truncate">
                {post.title || "제목 없음"}
              </h3>
              <p className="text-xs text-gray-500">
                {new Date(post.updatedAt).toLocaleDateString("ko-KR")}
              </p>
            </button>
          ))
        )}
      </nav>
    </aside>
  );
}
