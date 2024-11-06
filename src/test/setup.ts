import { server } from "@/test/api/mock/server";
import { afterAll, afterEach, beforeAll } from "vitest";

import "web-streams-polyfill/polyfill";
import "@testing-library/jest-dom/vitest";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
