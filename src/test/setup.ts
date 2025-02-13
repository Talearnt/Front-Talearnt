import { afterAll, afterEach, beforeAll } from "vitest";

import "@testing-library/jest-dom/vitest";
import { server } from "@test/api/mock/server";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
