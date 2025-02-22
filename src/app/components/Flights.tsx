import { fetchFlights } from "@/utils/fetchFlights";
import { Card } from "./Card";
import { Flight } from "@/types/flight";

export const Flights = async () => {
  const flights = (await fetchFlights()) as Flight[];

  const flightsToDisplay = flights.slice(0, 5);

  const FlightCard = ({ flight }: { flight: Flight }) => (
    <div
      key={flight.ident}
      className="flex items-center w-full justify-between p-3 border rounded-md"
    >
      <div className="w-full flex flex-col gap-2">
        <div className="flex justify-center items-center gap-2">
          <span className="font-medium">{flight.ident}</span>
        </div>

        <div className="flex items-center justify-between gap-4 text-sm text-gray-500">
          <div className="flex flex-col items-center">
            <p className="font-medium">{flight.origin}</p>
            <p>{flight.readable_departure}</p>
          </div>

          <div className="flex flex-col items-center">
            <p className="font-medium">{flight.destination}</p>
            <p>{flight.readable_arrival}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Card className="gap-4">
      <h2 className="text-lg font-semibold">Flights</h2>

      {flightsToDisplay.map((flight) => (
        <FlightCard key={flight.ident} flight={flight} />
      ))}
    </Card>
  );
};
