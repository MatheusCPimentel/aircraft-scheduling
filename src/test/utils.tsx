import { render as rtlRender } from "@testing-library/react";
import * as Tooltip from "@radix-ui/react-tooltip";
import { Aircraft } from "@/types/aircraft";
import { Flight } from "@/types/flight";

function render(ui: React.ReactElement, options = {}) {
  return rtlRender(<Tooltip.Provider>{ui}</Tooltip.Provider>, options);
}

export const mockAircraft: Aircraft = {
  ident: "ABCD123",
  type: "A320",
  economySeats: 180,
  base: "EGLL",
};

export const mockFlight: Flight = {
  ident: "AS1234",
  departuretime: 28800, // 08:00
  arrivaltime: 36000, // 10:00
  readable_departure: "08:00",
  readable_arrival: "10:00",
  origin: "EGLL",
  destination: "LFPG",
};

export * from "@testing-library/react";
export { render };
