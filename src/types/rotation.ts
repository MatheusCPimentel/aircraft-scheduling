import { Flight } from "./flight";

export interface AircraftRotations {
  [key: string]: Flight[];
}

export interface TimeBlock {
  type: "idle" | "flight" | "turnaround";
  start: number;
  end: number;
  flight?: Flight;
}
