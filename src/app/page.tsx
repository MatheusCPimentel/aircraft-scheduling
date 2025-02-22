"use client";

import { Aircrafts } from "./components/Aircrafts";
import { Rotation } from "./components/Rotation";
import { Flights } from "./components/Flights";
import { Timeline } from "./components/Timeline";
import { useState } from "react";
import { Aircraft } from "@/types/aircraft";

export default function Home() {
  const [selectedAircraft, setSelectedAircraft] = useState<Aircraft | null>(
    null
  );

  return (
    <main className="h-full grid grid-cols-1 gap-4 lg:grid-cols-[30fr_50fr_20fr] lg:gap-6">
      <Aircrafts
        onSelect={setSelectedAircraft}
        selectedAircraft={selectedAircraft}
      />

      <div className="flex flex-col gap-4">
        <Rotation />
        {/* <Timeline /> */}
      </div>

      <Flights />
    </main>
  );
}
