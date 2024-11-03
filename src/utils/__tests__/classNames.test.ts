import { expect, test } from "vitest";

import { classNames } from "@utils/classNames";

test("returns the last class when duplicate classes are provided", () => {
  expect(classNames("mb-4", "mb-5")).toBe("mb-5");
});

test("returns empty string when no classes are provided", () => {
  expect(classNames()).toBe("");
});

test("ignores null and undefined values", () => {
  expect(classNames("mb-4", null, "mt-2", undefined)).toBe("mb-4 mt-2");
});

test("combines unique classes correctly", () => {
  expect(classNames("mb-4", "mt-2", "text-center")).toBe(
    "mb-4 mt-2 text-center"
  );
});

test("handles empty strings and combines other classes", () => {
  expect(classNames("mb-4", "", "mt-2")).toBe("mb-4 mt-2");
});
