import { server } from "@/test/api/mock/server";
import { afterAll, afterEach, beforeAll } from "vitest";

import "@testing-library/jest-dom/vitest";
import "web-streams-polyfill/ponyfill";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
