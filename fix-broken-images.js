import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Mapping des images par slug de post
const imageMapping = {
  ole: "/img/genres/jazz.jpg", // John Coltrane - Olé
  "songs-of-freedom": "/img/genres/jazz-fusion.jpg", // Nguyên Lê - Songs of Freedom
  "peace-beyond-passion": "/img/genres/soul-rb.jpg", // Meshell Ndegéocello - Peace Beyond Passion
  songbook: "/img/genres/jazz.jpg", // Kenny Garrett - SongBook
  "leaving-space": "/img/genres/new-jazz.jpg", // Duology eXperiment - Leaving Space
  xenophonia: "/img/genres/jazz.jpg", // Bojan Z - Xenophonia
  "essais-volume-5": "/img/genres/jazz.jpg", // Pierre de Bethmann - Essais Volume 5
  "drums-unlimited": "/img/genres/jazz.jpg", // Max Roach - Drums Unlimited
};

async function fixBrokenImages() {
  console.log("🔧 Correction des images cassées...\n");

  try {
    // Récupérer tous les posts avec leurs images
    const posts = await prisma.post.findMany({
      select: {
        id: true,
        slug: true,
        title: true,
        image: true,
      },
    });

    console.log(`📋 ${posts.length} posts trouvés\n`);

    let fixedCount = 0;

    for (const post of posts) {
      // Vérifier si l'image est une URL Vercel Blob Storage cassée
      if (post.image && post.image.includes("blob.vercel-storage.com")) {
        console.log(`🔍 Post cassé: "${post.title}" (${post.slug})`);
        console.log(`   Image cassée: ${post.image}`);

        // Trouver l'image de remplacement
        const newImage = imageMapping[post.slug] || "/img/disque.jpg";
        console.log(`   ➡️  Nouvelle image: ${newImage}`);

        // Mettre à jour en base
        await prisma.post.update({
          where: { id: post.id },
          data: { image: newImage },
        });

        fixedCount++;
        console.log(`   ✅ Corrigé!\n`);
      } else {
        console.log(
          `✅ Post OK: "${post.title}" - ${post.image || "Pas d'image"}`
        );
      }
    }

    console.log(`\n🎉 TERMINÉ!`);
    console.log(`📊 ${fixedCount} images corrigées sur ${posts.length} posts`);
  } catch (error) {
    console.error("❌ Erreur:", error);
  } finally {
    await prisma.$disconnect();
  }
}

fixBrokenImages();
