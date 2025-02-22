"use client";

import { Flight } from "@/types/flight";
import { Aircraft } from "@/types/aircraft";
import { TimeBlock } from "@/types/rotation";
import * as Tooltip from "@radix-ui/react-tooltip";
import { Card } from "./Card";
import {
  SECONDS_IN_DAY,
  TURNAROUND_TIME_SECONDS,
  formatTime,
} from "@/utils/date";

interface TimelineProps {
  selectedAircraft: Aircraft | null;
  currentRotation: Flight[];
}

export const Timeline = ({
  selectedAircraft,
  currentRotation,
}: TimelineProps) => {
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
          end: flight.arrivaltime + TURNAROUND_TIME_SECONDS,
        });

        currentTime = flight.arrivaltime + TURNAROUND_TIME_SECONDS;
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
        return "bg-green-600";
      case "turnaround":
        return "bg-purple-400";
      case "idle":
        return "bg-gray-200";
    }
  };

  const getBlockWidth = (start: number, end: number): string => {
    const percentage = ((end - start) / SECONDS_IN_DAY) * 100;
    return `${percentage}%`;
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
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-4">Timeline</h2>

      {!selectedAircraft ? (
        <p className="text-slate-500 text-center py-8">
          Select an aircraft to view its timeline
        </p>
      ) : (
        <Tooltip.Provider>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between text-sm text-slate-500 px-1">
              {hoursToDisplay.map((hour) => (
                <span key={hour}>{hour.toString().padStart(2, "0")}:00</span>
              ))}
            </div>

            <div className="flex h-10 w-full rounded-lg overflow-hidden bg-slate-100">
              {timeBlocks.map((block, index) => (
                <Tooltip.Root key={index} delayDuration={0}>
                  <Tooltip.Trigger asChild>
                    <div
                      className={`relative group ${getBlockColor(block.type)}`}
                      style={{ width: getBlockWidth(block.start, block.end) }}
                    />
                  </Tooltip.Trigger>

                  <Tooltip.Content
                    className="bg-slate-900 text-white text-sm py-2 px-3 rounded-lg whitespace-pre-line"
                    side="top"
                    align="center"
                  >
                    {getBlockTooltipContent(block)}
                    <Tooltip.Arrow className="fill-slate-900" />
                  </Tooltip.Content>
                </Tooltip.Root>
              ))}
            </div>

            <div className="flex gap-6 text-sm justify-center pt-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-600 rounded" />
                <span className="text-slate-600">Flight</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-400 rounded" />
                <span className="text-slate-600">Turnaround</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-200 rounded" />
                <span className="text-slate-600">Idle</span>
              </div>
            </div>
          </div>
        </Tooltip.Provider>
      )}
    </Card>
  );
};
