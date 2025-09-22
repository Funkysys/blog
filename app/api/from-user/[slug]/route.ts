import prisma from "@/lib/connect";
import { NextResponse } from "next/server";

const slugToUserName = (slug: string): string => {
  return slug
    .split("-")
    .map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join(" ");
};

// GET SINGLE POST
export const GET = async (
  req: Request,
  context: { params: Promise<{ slug: string }> }
) => {
  const { slug } = await context.params;
  const decodedSlug = decodeURIComponent(slug);
  const userName = slugToUserName(decodedSlug);

  try {
    const posts = await prisma.post.findMany({
      where: {
        userName: {
          equals: userName,
          mode: "insensitive",
        },
      },
      include: {
        User: true,
        Category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des posts de l'utilisateur:",
      error
    );
    return NextResponse.json(
      {
        error: `Erreur lors de la récupération des posts de l'utilisateur: ${error}`,
      },
      { status: 500 }
    );
  }
};
