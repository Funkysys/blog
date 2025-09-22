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

export const GET = async (
  req: Request,
  context: { params: Promise<{ slug: string }> }
) => {
  const { slug } = await context.params;
  const decodedSlug = decodeURIComponent(slug);
  const userName = slugToUserName(decodedSlug);

  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "12");
  const skip = (page - 1) * limit;

  try {
    const totalCount = await prisma.post.count({
      where: {
        User: {
          name: {
            equals: userName,
            mode: "insensitive",
          },
        },
      },
    });

    const posts = await prisma.post.findMany({
      where: {
        User: {
          name: {
            equals: userName,
            mode: "insensitive",
          },
        },
      },
      include: {
        User: true,
        Category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: skip,
      take: limit,
    });

    return NextResponse.json(
      {
        posts,
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
      },
      { status: 200 }
    );
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

