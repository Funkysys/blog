import prisma from "@/lib/connect";
import { NextResponse } from "next/server";

const slugToArtistName = (slug: string): string => {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// GET POSTS BY ARTIST NAME
export const GET = async (
  req: Request,
  context: { params: Promise<{ slug: string }> }
) => {
  const { slug } = await context.params;
  const decodedSlug = decodeURIComponent(slug);
  const artistName = slugToArtistName(decodedSlug);

  try {
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
              path: [],
              array_contains: artistName
            }
          },
          {
            team: {
              path: [],
              string_contains: artistName
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