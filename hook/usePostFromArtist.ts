import axios from "axios";
import { useQuery } from "react-query";

export const usePostFromArtist = (artistName: string) => {
  return useQuery(["posts-from-artist", artistName], async () => {
    const { data } = await axios.get(`/api/from-artist/${encodeURIComponent(artistName)}`);
    return data;
  }, {
    enabled: !!artistName,
    staleTime: 5 * 60 * 1000, 
  });
};