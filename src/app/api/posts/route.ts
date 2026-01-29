import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/post";

export async function GET() {
  try {
    await connectDB();
    const posts = await Post.find()
      .sort({ updatedAt: -1 })
      .select("_id title createdAt updatedAt")
      .lean();

    return NextResponse.json(posts);
  } catch (error) {
    console.error("게시글 목록 조회 오류:", error);
    return NextResponse.json(
      { error: "게시글 목록을 불러오는데 실패했습니다" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    if (!body.title || !body.content) {
      return NextResponse.json(
        { error: "제목과 내용은 필수입니다" },
        { status: 400 }
      );
    }

    const post = await Post.create({
      title: body.title,
      content: body.content,
    });

    // 정적 페이지 갱신
    revalidatePath("/");

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("게시글 생성 오류:", error);
    return NextResponse.json(
      { error: "게시글 생성에 실패했습니다" },
      { status: 500 }
    );
  }
}
