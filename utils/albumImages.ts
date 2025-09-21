// Utilitaire pour gérer les images d'albums avec fallback par genre
export const getAlbumImage = (
  imageUrl: string | null,
  categorySlug: string,
  albumTitle?: string
): string => {
  // Si on a une image, on la retourne telle quelle (on laisse le composant Image gérer les erreurs)
  if (imageUrl) {
    return imageUrl;
  }
  
  // Si pas d'image, on utilise l'image par défaut
  return '/img/disque.jpg';
};

// Fonction pour les titres d'albums populaires (à étendre si nécessaire)
export const getAlbumImageByTitle = (title: string, artist: string): string | null => {
  const albumMap: { [key: string]: string } = {
    'bitches brew': '/img/albums/bitches-brew.jpg',
    'headhunters': '/img/albums/headhunters.jpg',
    'whats going on': '/img/albums/whats-going-on.jpg',
    'the epic': '/img/albums/the-epic.jpg',
    // Ajouter d'autres albums iconiques si nécessaire
  };
  
  const key = title.toLowerCase().replace(/['']/g, '').replace(/\s+/g, ' ').trim();
  return albumMap[key] || null;
};