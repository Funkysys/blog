import prisma from "@/lib/connect";
import { NextResponse } from "next/server";

// GET SINGLE POST
export const GET = async (
  req: Request,
  { params }: { params: { slug: string } }
) => {
  const { slug } = params;

  try {
    const posts = await prisma.post.findMany({
      where: { userName: slug },
    });

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `something went wrong !, ${error}` },
      { status: 500 }
    );
  }
};
