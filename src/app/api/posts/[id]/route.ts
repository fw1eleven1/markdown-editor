import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/post";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const post = await Post.findById(id).lean();

    if (!post) {
      return NextResponse.json(
        { error: "게시글을 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("게시글 조회 오류:", error);
    return NextResponse.json(
      { error: "게시글을 불러오는데 실패했습니다" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const post = await Post.findByIdAndUpdate(
      id,
      { title: body.title, content: body.content },
      { new: true, runValidators: true }
    ).lean();

    if (!post) {
      return NextResponse.json(
        { error: "게시글을 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    // 정적 페이지 갱신
    revalidatePath("/");
    revalidatePath(`/posts/${id}`);

    return NextResponse.json(post);
  } catch (error) {
    console.error("게시글 수정 오류:", error);
    return NextResponse.json(
      { error: "게시글 수정에 실패했습니다" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const post = await Post.findByIdAndDelete(id);

    if (!post) {
      return NextResponse.json(
        { error: "게시글을 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    // 정적 페이지 갱신
    revalidatePath("/");
    revalidatePath(`/posts/${id}`);

    return NextResponse.json({ message: "게시글이 삭제되었습니다" });
  } catch (error) {
    console.error("게시글 삭제 오류:", error);
    return NextResponse.json(
      { error: "게시글 삭제에 실패했습니다" },
      { status: 500 }
    );
  }
}
