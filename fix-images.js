// Script pour identifier et réparer les images d'albums cassées
const albums = [
  { title: "Olé", artist: "John Coltrane", genre: "jazz" },
  { title: "Songs of Freedom", artist: "Nguyên Lê", genre: "jazz-fusion" },
  {
    title: "Peace Beyond Passion",
    artist: "Me'Shell Ndegéocello",
    genre: "soul-rb",
  },
  { title: "SongBook", artist: "Kenny Garrett", genre: "jazz" },
  { title: "Leaving Space", artist: "Duology eXperiment", genre: "new-jazz" },
  { title: "In the Element", artist: "SAULT", genre: "soul-rb" },
  { title: "Blowout Comb", artist: "Digable Planets", genre: "jazz" },
  { title: "Orca", artist: "Buke and Gase", genre: "post-rock" },
  { title: "The Spirit of Music", artist: "Kenny Garrett", genre: "jazz" },
  { title: "Dreamers", artist: "GoGo Penguin", genre: "new-jazz" },
  {
    title: "Electric Miles: The Session",
    artist: "Miles Davis",
    genre: "jazz-fusion",
  },
  { title: "How Music Works", artist: "David Byrne", genre: "post-rock" },
  { title: "SAULT 5", artist: "SAULT", genre: "soul-rb" },
  { title: "Plantasia", artist: "Mort Garson", genre: "ambient" },
  { title: "What's Going On", artist: "Marvin Gaye", genre: "soul-rb" },
  {
    title: "Black Radio III",
    artist: "Robert Glasper Experiment",
    genre: "new-jazz",
  },
  { title: "Headhunters", artist: "Herbie Hancock", genre: "jazz-fusion" },
  { title: "Bitches Brew", artist: "Miles Davis", genre: "jazz-fusion" },
  { title: "The Epic", artist: "Kamasi Washington", genre: "new-jazz" },
];

console.log("=== ALBUMS AVEC IMAGES CASSÉES ===\n");
console.log("Albums à réparer :");
albums.forEach((album, index) => {
  console.log(
    `${index + 1}. "${album.title}" by ${album.artist} (${album.genre})`
  );
});

console.log("\n=== SOLUTION TEMPORAIRE ===");
console.log("1. Utiliser l'image par défaut /img/disque.jpg");
console.log("2. Créer des images spécifiques par genre musical");
console.log("3. Télécharger les vraies pochettes d'albums");

console.log("\n=== IMAGES SPÉCIFIQUES PAR GENRE ===");
const genres = [...new Set(albums.map((a) => a.genre))];
genres.forEach((genre) => {
  console.log(`- ${genre}: /img/genres/${genre}.jpg`);
});

console.log("\n=== SOLUTION RECOMMANDÉE ===");
console.log("Créer des images par genre dans /public/img/genres/");
console.log(
  "Modifier l'application pour utiliser des images de fallback par genre"
);
