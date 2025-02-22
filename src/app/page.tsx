"use client";

import { Aircrafts } from "./components/Aircrafts";
import { Rotation } from "./components/Rotation";
import { Flights } from "./components/Flights";
import { Timeline } from "./components/Timeline";
import { useState } from "react";
import { Aircraft } from "@/types/aircraft";
import { Flight } from "@/types/flight";
import { AircraftRotations } from "@/types/rotation";

export default function Home() {
  const [selectedAircraft, setSelectedAircraft] = useState<Aircraft | null>(
    null
  );

  const [allRotations, setAllRotations] = useState<AircraftRotations>({});

  const currentRotation = selectedAircraft
    ? allRotations[selectedAircraft.ident] || []
    : [];

  const handleFlightChange = (flight: Flight, action: "add" | "remove") => {
    if (!selectedAircraft) return;

    const newRotation =
      action === "add"
        ? [...currentRotation, flight]
        : currentRotation.filter(
            (existingFlight) => existingFlight.ident !== flight.ident
          );

    setAllRotations({
      ...allRotations,
      [selectedAircraft.ident]: newRotation,
    });
  };

  return (
    <main className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_2fr_1fr] lg:gap-6">
      <Aircrafts
        onSelect={setSelectedAircraft}
        selectedAircraft={selectedAircraft}
        allRotations={allRotations}
      />

      <div className="flex flex-col gap-4">
        <Rotation
          selectedAircraft={selectedAircraft}
          currentRotation={currentRotation}
          onRemoveFlight={(flight) => handleFlightChange(flight, "remove")}
        />

        <Timeline
          selectedAircraft={selectedAircraft}
          currentRotation={currentRotation}
        />
      </div>

      <Flights
        selectedAircraft={selectedAircraft}
        onAddFlight={(flight) => handleFlightChange(flight, "add")}
        allRotations={allRotations}
        currentRotation={currentRotation}
      />
    </main>
  );
}
