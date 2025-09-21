import { PrismaClient } from "@prisma/client";
import fs from "fs";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres:Mathilde1909@localhost:5432/discophiles",
    },
  },
});

async function exportAllData() {
  console.log("📤 Export COMPLET de toutes les données...\n");

  try {
    // Exporter TOUTES les tables
    const users = await prisma.user.findMany();
    const accounts = await prisma.account.findMany();
    const sessions = await prisma.session.findMany();
    const verificationTokens = await prisma.verificationToken.findMany();
    const categories = await prisma.category.findMany();
    const posts = await prisma.post.findMany();
    const comments = await prisma.comment.findMany();
    const emails = await prisma.email.findMany();

    const exportData = {
      exportDate: new Date().toISOString(),
      stats: {
        users: users.length,
        accounts: accounts.length,
        sessions: sessions.length,
        verificationTokens: verificationTokens.length,
        categories: categories.length,
        posts: posts.length,
        comments: comments.length,
        emails: emails.length,
      },
      data: {
        users,
        accounts,
        sessions,
        verificationTokens,
        categories,
        posts,
        comments,
        emails,
      },
    };

    fs.writeFileSync(
      "complete-export.json",
      JSON.stringify(exportData, null, 2)
    );

    console.log("✅ Export COMPLET terminé !");
    console.log(`📊 Statistiques:`);
    console.log(`   - ${users.length} utilisateurs`);
    console.log(`   - ${accounts.length} comptes OAuth`);
    console.log(`   - ${sessions.length} sessions`);
    console.log(`   - ${verificationTokens.length} tokens de vérification`);
    console.log(`   - ${categories.length} catégories`);
    console.log(`   - ${posts.length} posts`);
    console.log(`   - ${comments.length} commentaires`);
    console.log(`   - ${emails.length} emails`);
    console.log(`\n💾 Données sauvegardées dans: complete-export.json`);
  } catch (error) {
    console.error("❌ Erreur lors de l'export:", error);
  } finally {
    await prisma.$disconnect();
  }
}

exportAllData();
