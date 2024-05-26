import axios from "axios";
import { useQuery } from "react-query";

export const usePosts = (slug: string | null = null, page: number) => {
  return useQuery(["posts", page], async () => {
    const { data } = await axios.get(`/api/posts?cat=${slug}&page=${page}`);
    return data;
  });
};
