export const getAlbumImage = (
  imageUrl: string | null,
  categorySlug: string,
  albumTitle?: string
): string => {
  if (imageUrl) {
    return imageUrl;
  }
  
  return '/img/disque.jpg';
};

export const getAlbumImageByTitle = (title: string, artist: string): string | null => {
  const albumMap: { [key: string]: string } = {
    'bitches brew': '/img/albums/bitches-brew.jpg',
    'headhunters': '/img/albums/headhunters.jpg',
    'whats going on': '/img/albums/whats-going-on.jpg',
    'the epic': '/img/albums/the-epic.jpg',
  };
  
  const key = title.toLowerCase().replace(/['']/g, '').replace(/\s+/g, ' ').trim();
  return albumMap[key] || null;
};