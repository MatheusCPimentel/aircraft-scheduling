import { render, screen, waitFor } from "@/test/utils";
import { Timeline } from "../Timeline";
import { mockAircraft, mockFlight } from "@/test/utils";
import { SECONDS_IN_DAY } from "@/utils/date";
import userEvent from "@testing-library/user-event";

describe("Timeline", () => {
  it("shows placeholder when no aircraft is selected", () => {
    render(<Timeline selectedAircraft={null} currentRotation={[]} />);

    expect(screen.getByText(/select an aircraft/i)).toBeInTheDocument();
  });

  it("shows empty timeline when aircraft is selected but no flights", () => {
    render(<Timeline selectedAircraft={mockAircraft} currentRotation={[]} />);

    expect(screen.getByText("00:00")).toBeInTheDocument();
    expect(screen.getByText("06:00")).toBeInTheDocument();
    expect(screen.getByText("12:00")).toBeInTheDocument();
    expect(screen.getByText("18:00")).toBeInTheDocument();
    expect(screen.getByText("24:00")).toBeInTheDocument();
  });

  it("displays flight blocks correctly", async () => {
    render(
      <Timeline
        selectedAircraft={mockAircraft}
        currentRotation={[mockFlight]}
      />
    );

    const flightBlock = screen
      .getAllByRole("generic")
      .find((el) => el.className.includes("bg-green-600"));
    expect(flightBlock).not.toBeNull();

    await userEvent.hover(flightBlock as Element);

    await waitFor(() => {
      const tooltip = screen.getByRole("tooltip");

      expect(tooltip).toHaveTextContent(`Flight ${mockFlight.ident}`);

      expect(tooltip).toHaveTextContent(
        `${mockFlight.origin} → ${mockFlight.destination}`
      );

      expect(tooltip).toHaveTextContent(
        `${mockFlight.readable_departure} - ${mockFlight.readable_arrival}`
      );
    });
  });

  it("shows correct block types in legend", () => {
    render(
      <Timeline
        selectedAircraft={mockAircraft}
        currentRotation={[mockFlight]}
      />
    );

    expect(screen.getByText("Flight")).toBeInTheDocument();
    expect(screen.getByText("Turnaround")).toBeInTheDocument();
    expect(screen.getByText("Idle")).toBeInTheDocument();
  });

  it("calculates block widths correctly", () => {
    const flight = {
      ...mockFlight,
      departuretime: SECONDS_IN_DAY / 4, // 6 hours
      arrivaltime: SECONDS_IN_DAY / 2, // 12 hours
    };

    render(
      <Timeline selectedAircraft={mockAircraft} currentRotation={[flight]} />
    );

    const blocks = screen
      .getAllByRole("generic")
      .filter((el) => el.className.includes("bg-") && el.style.width);

    expect(blocks).toHaveLength(3);

    expect(blocks[0].style.width).toBe("25%");
    expect(blocks[1].style.width).toBe("25%");
    expect(blocks[2].style.width).toBe("50%");
  });
});
