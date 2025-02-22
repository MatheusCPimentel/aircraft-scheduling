"use client";

import { Flight } from "@/types/flight";
import { Aircraft } from "@/types/aircraft";
import { TimeBlock } from "@/types/rotation";
import * as Tooltip from "@radix-ui/react-tooltip";

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

  const formatTime = (seconds: number): string => {
    const date = new Date(seconds * 1000);
    return date.toISOString().substring(11, 16);
  };

  const getBlockTooltipContent = (block: TimeBlock): string => {
    const timeRange = `${formatTime(block.start)} - ${formatTime(block.end)}`;

    switch (block.type) {
      case "flight":
        return `Flight ${block.flight?.ident}\n${block.flight?.origin} → ${block.flight?.destination}\n${timeRange}`;

      case "turnaround":
        return `Turnaround Time\n${timeRange}`;

      case "idle":
        return `Idle Time\n${timeRange}`;
    }
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
        <Tooltip.Provider>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between text-sm text-gray-500 px-1">
              {hoursToDisplay.map((hour) => (
                <span key={hour}>{hour.toString().padStart(2, "0")}:00</span>
              ))}
            </div>

            <div className="flex h-8 w-full rounded-md overflow-hidden">
              {timeBlocks.map((block, index) => (
                <Tooltip.Root key={index} delayDuration={0}>
                  <Tooltip.Trigger asChild>
                    <div
                      className={`relative group ${getBlockColor(block.type)}`}
                      style={{ width: getBlockWidth(block.start, block.end) }}
                    />
                  </Tooltip.Trigger>

                  <Tooltip.Content
                    className="bg-gray-800 text-white text-sm py-2 px-3 rounded whitespace-pre-line"
                    side="top"
                    align="center"
                  >
                    {getBlockTooltipContent(block)}
                    <Tooltip.Arrow className="fill-gray-800" />
                  </Tooltip.Content>
                </Tooltip.Root>
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
        </Tooltip.Provider>
      )}
    </div>
  );
};
