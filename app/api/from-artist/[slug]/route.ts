import prisma from "@/lib/connect";
import { NextResponse } from "next/server";

// GET POSTS BY ARTIST NAME
export const GET = async (
  req: Request,
  context: { params: Promise<{ slug: string }> }
) => {
  const { slug } = await context.params;
  const artistName = decodeURIComponent(slug);

  try {
    // Rechercher les posts où l'artiste apparaît soit comme artiste principal, soit dans l'équipe
    const posts = await prisma.post.findMany({
      where: {
        OR: [
          {
            artist: {
              equals: artistName,
              mode: 'insensitive'
            }
          },
          {
            team: {
              array_contains: artistName
            }
          }
        ]
      },
      include: {
        User: true,
        Category: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des posts de l'artiste:", error);
    return NextResponse.json(
      { error: `Erreur lors de la récupération des posts de l'artiste: ${error}` },
      { status: 500 }
    );
  }
};