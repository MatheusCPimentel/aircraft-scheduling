import { fetchWrapper } from "@/services/api";
import { Flight } from "@/types/flight";

export const fetchFlights = async (id?: string) => {
  // TODO: Uncomment this when using the API
  if (id) {
    const { data } = await fetchWrapper<Flight>(`flights/${id}`);
    return data;
  }

  const { data } = await fetchWrapper<Flight[]>("flights");
  return data;

  // const flights = (await import("@/services/flights.json")).default;

  // if (id) {
  //   return flights.find((flight) => flight.ident === id);
  // }

  // return flights;
};
