import { fetchWrapper } from "@/services/api";
import { Aircraft } from "@/types/aircraft";

export const fetchAircrafts = async () => {
  // TODO: Uncomment this when using the API

  const { data } = await fetchWrapper<Aircraft[]>("aircrafts");
  return data;

  //   const aircrafts = (await import("@/services/aircrafts.json")).default;

  //   return aircrafts;
};
