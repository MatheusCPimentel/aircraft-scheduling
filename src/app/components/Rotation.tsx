"use client";

import { Flight } from "@/types/flight";
import { Card } from "./Card";
import { Aircraft } from "@/types/aircraft";

interface RotationProps {
  selectedAircraft: Aircraft | null;
  currentRotation: Flight[];
  onRemoveFlight: (flight: Flight) => void;
}

export const Rotation = ({
  selectedAircraft,
  currentRotation,
  onRemoveFlight,
}: RotationProps) => {
  return (
    <Card className="gap-4 min-h-[550px]">
      <h2 className="text-lg font-semibold">Rotation</h2>

      {!selectedAircraft ? (
        <p className="text-gray-500 text-center py-4">
          Select an aircraft to start planning its rotation
        </p>
      ) : (
        <div className="flex flex-col gap-4 w-full">
          {currentRotation.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No flights in rotation. Add flights from the list on the right.
            </p>
          ) : (
            currentRotation.map((flight) => (
              <div
                key={flight.ident}
                className="flex items-center justify-between p-4 border rounded-md"
              >
                <div className="flex flex-col w-full gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">
                      Flight: {flight.ident}
                    </span>

                    <button
                      onClick={() => onRemoveFlight(flight)}
                      className="py-2 px-3 text-lg text-red-500 hover:bg-red-50 rounded-full"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-xl">{flight.origin}</p>

                      <p className="text-gray-500 text-lg">
                        {flight.readable_departure}
                      </p>
                    </div>

                    <div className="text-gray-400 text-5xl">➔</div>

                    <div>
                      <p className="font-medium text-xl">
                        {flight.destination}
                      </p>

                      <p className="text-gray-500 text-lg">
                        {flight.readable_arrival}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </Card>
  );
};
