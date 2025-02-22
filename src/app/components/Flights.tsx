"use client";

import { fetchFlights } from "@/utils/fetchFlights";
import { Card } from "./Card";
import { Flight } from "@/types/flight";
import { Aircraft } from "@/types/aircraft";
import { useState, useEffect } from "react";
import { AircraftRotations } from "@/types/rotation";

interface FlightAvailability {
  available: boolean;
  reason?: string;
}

interface FlightsProps {
  selectedAircraft: Aircraft | null;
  onAddFlight: (flight: Flight) => void;
  allRotations: AircraftRotations;
}

export const Flights = ({
  selectedAircraft,
  onAddFlight,
  allRotations,
}: FlightsProps) => {
  const TURNAROUND_TIME_IN_SECONDS = 20 * 60;

  const [flights, setFlights] = useState<Flight[]>([]);

  const currentRotation = selectedAircraft
    ? allRotations[selectedAircraft.ident] || []
    : [];

  useEffect(() => {
    const fetch = async () => {
      const flights = (await fetchFlights()) as Flight[];
      setFlights(flights);
    };

    fetch();
  }, []);

  const findAircraftUsingFlight = (flight: Flight): string | null => {
    if (!allRotations) return null;

    for (const [aircraftId, aircraftRotation] of Object.entries(allRotations)) {
      if (aircraftRotation?.some((f) => f.ident === flight.ident)) {
        return aircraftId;
      }
    }

    return null;
  };

  const checkFlightAvailability = (flight: Flight): FlightAvailability => {
    if (!selectedAircraft) {
      return {
        available: false,
        reason: "Select an aircraft first",
      };
    }

    if (currentRotation.some((f) => f.ident === flight.ident)) {
      return {
        available: false,
        reason: "Flight is already in current rotation",
      };
    }

    const alreadyUsedAircraftId = findAircraftUsingFlight(flight);

    if (alreadyUsedAircraftId) {
      return {
        available: false,
        reason: `Flight is already assigned to aircraft ${alreadyUsedAircraftId}`,
      };
    }

    if (currentRotation.length === 0) {
      if (flight.departuretime < 0) {
        return {
          available: false,
          reason: "Flight cannot start before midnight",
        };
      }

      if (flight.arrivaltime > 24 * 60 * 60) {
        return {
          available: false,
          reason: "Flight cannot end after midnight",
        };
      }

      return { available: true };
    }

    const lastFlight = currentRotation[currentRotation.length - 1];

    if (
      flight.departuretime <
      lastFlight.arrivaltime + TURNAROUND_TIME_IN_SECONDS
    ) {
      const requiredTime = new Date(
        (lastFlight.arrivaltime + TURNAROUND_TIME_IN_SECONDS) * 1000
      )
        .toISOString()
        .substring(11, 16);

      return {
        available: false,
        reason: `Need 20min turnaround time. Available after ${requiredTime}`,
      };
    }

    if (flight.arrivaltime > 24 * 60 * 60) {
      return {
        available: false,
        reason: "Flight cannot end after midnight",
      };
    }

    if (flight.origin !== lastFlight.destination) {
      return {
        available: false,
        reason: `Aircraft will be at ${lastFlight.destination}, but flight departs from ${flight.origin}`,
      };
    }

    return { available: true };
  };

  return (
    <Card className="gap-4">
      <h2 className="text-lg font-semibold">Flights</h2>

      <div className="flex flex-col gap-4 w-full max-h-[500px] overflow-y-auto">
        {flights.map((flight) => {
          const availability = checkFlightAvailability(flight);

          return (
            <div
              key={flight.ident}
              className={`flex items-center w-full justify-between p-3 border rounded-md group relative
                ${
                  !availability.available
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:border-blue-500 cursor-pointer"
                }
              `}
              onClick={() => availability.available && onAddFlight(flight)}
            >
              <div className="w-full flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{flight.ident}</span>

                  {availability.available && (
                    <span className="text-sm text-blue-500">Click to add</span>
                  )}
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

              {!availability.available && availability.reason && (
                <div className="absolute left-0 right-0 -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-sm py-2 px-3 rounded-md text-center mx-4 pointer-events-none">
                  {availability.reason}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
};
