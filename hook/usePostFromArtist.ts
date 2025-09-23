import { PostWithCategory } from "@/types";
import axios from "axios";
import { useQuery } from "react-query";

interface PostFromArtistResponse {
  posts: PostWithCategory[];
  totalCount: number;
}

const fetchPostsFromArtist = async (
  artistName: string,
  page: number,
  limit: number
): Promise<PostFromArtistResponse> => {
  const { data } = await axios.get(
    `/api/from-artist/${artistName}?page=${page}&limit=${limit}`
  );
  return data;
};

export const usePostFromArtist = (
  artistName: string,
  page: number = 1,
  limit: number = 12
) => {
  return useQuery(
    ["posts-from-artist", artistName, page, limit],
    () => fetchPostsFromArtist(artistName, page, limit),
    {
      staleTime: 1000 * 60 * 5,
      keepPreviousData: true,
    }
  );
};