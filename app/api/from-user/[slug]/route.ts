import prisma from "@/lib/connect";
import { NextResponse } from "next/server";

// GET SINGLE POST
export const GET = async (
  req: Request,
  context: { params: Promise<{ slug: string }> }
) => {
  const { slug } = await context.params;

  try {
    const user = await prisma.user.findFirst({
      where: { name: slug },
    });
    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }
    const posts = await prisma.post.findMany({
      where: { userId: user.id },
    });
    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `something went wrong !, ${error}` },
      { status: 500 }
    );
  }
};
