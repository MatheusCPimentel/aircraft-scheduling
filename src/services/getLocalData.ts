import aircraftsData from "./aircrafts.json";
import flightsData from "./flights.json";
import { Aircraft } from "@/types/aircraft";
import { Flight } from "@/types/flight";

interface FetchResponseInfo {
  status: number;
  statusText: string;
  url: string;
}

interface FetchResponse<T> {
  data: T;
  responseInfo: FetchResponseInfo;
}

export async function getLocalData<T>(
  resource: "aircrafts" | "flights"
): Promise<FetchResponse<T>> {
  // Simulate a network delay - just to see the shimmer effect
  await new Promise((resolve) => setTimeout(resolve, 300));

  let data: unknown;

  if (resource === "aircrafts") {
    data = aircraftsData as Aircraft[];
  } else if (resource === "flights") {
    data = flightsData as Flight[];
  } else {
    throw new Error(`Unknown resource: ${resource}`);
  }

  const responseInfo: FetchResponseInfo = {
    status: 200,
    statusText: "OK",
    url: `local://${resource}`,
  };

  return {
    data: data as T,
    responseInfo,
  };
}
