import { fetchWrapper } from "@/services/api";

export const fetchFlights = async (id?: string) => {
  if (id) {
    const { data } = await fetchWrapper(`flights/${id}`);
    return data;
  }

  const { data } = await fetchWrapper("flights");
  return data;
};
