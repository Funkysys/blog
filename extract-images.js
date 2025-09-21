import fs from "fs";

// Lire le fichier de backup
const backupContent = fs.readFileSync(
  "db_cluster-23-02-2025@13-21-10.backup",
  "utf8"
);

// Rechercher toutes les URLs d'images
const imageUrls = [];
const lines = backupContent.split("\n");

console.log("🔍 Extraction des URLs d'images du backup...\n");

lines.forEach((line, index) => {
  // Chercher les lignes contenant des URLs d'images
  if (
    line.includes("https://") &&
    (line.includes(".jpg") ||
      line.includes(".jpeg") ||
      line.includes(".png") ||
      line.includes(".webp") ||
      line.includes("blob.vercel-storage.com"))
  ) {
    // Extraire les URLs avec une regex
    const urlMatches = line.match(
      /https:\/\/[^\s'"]+\.(jpg|jpeg|png|webp|gif)/gi
    );
    if (urlMatches) {
      urlMatches.forEach((url) => {
        if (!imageUrls.includes(url)) {
          imageUrls.push(url);
        }
      });
    }

    // Chercher aussi les URLs Vercel Blob Storage
    const blobMatches = line.match(
      /https:\/\/[^\s'"]*blob\.vercel-storage\.com[^\s'"]*\.(jpg|jpeg|png|webp|gif)/gi
    );
    if (blobMatches) {
      blobMatches.forEach((url) => {
        if (!imageUrls.includes(url)) {
          imageUrls.push(url);
        }
      });
    }

    // Afficher la ligne pour debug si elle contient une image
    if (urlMatches || blobMatches) {
      console.log(`📍 Ligne ${index + 1}:`);
      console.log(`   ${line.trim()}`);
      console.log("");
    }
  }
});

console.log("\n📋 TOUTES LES URLs D'IMAGES TROUVÉES:");
console.log("=".repeat(50));

if (imageUrls.length === 0) {
  console.log("❌ Aucune URL d'image trouvée dans le backup");
} else {
  imageUrls.forEach((url, index) => {
    console.log(`${index + 1}. ${url}`);
  });
}

console.log(`\n📊 Total: ${imageUrls.length} images trouvées`);

// Sauvegarder dans un fichier JSON pour analyse
const imageData = {
  totalImages: imageUrls.length,
  extractedAt: new Date().toISOString(),
  urls: imageUrls,
};

fs.writeFileSync("extracted-images.json", JSON.stringify(imageData, null, 2));
console.log("\n💾 Données sauvegardées dans extracted-images.json");
