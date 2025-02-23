import { render, screen, fireEvent } from "@/test/utils";
import { Rotation } from "../Rotation";
import { mockAircraft, mockFlight } from "@/test/utils";

describe("Rotation", () => {
  const onRemoveFlight = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows placeholder when no aircraft is selected", () => {
    render(
      <Rotation
        selectedAircraft={null}
        currentRotation={[]}
        onRemoveFlight={onRemoveFlight}
      />
    );

    expect(screen.getByText(/select an aircraft/i)).toBeInTheDocument();
  });

  it("shows empty rotation message when aircraft is selected but no flights", () => {
    render(
      <Rotation
        selectedAircraft={mockAircraft}
        currentRotation={[]}
        onRemoveFlight={onRemoveFlight}
      />
    );

    expect(screen.getByText(/no flights in rotation/i)).toBeInTheDocument();
  });

  it("displays flight information correctly", () => {
    render(
      <Rotation
        selectedAircraft={mockAircraft}
        currentRotation={[mockFlight]}
        onRemoveFlight={onRemoveFlight}
      />
    );

    expect(screen.getByText(`Flight ${mockFlight.ident}`)).toBeInTheDocument();
    expect(screen.getByText(mockFlight.origin)).toBeInTheDocument();
    expect(screen.getByText(mockFlight.destination)).toBeInTheDocument();
    expect(screen.getByText(mockFlight.readable_departure)).toBeInTheDocument();
    expect(screen.getByText(mockFlight.readable_arrival)).toBeInTheDocument();
  });

  it("calls onRemoveFlight when remove button is clicked", () => {
    render(
      <Rotation
        selectedAircraft={mockAircraft}
        currentRotation={[mockFlight]}
        onRemoveFlight={onRemoveFlight}
      />
    );

    const removeButton = screen.getByRole("button", { name: /remove flight/i });
    fireEvent.click(removeButton);

    expect(onRemoveFlight).toHaveBeenCalledWith(mockFlight);
  });

  it("displays rotation date", () => {
    render(
      <Rotation
        selectedAircraft={mockAircraft}
        currentRotation={[]}
        onRemoveFlight={onRemoveFlight}
      />
    );

    expect(screen.getByText(/rotation -/i)).toBeInTheDocument();
  });
});
