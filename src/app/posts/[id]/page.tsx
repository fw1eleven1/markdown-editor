import { notFound } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/post";
import { PostView } from "@/components/post/post-view";

export const revalidate = 86400; // 24시간 (초 단위)

interface PostPageProps {
  params: Promise<{ id: string }>;
}

async function getPost(id: string) {
  try {
    await connectDB();
    const post = await Post.findById(id).lean();
    if (!post) return null;

    return {
      _id: post._id.toString(),
      title: post.title,
      content: post.content,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PostPageProps) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) {
    return { title: "글을 찾을 수 없습니다" };
  }

  return {
    title: `${post.title} | Markdown Editor`,
    description: post.content.slice(0, 160),
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) {
    notFound();
  }

  return <PostView post={post} />;
}
