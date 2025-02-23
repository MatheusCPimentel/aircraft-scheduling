import { ShimmerBlock } from "./base";

export const FlightsShimmer = () => {
  return (
    <div
      data-testid="flights-shimmer"
      className="flex flex-col gap-4 w-full overflow-y-auto pr-4 -mr-4"
    >
      {[...Array(12)].map((_, index) => (
        <div
          key={index}
          className="flex items-center w-full justify-between p-3 border rounded-md"
        >
          <div className="w-full flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <ShimmerBlock className="h-5 w-24" />
              <ShimmerBlock className="h-4 w-20" />
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col items-center gap-2">
                <ShimmerBlock className="h-5 w-16" />
                <ShimmerBlock className="h-4 w-20" />
              </div>

              <div className="flex flex-col items-center gap-2">
                <ShimmerBlock className="h-5 w-16" />
                <ShimmerBlock className="h-4 w-20" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
