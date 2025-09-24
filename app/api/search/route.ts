import prisma from "@/lib/connect";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  const url = new URL(req.url);
  const query = url.searchParams.get("query")?.toLowerCase() || "";

  if (!query.trim()) {
    return NextResponse.json([], { status: 200 });
  }

  try {
    const albums = await prisma.post.findMany({
      where: {
        title: {
          contains: query,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        title: true,
        slug: true,
      },
    });

    const artists = await prisma.post.findMany({
      where: {
        artist: {
          contains: query,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        artist: true,
        slug: true,
      },
    });

    const teams = await prisma.post.findMany({
      where: {
        team: {
          string_contains: query,
        },
      },
      select: {
        id: true,
        team: true,
        slug: true,
      },
    });

    const results = [
      ...albums.map((album) => ({
        id: album.id,
        title: album.title,
        type: "album",
        slug: album.slug,
      })),
      ...artists.map((artist) => ({
        id: artist.id,
        title: artist.artist,
        type: "artist",
        slug: artist.slug,
      })),
      ...teams.map((team) => ({
        id: team.id,
        title: team.team,
        type: "team",
        slug: team.slug,
      })),
    ];

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la recherche :", error);
    return NextResponse.json(
      { error: "Erreur lors de la recherche" },
      { status: 500 }
    );
  }
};
