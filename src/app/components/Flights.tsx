"use client";

import { Card } from "./Card";
import { Flight } from "@/types/flight";
import { Aircraft } from "@/types/aircraft";
import { useState, useEffect } from "react";
import { AircraftRotations } from "@/types/rotation";
import { getLocalData } from "@/services/getLocalData";
import { FlightsShimmer } from "./shimmer/FlightsShimmer";
import * as Tooltip from "@radix-ui/react-tooltip";
import { Plus, MoveRight } from "lucide-react";

interface FlightAvailability {
  available: boolean;
  reason?: string;
}

interface FlightsProps {
  selectedAircraft: Aircraft | null;
  onAddFlight: (flight: Flight) => void;
  allRotations: AircraftRotations;
  currentRotation: Flight[];
}

export const Flights = ({
  selectedAircraft,
  onAddFlight,
  allRotations,
  currentRotation,
}: FlightsProps) => {
  const TURNAROUND_TIME_IN_SECONDS = 20 * 60;
  const SECONDS_IN_A_DAY = 24 * 60 * 60;

  const [flights, setFlights] = useState<Flight[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const { data } = await getLocalData<Flight[]>("flights");
        setFlights(data);
      } catch (error) {
        console.error("Failed to fetch flights:", error);
        setFlights([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFlights();
  }, []);

  const findAircraftUsingFlight = (flight: Flight): string | null => {
    if (!allRotations) return null;

    for (const [aircraftId, aircraftRotation] of Object.entries(allRotations)) {
      if (
        aircraftRotation?.some(
          (existingFlight) => existingFlight.ident === flight.ident
        )
      ) {
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
      if (flight.arrivaltime > SECONDS_IN_A_DAY) {
        return {
          available: false,
          reason: "Flight cannot end after midnight",
        };
      }

      return { available: true };
    }

    const lastFlight = currentRotation[currentRotation.length - 1];

    if (flight.departuretime < lastFlight.arrivaltime) {
      return {
        available: false,
        reason: "Flights must be in chronological order",
      };
    }

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

    if (flight.arrivaltime > SECONDS_IN_A_DAY) {
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
    <Tooltip.Provider disableHoverableContent>
      <Card className="gap-4">
        <h2 className="text-lg font-semibold sm:text-left">Flights</h2>

        {isLoading ? (
          <FlightsShimmer />
        ) : (
          <div className="flex flex-col gap-4 w-full overflow-y-auto pr-3">
            {flights.map((flight) => {
              const availability = checkFlightAvailability(flight);

              return (
                <Tooltip.Root key={flight.ident} delayDuration={0}>
                  <Tooltip.Trigger asChild>
                    <div
                      className={`flex items-center w-full justify-between p-4 border rounded-xl bg-white transition-all duration-200
                        ${
                          !availability.available
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:border-blue-500 hover:shadow-sm cursor-pointer"
                        }
                      `}
                      onClick={() =>
                        availability.available && onAddFlight(flight)
                      }
                    >
                      <div className="w-full flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-slate-900">
                            {flight.ident}
                          </span>

                          {availability.available && (
                            <span className="text-sm text-blue-500 flex items-center gap-1">
                              <Plus className="w-4 h-4" />
                              Add to rotation
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between gap-4 bg-slate-50 p-3 rounded-lg">
                          <div className="text-center">
                            <p className="font-medium text-slate-900">
                              {flight.origin}
                            </p>

                            <p className="text-slate-500 text-sm">
                              {flight.readable_departure}
                            </p>
                          </div>

                          <div className="text-slate-400">
                            <MoveRight className="w-6 h-6" />
                          </div>

                          <div className="text-center">
                            <p className="font-medium text-slate-900">
                              {flight.destination}
                            </p>

                            <p className="text-slate-500 text-sm">
                              {flight.readable_arrival}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Tooltip.Trigger>

                  {!availability.available && availability.reason && (
                    <Tooltip.Content
                      className="bg-slate-900 text-white text-sm py-2 px-3 rounded-lg"
                      side="top"
                    >
                      {availability.reason}
                      <Tooltip.Arrow className="fill-slate-900" />
                    </Tooltip.Content>
                  )}
                </Tooltip.Root>
              );
            })}
          </div>
        )}
      </Card>
    </Tooltip.Provider>
  );
};
