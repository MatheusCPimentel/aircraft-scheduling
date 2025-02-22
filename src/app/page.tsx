import { Aircrafts } from "./components/Aircrafts";
import { Rotation } from "./components/Rotation";
import { Flights } from "./components/Flights";
import { Timeline } from "./components/Timeline";

export default async function Home() {
  return (
    <main className="h-full grid grid-cols-1 gap-4 lg:grid-cols-[30fr_50fr_20fr] lg:gap-6">
      <Aircrafts />

      <div className="flex flex-col gap-4">
        <Rotation />
        <Timeline />
      </div>

      <Flights />
    </main>
  );
}
