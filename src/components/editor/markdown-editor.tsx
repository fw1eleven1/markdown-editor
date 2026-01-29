"use client";

import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { MarkdownPreview } from "./markdown-preview";
import { EditorToolbar } from "./editor-toolbar";
import { Post } from "@/types/post";

interface MarkdownEditorProps {
  post: Post | null;
  isNew: boolean;
  onSave: (title: string, content: string) => Promise<void>;
  onUpdate: (id: string, title: string, content: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function MarkdownEditor({
  post,
  isNew,
  onSave,
  onUpdate,
  onDelete,
}: MarkdownEditorProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      setIsEditing(false);
    } else if (isNew) {
      setTitle("");
      setContent("");
      setIsEditing(true);
    }
  }, [post, isNew]);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력해주세요");
      return;
    }
    setIsSaving(true);
    try {
      await onSave(title, content);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdate = async () => {
    if (!post) return;
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력해주세요");
      return;
    }
    setIsSaving(true);
    try {
      await onUpdate(post._id, title, content);
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!post) return;
    if (!confirm("정말 삭제하시겠습니까?")) return;
    await onDelete(post._id);
  };

  const handleCancelEdit = () => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
    }
    setIsEditing(false);
  };

  const canEdit = isNew || isEditing;

  if (!isNew && !post) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        글을 선택하거나 새 글을 작성해주세요
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen">
      <div className="p-4 border-b">
        <Input
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={!canEdit}
          className="text-xl font-bold border-0 shadow-none focus-visible:ring-0 px-0"
        />
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-1/2 p-4 border-r overflow-hidden">
          <Textarea
            placeholder="마크다운으로 작성하세요..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={!canEdit}
            className="h-full resize-none font-mono text-sm"
          />
        </div>

        <div className="w-1/2 p-4 overflow-y-auto">
          <MarkdownPreview content={content} />
        </div>
      </div>

      <EditorToolbar
        postId={post?._id}
        isNew={isNew}
        isEditing={isEditing}
        isSaving={isSaving}
        onSave={handleSave}
        onEdit={() => setIsEditing(true)}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        onCancelEdit={handleCancelEdit}
      />
    </div>
  );
}
