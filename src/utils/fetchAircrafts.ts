import { fetchWrapper } from "@/services/api";
import { Aircraft } from "@/types/aircraft";

export const fetchAircrafts = async (id?: string) => {
  if (id) {
    const { data } = await fetchWrapper<Aircraft>(`aircrafts/${id}`);
    return data;
  }

  const { data } = await fetchWrapper<Aircraft[]>("aircrafts");
  return data;
};
