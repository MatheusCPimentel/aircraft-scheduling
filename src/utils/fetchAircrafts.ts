import { fetchWrapper } from "@/services/api";
import { Aircraft } from "@/types/aircraft";

export const fetchAircrafts = async () => {
  const { data } = await fetchWrapper<Aircraft[]>("aircrafts");

  return data;
};
