import axios from "axios";
import { useQuery } from "react-query";

const getArtists = async () => {
  const { data } = await axios.get("/api/artists");
  return data as string[];
};

export function useArtists() {
  return useQuery({
    queryKey: ["artists"],
    queryFn: () => getArtists(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}