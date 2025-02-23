import { render, screen } from "@testing-library/react";
import { Card } from "../Card";

describe("Card", () => {
  it("renders children correctly", () => {
    render(
      <Card>
        <div>Test content</div>
      </Card>
    );

    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <Card className="custom-class">
        <div>Test content</div>
      </Card>
    );

    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("has default card styles", () => {
    const { container } = render(
      <Card>
        <div>Test content</div>
      </Card>
    );

    const card = container.firstChild as HTMLElement;

    expect(card).toHaveClass(
      "bg-white",
      "rounded-xl",
      "border",
      "border-slate-200"
    );
  });
});
