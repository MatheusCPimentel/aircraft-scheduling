import { render, screen, waitFor, fireEvent } from "@/test/utils";
import { Flights } from "../Flights";
import { mockAircraft, mockFlight } from "@/test/utils";
import { getLocalData } from "@/services/getLocalData";
import userEvent from "@testing-library/user-event";

jest.mock("@/services/localData");

const mockOnAddFlight = jest.fn();
const mockAllRotations = {};

describe("Flights", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows loading state initially", async () => {
    (getLocalData as jest.Mock).mockImplementation(() => new Promise(() => {}));

    render(
      <Flights
        selectedAircraft={null}
        onAddFlight={mockOnAddFlight}
        allRotations={mockAllRotations}
        currentRotation={[]}
      />
    );

    expect(screen.getByTestId("flights-shimmer")).toBeInTheDocument();
  });

  it("renders flights correctly", async () => {
    const mockFlights = [mockFlight];
    (getLocalData as jest.Mock).mockResolvedValue({
      data: mockFlights,
      responseInfo: { status: 200, statusText: "OK", url: "local://flights" },
    });

    render(
      <Flights
        selectedAircraft={mockAircraft}
        onAddFlight={mockOnAddFlight}
        allRotations={mockAllRotations}
        currentRotation={[]}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(mockFlight.ident)).toBeInTheDocument();
    });

    expect(screen.getByText(mockFlight.origin)).toBeInTheDocument();
    expect(screen.getByText(mockFlight.destination)).toBeInTheDocument();
    expect(screen.getByText(mockFlight.readable_departure)).toBeInTheDocument();
    expect(screen.getByText(mockFlight.readable_arrival)).toBeInTheDocument();
  });

  it('shows "Add to rotation" button for available flights', async () => {
    render(
      <Flights
        selectedAircraft={mockAircraft}
        onAddFlight={mockOnAddFlight}
        allRotations={mockAllRotations}
        currentRotation={[]}
      />
    );

    expect(await screen.findByText("Add to rotation")).toBeInTheDocument();
    expect(screen.getByTestId("plus-icon")).toBeInTheDocument();
  });

  it("handles flight addition", async () => {
    render(
      <Flights
        selectedAircraft={mockAircraft}
        onAddFlight={mockOnAddFlight}
        allRotations={mockAllRotations}
        currentRotation={[]}
      />
    );

    const flightElement = await screen.findByText(mockFlight.ident);
    fireEvent.click(flightElement.parentElement?.parentElement as HTMLElement);

    expect(mockOnAddFlight).toHaveBeenCalledWith(mockFlight);
  });

  it("disables already added flights", async () => {
    (getLocalData as jest.Mock).mockResolvedValue({
      data: [mockFlight],
    });

    render(
      <Flights
        selectedAircraft={mockAircraft}
        onAddFlight={mockOnAddFlight}
        allRotations={mockAllRotations}
        currentRotation={[mockFlight]}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(mockFlight.ident)).toBeInTheDocument();
    });

    const flightElement = screen.getByText(mockFlight.ident);

    const flightContainer = flightElement.closest(
      "div[class*='flex items-center w-full']"
    );

    expect(flightContainer).not.toBeNull();
    expect(flightContainer?.className).toContain("opacity-50");
    expect(flightContainer?.className).toContain("cursor-not-allowed");

    await userEvent.hover(flightContainer as Element);

    await waitFor(() => {
      expect(
        screen.getAllByText("Flight is already in current rotation")
      ).toHaveLength(2);
    });
  });

  it("shows message when no aircraft is selected", async () => {
    (getLocalData as jest.Mock).mockResolvedValue({
      data: [mockFlight],
    });

    render(
      <Flights
        selectedAircraft={null}
        onAddFlight={mockOnAddFlight}
        allRotations={mockAllRotations}
        currentRotation={[]}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(mockFlight.ident)).toBeInTheDocument();
    });

    const flightElement = screen.getByText(mockFlight.ident);

    const flightContainer = flightElement.closest(
      "div[class*='flex items-center w-full']"
    );

    expect(flightContainer).not.toBeNull();
    expect(flightContainer?.className).toContain("opacity-50");

    await userEvent.hover(flightContainer as Element);

    await waitFor(() => {
      expect(screen.getAllByText("Select an aircraft first")).toHaveLength(2);
    });
  });

  it("handles API error gracefully", async () => {
    (getLocalData as jest.Mock).mockRejectedValue(new Error("API Error"));

    render(
      <Flights
        selectedAircraft={mockAircraft}
        onAddFlight={mockOnAddFlight}
        allRotations={mockAllRotations}
        currentRotation={[]}
      />
    );

    expect(screen.getByTestId("flights-shimmer")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId("flights-shimmer")).toBeInTheDocument();
    });
  });
});
