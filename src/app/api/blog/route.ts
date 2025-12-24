import { NextResponse } from "next/server";
import { getAllPosts, getRecentPosts } from "@/lib/blog";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    
    let posts;
    if (limit) {
      posts = await getRecentPosts(parseInt(limit));
    } else {
      posts = await getAllPosts();
    }
    
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 }
    );
  }
}