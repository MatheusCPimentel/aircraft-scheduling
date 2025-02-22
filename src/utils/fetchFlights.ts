import { fetchWrapper } from "@/services/api";
import { Flight } from "@/types/flight";

export const fetchFlights = async (id?: string) => {
  if (id) {
    const { data } = await fetchWrapper<Flight>(`flights/${id}`);
    return data;
  }

  const { data } = await fetchWrapper<Flight[]>("flights");
  return data;
};
