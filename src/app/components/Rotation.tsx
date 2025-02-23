"use client";

import { Flight } from "@/types/flight";
import { Card } from "./Card";
import { Aircraft } from "@/types/aircraft";
import { formatDateWithOrdinal, getTomorrowDate } from "@/utils/date";
import { X, MoveRight, RotateCcw } from "lucide-react";

interface RotationProps {
  selectedAircraft: Aircraft | null;
  currentRotation: Flight[];
  onRemoveFlight: (flight: Flight) => void;
  onResetRotation: () => void;
}

export const Rotation = ({
  selectedAircraft,
  currentRotation,
  onRemoveFlight,
  onResetRotation,
}: RotationProps) => {
  const rotationDate = formatDateWithOrdinal(getTomorrowDate());

  return (
    <Card className="gap-4 min-h-[550px]">
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold sm:text-left">
          Rotation - {rotationDate}
        </h2>

        {selectedAircraft && currentRotation.length > 0 && (
          <button
            onClick={onResetRotation}
            className="flex items-center gap-2 px-3 py-2 text-red-500 hover:text-red-50 hover:bg-red-500 rounded-lg text-sm font-medium transition-all duration-200"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Rotation for this Aircraft
          </button>
        )}
      </div>

      {!selectedAircraft ? (
        <p className="text-gray-500 text-center py-4">
          Select an aircraft to start planning its rotation
        </p>
      ) : (
        <div className="flex flex-col gap-4 w-full overflow-y-auto pr-3">
          {currentRotation.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No flights in rotation. Add flights from the list on the right.
            </p>
          ) : (
            currentRotation.map((flight) => (
              <div
                key={flight.ident}
                className="flex items-center justify-between p-4 border rounded-xl bg-white"
              >
                <div className="flex flex-col w-full gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 font-medium">
                      Flight {flight.ident}
                    </span>

                    <button
                      onClick={() => onRemoveFlight(flight)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors duration-200"
                      aria-label="Remove flight"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between bg-slate-50 p-4 rounded-lg">
                    <div className="text-center">
                      <p className="font-medium text-xl text-slate-900">
                        {flight.origin}
                      </p>

                      <p className="text-slate-500 text-base">
                        {flight.readable_departure}
                      </p>
                    </div>

                    <div className="text-slate-400">
                      <MoveRight className="w-8 h-8" />
                    </div>

                    <div className="text-center">
                      <p className="font-medium text-xl text-slate-900">
                        {flight.destination}
                      </p>
                      <p className="text-slate-500">
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
