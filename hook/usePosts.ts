import axios from "axios";
import { useQuery } from "react-query";

export const usePosts = (slug: string | null = null, page: number) => {
  return useQuery(["posts", page], async () => {
    const params = new URLSearchParams();
    if (slug) params.append("cat", slug);
    params.append("page", page.toString());
    const { data } = await axios.get(`/api/posts?${params.toString()}`);
    return data;
  });
};
