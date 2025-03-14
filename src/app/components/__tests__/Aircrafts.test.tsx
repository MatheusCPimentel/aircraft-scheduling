import { render, screen, fireEvent, waitFor } from "@/test/utils";
import { Aircrafts } from "../Aircrafts";
import { mockAircraft, mockFlight } from "@/test/utils";
import { getLocalData } from "@/services/getLocalData";

jest.mock("@/services/localData");

describe("Aircrafts", () => {
  const mockOnSelect = jest.fn();
  const mockAllRotations = {};

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows loading state initially", () => {
    (getLocalData as jest.Mock).mockImplementation(() => new Promise(() => {}));

    render(
      <Aircrafts
        selectedAircraft={null}
        onSelect={mockOnSelect}
        allRotations={mockAllRotations}
      />
    );

    expect(screen.getByTestId("aircrafts-shimmer")).toBeInTheDocument();
  });

  it("renders aircrafts correctly", async () => {
    const mockAircrafts = [mockAircraft];
    (getLocalData as jest.Mock).mockResolvedValue({
      data: mockAircrafts,
      responseInfo: { status: 200, statusText: "OK", url: "local://aircrafts" },
    });

    render(
      <Aircrafts
        selectedAircraft={null}
        onSelect={mockOnSelect}
        allRotations={mockAllRotations}
      />
    );

    await waitFor(() => {
      expect(
        screen.getByText(`Aircraft ${mockAircraft.type}`)
      ).toBeInTheDocument();
    });

    expect(screen.getByText(mockAircraft.ident)).toBeInTheDocument();
    expect(screen.getByText(mockAircraft.base)).toBeInTheDocument();
    expect(screen.getByText("No flights scheduled")).toBeInTheDocument();
  });

  it("handles aircraft selection", async () => {
    const mockAircrafts = [mockAircraft];
    (getLocalData as jest.Mock).mockResolvedValue({
      data: mockAircrafts,
      responseInfo: { status: 200, statusText: "OK", url: "local://aircrafts" },
    });

    render(
      <Aircrafts
        selectedAircraft={null}
        onSelect={mockOnSelect}
        allRotations={mockAllRotations}
      />
    );

    await waitFor(() => {
      expect(
        screen.getByText(`Aircraft ${mockAircraft.type}`)
      ).toBeInTheDocument();
    });

    const aircraftElement = screen.getByText(`Aircraft ${mockAircraft.type}`);

    fireEvent.click(
      aircraftElement.closest("div[class*='flex items-center']")!
    );

    expect(mockOnSelect).toHaveBeenCalledWith(mockAircraft);
  });

  it("shows selected state correctly", async () => {
    const mockAircrafts = [mockAircraft];
    (getLocalData as jest.Mock).mockResolvedValue({
      data: mockAircrafts,
      responseInfo: { status: 200, statusText: "OK", url: "local://aircrafts" },
    });

    render(
      <Aircrafts
        selectedAircraft={mockAircraft}
        onSelect={mockOnSelect}
        allRotations={mockAllRotations}
      />
    );

    await waitFor(() => {
      expect(
        screen.getByText(`Aircraft ${mockAircraft.type}`)
      ).toBeInTheDocument();
    });

    const aircraftElement = screen.getByText(`Aircraft ${mockAircraft.type}`);

    const container = aircraftElement.closest(
      "div[class*='flex items-center']"
    );

    expect(container).not.toBeNull();
    expect(container?.className).toContain("border-blue-500");
    expect(container?.className).toContain("bg-blue-50");
  });

  it("calculates and displays utilization correctly", async () => {
    const rotations = {
      [mockAircraft.ident]: [mockFlight],
    };

    const mockAircrafts = [mockAircraft];
    (getLocalData as jest.Mock).mockResolvedValue({
      data: mockAircrafts,
      responseInfo: { status: 200, statusText: "OK", url: "local://aircrafts" },
    });

    render(
      <Aircrafts
        selectedAircraft={null}
        onSelect={mockOnSelect}
        allRotations={rotations}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/\d+\.\d+% Utilization/)).toBeInTheDocument();
    });
  });

  it("handles API error gracefully", async () => {
    (getLocalData as jest.Mock).mockRejectedValue(new Error("API Error"));

    render(
      <Aircrafts
        selectedAircraft={null}
        onSelect={mockOnSelect}
        allRotations={mockAllRotations}
      />
    );

    expect(screen.getByTestId("aircrafts-shimmer")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId("aircrafts-shimmer")).toBeInTheDocument();
    });
  });
});
