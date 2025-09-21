import prisma from "@/lib/connect";
import { NextResponse } from "next/server";

// Récupérer tous les artistes/membres uniques des posts
export const GET = async () => {
  try {
    // Récupérer tous les posts avec leurs équipes
    const posts = await prisma.post.findMany({
      select: {
        artist: true,
        team: true,
      },
    });

    // Extraire tous les artistes et membres d'équipe uniques
    const artistsSet = new Set<string>();
    
    posts.forEach(post => {
      // Ajouter l'artiste principal
      if (post.artist) {
        artistsSet.add(post.artist);
      }
      
      // Ajouter les membres d'équipe
      if (Array.isArray(post.team)) {
        post.team.forEach(member => {
          if (typeof member === 'string' && member.trim()) {
            artistsSet.add(member);
          }
        });
      }
    });

    // Convertir en tableau trié
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