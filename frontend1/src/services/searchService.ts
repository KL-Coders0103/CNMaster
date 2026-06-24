import { api } from "../api/axios";

export const globalSearchApi = async (query: string) => {
  return api.get("/search", {
    params: { q: query }, 
  });
};