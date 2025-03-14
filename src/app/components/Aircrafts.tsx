"use client";

import { Card } from "./Card";
import { Aircraft } from "@/types/aircraft";
import { Flight } from "@/types/flight";
import { useState, useEffect } from "react";
import { getLocalData } from "@/services/getLocalData";
import { AircraftsShimmer } from "./shimmer/AircraftsShimmer";
import { SECONDS_IN_DAY, TURNAROUND_TIME_SECONDS } from "@/utils/date";

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
  const [aircrafts, setAircrafts] = useState<Aircraft[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAircrafts = async () => {
      try {
        const { data } = await getLocalData<Aircraft[]>("aircrafts");
        setAircrafts(data);
      } catch (error) {
        console.error("Failed to fetch aircrafts:", error);
        setAircrafts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAircrafts();
  }, []);

  const calculateUtilization = (flights: Flight[]): number => {
    if (flights.length === 0) return 0;

    const totalFlightTime = flights.reduce((acc, flight) => {
      return acc + (flight.arrivaltime - flight.departuretime);
    }, 0);

    const totalTurnaroundTime = (flights.length - 1) * TURNAROUND_TIME_SECONDS;

    return ((totalFlightTime + totalTurnaroundTime) / SECONDS_IN_DAY) * 100;
  };

  const formatUtilization = (utilization: number) => {
    if (utilization === 0) return "No flights scheduled";

    return `${utilization.toFixed(2)}% Utilization`;
  };

  return (
    <Card className="gap-4">
      <h2 className="text-lg font-semibold sm:text-left">Aircrafts</h2>

      {isLoading ? (
        <AircraftsShimmer />
      ) : (
        <div className="flex flex-col gap-4 w-full overflow-y-auto pr-3">
          {aircrafts.map((aircraft) => {
            const isSelected = selectedAircraft?.ident === aircraft.ident;
            const rotation = allRotations[aircraft.ident] || [];
            const utilization = calculateUtilization(rotation);

            return (
              <div
                key={aircraft.ident}
                className={`flex items-center justify-between p-4 border rounded-xl bg-white transition-all duration-200
                  ${
                    isSelected
                      ? "border-blue-500 bg-blue-50"
                      : "hover:border-blue-500 hover:shadow-sm"
                  } cursor-pointer`}
                onClick={() => onSelect(aircraft)}
              >
                <div className="flex flex-col gap-2 text-left">
                  <span className="font-medium text-slate-900">
                    Aircraft {aircraft.type}
                  </span>

                  <span className="text-sm text-slate-500">
                    {formatUtilization(utilization)}
                  </span>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className="font-medium text-slate-700">
                    {aircraft.ident}
                  </span>

                  <span className="text-sm text-slate-500">
                    {aircraft.base}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};
