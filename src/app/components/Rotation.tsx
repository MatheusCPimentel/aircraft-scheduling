import { Card } from "./Card";

export const Rotation = () => {
  return (
    <Card className="gap-4">
      <h2 className="text-lg font-semibold">Rotation</h2>

      <div className="flex flex-col gap-4 w-full">
        <div className="flex items-center justify-between p-4 border rounded-md">
          <div className="flex flex-col  w-full gap-3">
            <span className="text-gray-500">Flight: AS1001</span>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-xl">JFK</p>
                <p className=" text-gray-500 text-lg">2:00</p>
              </div>

              <div className="text-gray-400 text-5xl">➔</div>

              <div>
                <p className="font-medium text-xl">LDN</p>
                <p className=" text-gray-500 text-lg">10:34</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
