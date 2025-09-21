import https from "https";

const imageUrls = [
  "https://8pi4gfrln9bquwem.public.blob.vercel-storage.com/john-coltrane-ole-coltrane-qafv7342Uj0n19lQmNatC9Exdx9y5p.jpg",
  "https://8pi4gfrln9bquwem.public.blob.vercel-storage.com/81RePbC-4sL._UF1000,1000_QL80_-0dhPzlGp0n99t1LwYRTbtUAuCrQgha.jpg",
  "https://8pi4gfrln9bquwem.public.blob.vercel-storage.com/meshell-peace-3DfF2k380VzeVyjPfqjRWEgCPTxQoR.png",
  "https://8pi4gfrln9bquwem.public.blob.vercel-storage.com/81I+Czu06rL._UF1000,1000_QL80_-wqAgul7B84AJd5RXPgCCHmEmQ9X24L.jpg",
  "https://8pi4gfrln9bquwem.public.blob.vercel-storage.com/a1952280421_10-OERVJdWxoYgdq6hSBaPe2YGbDPxT6u.jpg",
];

console.log("🔍 Test d'accessibilité des images Vercel Blob Storage...\n");

function testImage(url, index) {
  return new Promise((resolve) => {
    const request = https.get(url, (response) => {
      console.log(`${index + 1}. Status: ${response.statusCode} - ${url}`);
      if (response.statusCode === 200) {
        console.log("   ✅ Image accessible");
      } else {
        console.log(`   ❌ Image inaccessible (${response.statusCode})`);
      }
      resolve({ url, status: response.statusCode });
    });

    request.on("error", (error) => {
      console.log(`${index + 1}. ERREUR - ${url}`);
      console.log(`   ❌ ${error.message}`);
      resolve({ url, error: error.message });
    });

    request.setTimeout(5000, () => {
      console.log(`${index + 1}. TIMEOUT - ${url}`);
      console.log("   ⏰ Délai dépassé");
      request.destroy();
      resolve({ url, error: "Timeout" });
    });
  });
}

async function testAllImages() {
  const results = [];

  for (let i = 0; i < imageUrls.length; i++) {
    const result = await testImage(imageUrls[i], i);
    results.push(result);
    console.log(""); // Ligne vide pour séparation
  }

  console.log("📊 RÉSUMÉ:");
  console.log("==========");

  const accessible = results.filter((r) => r.status === 200);
  const broken = results.filter((r) => r.status !== 200 || r.error);

  console.log(`✅ Images accessibles: ${accessible.length}`);
  console.log(`❌ Images cassées: ${broken.length}`);

  if (broken.length > 0) {
    console.log("\n🚨 Images cassées:");
    broken.forEach((img) => {
      console.log(`   - ${img.url}`);
      if (img.error) console.log(`     Erreur: ${img.error}`);
    });
  }
}

testAllImages();
