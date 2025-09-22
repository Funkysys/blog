import { PostWithCategory } from "@/types";
import axios from "axios";
import { useQuery } from "react-query";

const fetchPostsFromUser = async (userName: string): Promise<PostWithCategory[]> => {
  const { data } = await axios.get(`/api/from-user/${userName}`);
  return data;
};

export const usePostFromUser = (userName: string) => {
  return useQuery(["posts-from-user", userName], () => fetchPostsFromUser(userName), {
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
