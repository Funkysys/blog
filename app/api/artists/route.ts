import prisma from "@/lib/connect";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const posts = await prisma.post.findMany({
      select: {
        artist: true,
        team: true,
      },
    });

    const artistsSet = new Set<string>();
    
    posts.forEach(post => {
      if (post.artist) {
        artistsSet.add(post.artist);
      }
      
      if (Array.isArray(post.team)) {
        post.team.forEach(member => {
          if (typeof member === 'string' && member.trim()) {
            artistsSet.add(member);
          }
        });
      }
    });

    const artists = Array.from(artistsSet).sort();

    return NextResponse.json(artists, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des artistes:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des artistes" },
      { status: 500 }
    );
  }
};