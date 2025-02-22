"use client";

import { Flight } from "@/types/flight";
import { Aircraft } from "@/types/aircraft";
import { TimeBlock } from "@/types/rotation";

interface TimelineProps {
  selectedAircraft: Aircraft | null;
  currentRotation: Flight[];
}

export const Timeline = ({
  selectedAircraft,
  currentRotation,
}: TimelineProps) => {
  const SECONDS_IN_DAY = 24 * 60 * 60;
  const TURNAROUND_TIME = 20 * 60;

  const calculateTimeBlocks = (): TimeBlock[] => {
    if (!currentRotation.length) {
      return [{ type: "idle", start: 0, end: SECONDS_IN_DAY }];
    }

    const blocks: TimeBlock[] = [];
    let currentTime = 0;

    currentRotation.forEach((flight, index) => {
      if (flight.departuretime > currentTime) {
        blocks.push({
          type: "idle",
          start: currentTime,
          end: flight.departuretime,
        });
      }

      blocks.push({
        type: "flight",
        start: flight.departuretime,
        end: flight.arrivaltime,
        flight,
      });

      if (index < currentRotation.length - 1) {
        blocks.push({
          type: "turnaround",
          start: flight.arrivaltime,
          end: flight.arrivaltime + TURNAROUND_TIME,
        });

        currentTime = flight.arrivaltime + TURNAROUND_TIME;
      } else {
        currentTime = flight.arrivaltime;
      }
    });

    if (currentTime < SECONDS_IN_DAY) {
      blocks.push({
        type: "idle",
        start: currentTime,
        end: SECONDS_IN_DAY,
      });
    }

    return blocks;
  };

  const getBlockColor = (type: TimeBlock["type"]): string => {
    switch (type) {
      case "flight":
        return "bg-green-500";
      case "turnaround":
        return "bg-purple-500";
      case "idle":
        return "bg-gray-300";
    }
  };

  const getBlockWidth = (start: number, end: number): string => {
    const percentage = ((end - start) / SECONDS_IN_DAY) * 100;
    return `${percentage}%`;
  };

  const timeBlocks = calculateTimeBlocks();

  const hoursToDisplay = [0, 6, 12, 18, 24];

  return (
    <div className="gap-4">
      {!selectedAircraft ? (
        <p className="text-gray-500 text-center py-4">
          Select an aircraft to view its timeline
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex justify-between text-sm text-gray-500 px-1">
            {hoursToDisplay.map((hour) => (
              <span key={hour}>{hour.toString().padStart(2, "0")}:00</span>
            ))}
          </div>

          <div className="flex h-8 w-full rounded-md overflow-hidden">
            {timeBlocks.map((block, index) => (
              <div
                key={index}
                className={`relative group ${getBlockColor(block.type)}`}
                style={{ width: getBlockWidth(block.start, block.end) }}
              />
            ))}
          </div>

          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded" />
              <span>Flight</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded" />
              <span>Turnaround</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-300 rounded" />
              <span>Idle</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
