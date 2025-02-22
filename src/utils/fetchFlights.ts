import { fetchWrapper } from "@/services/api";
import { Flight } from "@/types/flight";

export const fetchFlights = async () => {
  const { data } = await fetchWrapper<Flight[]>("flights");
  return data;
};
