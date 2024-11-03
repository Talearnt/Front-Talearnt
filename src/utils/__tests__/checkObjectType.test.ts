import { expect, test } from "vitest";

import { checkObjectType } from "@utils/checkObjectType";

test("typeof {} -> object, object to return true", () => {
  expect(checkObjectType({})).toBe(true);
});

test("typeof [] -> object, Array to return false", () => {
  expect(checkObjectType([])).toBe(false);
});

test("typeof null -> null | null to return false", () => {
  expect(checkObjectType(null)).toBe(false);
});

test("other types return false", () => {
  expect(checkObjectType("")).toBe(false);
  expect(checkObjectType(1)).toBe(false);
  expect(checkObjectType(undefined)).toBe(false);
});

test("nested object to return true", () => {
  expect(checkObjectType({ a: { b: 2 } })).toBe(true);
});

test("empty object to return true", () => {
  expect(checkObjectType({})).toBe(true);
});
