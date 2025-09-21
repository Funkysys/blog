import axios from "axios";
import { useQuery } from "react-query";
import { PostWithCategory } from "../types";

const getPostBySlug = async (slug: string) => {
  const { data } = await axios.get(`/api/posts/${slug}`);
  return data as PostWithCategory;
};

export function usePost(slug: string) {
  return useQuery({
    queryKey: ["post", slug],
    queryFn: () => getPostBySlug(slug),
    enabled: !!slug,
  });
}
