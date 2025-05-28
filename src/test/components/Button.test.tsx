import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import { Button } from "@components/common/Button/Button";

describe("Button Component", () => {
  test("renders with children", () => {
    render(<Button>children</Button>);
    const initialText = screen.getByRole("button", { name: "children" });

    expect(initialText).toBeInTheDocument();
  });

  test("calls onClick handler when button is clicked", async () => {
    const handleClick = vi.fn();

    render(<Button onClick={handleClick}>클릭</Button>);

    const button = screen.getByRole("button", { name: "클릭" });

    await userEvent.click(button);

    expect(handleClick).toHaveBeenCalled();
  });
});
