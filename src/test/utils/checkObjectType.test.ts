import { describe, expect, test } from "vitest";

import { checkObjectType } from "@utils/checkObjectType";

describe("checkObjectType utility function", () => {
  test("should return true for an object", () => {
    expect(checkObjectType({})).toBe(true);
  });

  test("should return false for an array", () => {
    expect(checkObjectType([])).toBe(false);
  });

  test("should return false for null", () => {
    expect(checkObjectType(null)).toBe(false);
  });

  test("should return false for non-object types", () => {
    expect(checkObjectType("")).toBe(false);
    expect(checkObjectType(1)).toBe(false);
    expect(checkObjectType(undefined)).toBe(false);
  });

  test("should return true for a nested object", () => {
    expect(checkObjectType({ a: { b: 2 } })).toBe(true);
  });

  test("should return true for an empty object", () => {
    expect(checkObjectType({})).toBe(true);
  });
});
