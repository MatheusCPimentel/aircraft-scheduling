"use client";

import { Card } from "./Card";
import { Aircraft } from "@/types/aircraft";
import { Flight } from "@/types/flight";
import { useState, useEffect } from "react";
import { fetchWrapper } from "@/services/api";

interface AircraftsProps {
  selectedAircraft: Aircraft | null;
  onSelect: (aircraft: Aircraft | null) => void;
  allRotations: { [key: string]: Flight[] };
}

export const Aircrafts = ({
  selectedAircraft,
  onSelect,
  allRotations,
}: AircraftsProps) => {
  const TURNAROUND_TIME = 20 * 60;
  const SECONDS_IN_DAY = 24 * 60 * 60;

  const [aircrafts, setAircrafts] = useState<Aircraft[]>([]);

  useEffect(() => {
    const fetchAircrafts = async () => {
      const { data } = await fetchWrapper<Aircraft[]>("aircrafts");
      setAircrafts(data);
    };

    fetchAircrafts();
  }, []);

  const calculateUtilization = (flights: Flight[]): number => {
    if (flights.length === 0) return 0;

    const totalFlightTime = flights.reduce((acc, flight) => {
      return acc + (flight.arrivaltime - flight.departuretime);
    }, 0);

    const totalTurnaroundTime = (flights.length - 1) * TURNAROUND_TIME;

    return ((totalFlightTime + totalTurnaroundTime) / SECONDS_IN_DAY) * 100;
  };

  const formatUtilization = (utilization: number) => {
    if (utilization === 0) return "No flights scheduled";

    return `${utilization.toFixed(2)}% Utilization`;
  };

  return (
    <Card className="gap-4">
      <h2 className="text-lg font-semibold">Aircrafts</h2>

      <div className="flex flex-col gap-4 w-full overflow-y-auto pr-4 -mr-4">
        {aircrafts.map((aircraft) => {
          const isSelected = selectedAircraft?.ident === aircraft.ident;
          const rotation = allRotations[aircraft.ident] || [];
          const utilization = calculateUtilization(rotation);

          return (
            <div
              key={aircraft.ident}
              className={`flex items-center justify-between p-4 border rounded-md hover:border-blue-500 cursor-pointer ${
                isSelected ? "border-blue-500 bg-blue-50" : ""
              }`}
              onClick={() => onSelect(aircraft)}
            >
              <div className="flex flex-col gap-1">
                <span className="font-medium">Aircraft {aircraft.type}</span>

                <span className="text-sm text-gray-500">
                  {formatUtilization(utilization)}
                </span>
              </div>

              <div className="flex flex-col items-end text-sm text-gray-500">
                <span>{aircraft.ident}</span>
                <span>{aircraft.base}</span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
