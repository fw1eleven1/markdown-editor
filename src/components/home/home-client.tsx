"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { MarkdownEditor } from "@/components/editor/markdown-editor";
import { Post, PostListItem } from "@/types/post";

interface HomeClientProps {
  initialPosts: PostListItem[];
}

export function HomeClient({ initialPosts }: HomeClientProps) {
  const router = useRouter();
  const [posts, setPosts] = useState<PostListItem[]>(initialPosts);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isNewPost, setIsNewPost] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/posts");
      const data = await res.json();
      setPosts(data);
      router.refresh();
    } catch (error) {
      console.error("새로고침 실패:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, [router]);

  const handleNewPost = () => {
    setSelectedPost(null);
    setIsNewPost(true);
  };

  const handleSelectPost = async (postId: string) => {
    try {
      const res = await fetch(`/api/posts/${postId}`);
      const fullPost = await res.json();
      setSelectedPost(fullPost);
      setIsNewPost(false);
    } catch (error) {
      console.error("게시글 조회 실패:", error);
    }
  };

  const handleSave = async (title: string, content: string) => {
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });
    const newPost = await res.json();
    setSelectedPost(newPost);
    setIsNewPost(false);
    await handleRefresh();
  };

  const handleUpdate = async (id: string, title: string, content: string) => {
    const res = await fetch(`/api/posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });
    const updatedPost = await res.json();
    setSelectedPost(updatedPost);
    await handleRefresh();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/posts/${id}`, { method: "DELETE" });
    setSelectedPost(null);
    setIsNewPost(false);
    await handleRefresh();
  };

  return (
    <div className="flex h-screen">
      <Sidebar
        posts={posts}
        selectedPostId={selectedPost?._id || null}
        onSelectPost={handleSelectPost}
        onNewPost={handleNewPost}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />
      <MarkdownEditor
        key={selectedPost?._id || (isNewPost ? "new" : "empty")}
        post={selectedPost}
        isNew={isNewPost}
        onSave={handleSave}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  );
}
