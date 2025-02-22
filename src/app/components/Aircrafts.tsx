import { fetchAircrafts } from "@/utils/fetchAircrafts";
import { Card } from "./Card";
import { Aircraft } from "@/types/aircraft";

export const Aircrafts = async () => {
  const aircrafts = (await fetchAircrafts()) as Aircraft[];

  return (
    <Card className="gap-4">
      <h2 className="text-lg font-semibold">Aircrafts</h2>

      <div className="flex flex-col gap-4 w-full">
        {aircrafts.map((aircraft) => (
          <div
            key={aircraft.ident}
            className="flex items-center justify-between p-3 border rounded-md"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                ✈️
              </div>

              <div>
                <h3 className="font-medium">Aircraft {aircraft.type}</h3>

                <p className="text-sm text-gray-500">
                  Registration: {aircraft.base}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm font-medium">Base: {aircraft.base}</p>

              <p className="text-sm text-gray-500">
                Seats: {aircraft.economySeats}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
