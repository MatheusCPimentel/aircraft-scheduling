import { fetchWrapper } from "@/services/api";

export const fetchAircrafts = async (id?: string) => {
  if (id) {
    const { data } = await fetchWrapper(`aircrafts/${id}`);
    return data;
  }

  const { data } = await fetchWrapper("aircrafts");
  return data;
};
