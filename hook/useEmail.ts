import axios from "axios";
import { useQuery } from "react-query";

export const useEmails = () => {
  return useQuery("emails", async () => {
    const { data } = await axios.get("/api/emails");
    return data;
  });
};
