import axios from "axios";
import { useQuery } from "react-query";

export const usePostFromUser = (slug: string | null = null) => {
  return useQuery(["user"], async () => {
    const { data } = await axios.get(`/api/from-user/${slug}`);
    return data;
  });
};
