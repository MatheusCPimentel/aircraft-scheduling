import { ShimmerBlock } from "./base";

export const AircraftsShimmer = () => {
  return (
    <div className="flex flex-col gap-4 w-full overflow-y-auto pr-4 -mr-4">
      {[...Array(12)].map((_, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-4 border rounded-md"
        >
          <div className="flex flex-col gap-2 w-full">
            <ShimmerBlock className="h-6 w-32" />
            <ShimmerBlock className="h-4 w-24" />
          </div>

          <div className="flex flex-col items-end gap-2">
            <ShimmerBlock className="h-4 w-20" />
            <ShimmerBlock className="h-4 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
};
