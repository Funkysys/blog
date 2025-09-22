import { PostWithCategory } from "@/types";
import axios from "axios";
import { useQuery } from "react-query";

interface PostFromUserResponse {
  posts: PostWithCategory[];
  totalCount: number;
}

const fetchPostsFromUser = async (
  userName: string,
  page: number,
  limit: number
): Promise<PostFromUserResponse> => {
  const { data } = await axios.get(
    `/api/from-user/${userName}?page=${page}&limit=${limit}`
  );
  return data;
};

export const usePostFromUser = (
  userName: string,
  page: number = 1,
  limit: number = 12
) => {
  return useQuery(
    ["posts-from-user", userName, page, limit],
    () => fetchPostsFromUser(userName, page, limit),
    {
      staleTime: 1000 * 60 * 5, 
      keepPreviousData: true,
    }
  );
};
