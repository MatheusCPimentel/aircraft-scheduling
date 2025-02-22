import { fetchAircrafts } from "@/utils/fetchAircrafts";
import { fetchFlights } from "@/utils/fetchFlights";

export default async function Home() {
  const aircrafts = await fetchAircrafts();
  const flights = await fetchFlights();

  console.log(aircrafts);
  console.log(flights);

  return (
    <div>
      <h1>Aircraft Scheduling</h1>
    </div>
  );
}
