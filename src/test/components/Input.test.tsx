import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import { Input } from "@components/Input/Input";

describe("Input Component", () => {
  test("renders without crashing", () => {
    render(<Input />);
    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
  });

  test("renders label when label prop is provided", () => {
    render(<Input label={"Test Label"} />);
    expect(screen.getByText("Test Label")).toBeInTheDocument();
  });

  test("renders error message when error prop is provided", () => {
    render(
      <Input error={{ errorContent: "Error occurred", hasError: true }} />
    );
    expect(screen.getByText("Error occurred")).toBeInTheDocument();
  });

  test("changes input value on change event", async () => {
    const { getByRole } = render(<Input />);
    const input = getByRole("textbox");

    await userEvent.type(input, "Hello, world!");
    expect(input).toHaveValue("Hello, world!");
  });

  test("applies className correctly", () => {
    render(
      <Input className={"custom-input"} wrapperClassName={"custom-wrapper"} />
    );
    const input = screen.getByRole("textbox");

    expect(input).toHaveClass("custom-input");
  });

  test("applies disabled state correctly", () => {
    render(<Input disabled />);
    const input = screen.getByRole("textbox");
    expect(input).toBeDisabled();
  });

  test("associates label with input correctly", () => {
    render(<Input id="test-input" />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("id", "test-input");
  });
});
