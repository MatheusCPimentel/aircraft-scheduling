import { render, screen, fireEvent } from "@/test/utils";
import { Rotation } from "../Rotation";
import { mockAircraft, mockFlight } from "@/test/utils";

describe("Rotation", () => {
  const onRemoveFlight = jest.fn();
  const onResetRotation = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows placeholder when no aircraft is selected", () => {
    render(
      <Rotation
        selectedAircraft={null}
        currentRotation={[]}
        onRemoveFlight={onRemoveFlight}
        onResetRotation={onResetRotation}
      />
    );

    expect(screen.getByText(/select an aircraft/i)).toBeInTheDocument();
    expect(screen.queryByText(/reset rotation/i)).not.toBeInTheDocument();
  });

  it("shows empty rotation message when aircraft is selected but no flights", () => {
    render(
      <Rotation
        selectedAircraft={mockAircraft}
        currentRotation={[]}
        onRemoveFlight={onRemoveFlight}
        onResetRotation={onResetRotation}
      />
    );

    expect(screen.getByText(/no flights in rotation/i)).toBeInTheDocument();
    expect(screen.getByText(/reset rotation/i)).toBeInTheDocument();
  });

  it("displays flight information correctly", () => {
    render(
      <Rotation
        selectedAircraft={mockAircraft}
        currentRotation={[mockFlight]}
        onRemoveFlight={onRemoveFlight}
        onResetRotation={onResetRotation}
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
        onResetRotation={onResetRotation}
      />
    );

    const removeButton = screen.getByRole("button", { name: /remove flight/i });
    fireEvent.click(removeButton);

    expect(onRemoveFlight).toHaveBeenCalledWith(mockFlight);
  });

  it("calls onResetRotation when reset button is clicked", () => {
    render(
      <Rotation
        selectedAircraft={mockAircraft}
        currentRotation={[mockFlight]}
        onRemoveFlight={onRemoveFlight}
        onResetRotation={onResetRotation}
      />
    );

    const resetButton = screen.getByRole("button", { name: /reset rotation/i });
    fireEvent.click(resetButton);

    expect(onResetRotation).toHaveBeenCalled();
  });

  it("displays rotation date", () => {
    render(
      <Rotation
        selectedAircraft={mockAircraft}
        currentRotation={[]}
        onRemoveFlight={onRemoveFlight}
        onResetRotation={onResetRotation}
      />
    );

    expect(screen.getByText(/rotation -/i)).toBeInTheDocument();
  });
});
