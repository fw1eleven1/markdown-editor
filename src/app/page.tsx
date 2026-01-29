import { connectDB } from "@/lib/mongodb";
import Post from "@/models/post";
import { HomeClient } from "@/components/home/home-client";
import { PostListItem } from "@/types/post";

export const revalidate = 86400; // 24시간 (초 단위)

async function getPosts(): Promise<PostListItem[]> {
  try {
    await connectDB();
    const posts = await Post.find()
      .sort({ updatedAt: -1 })
      .select("_id title createdAt updatedAt")
      .lean();

    return posts.map((post) => ({
      _id: post._id.toString(),
      title: post.title,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    }));
  } catch (error) {
    console.error("게시글 목록 조회 실패:", error);
    return [];
  }
}

export default async function HomePage() {
  const posts = await getPosts();

  return <HomeClient initialPosts={posts} />;
}
