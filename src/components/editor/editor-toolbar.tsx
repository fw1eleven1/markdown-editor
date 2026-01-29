"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Save, Edit, Trash2, X, Share2, Check, ExternalLink } from "lucide-react";
import Link from "next/link";

interface EditorToolbarProps {
  postId?: string;
  isNew: boolean;
  isEditing: boolean;
  isSaving: boolean;
  onSave: () => void;
  onEdit: () => void;
  onUpdate: () => void;
  onDelete: () => void;
  onCancelEdit: () => void;
}

export function EditorToolbar({
  postId,
  isNew,
  isEditing,
  isSaving,
  onSave,
  onEdit,
  onUpdate,
  onDelete,
  onCancelEdit,
}: EditorToolbarProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (!postId) return;
    const url = `${window.location.origin}/posts/${postId}`;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("URL 복사에 실패했습니다: " + url);
    }
  };

  if (isNew) {
    return (
      <div className="p-4 border-t flex gap-2 justify-end">
        <Button onClick={onSave} disabled={isSaving}>
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? "저장 중..." : "저장"}
        </Button>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="p-4 border-t flex gap-2 justify-end">
        <Button variant="outline" onClick={onCancelEdit} disabled={isSaving}>
          <X className="w-4 h-4 mr-2" />
          취소
        </Button>
        <Button onClick={onUpdate} disabled={isSaving}>
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? "저장 중..." : "저장"}
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 border-t flex gap-2 justify-between">
      <div className="flex gap-2">
        {postId && (
          <>
            <Button variant="outline" onClick={handleShare}>
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  복사됨
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 mr-2" />
                  공유
                </>
              )}
            </Button>
            <Link href={`/posts/${postId}`} target="_blank">
              <Button variant="outline">
                <ExternalLink className="w-4 h-4 mr-2" />
                새 탭에서 보기
              </Button>
            </Link>
          </>
        )}
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onEdit}>
          <Edit className="w-4 h-4 mr-2" />
          수정
        </Button>
        <Button variant="destructive" onClick={onDelete}>
          <Trash2 className="w-4 h-4 mr-2" />
          삭제
        </Button>
      </div>
    </div>
  );
}
