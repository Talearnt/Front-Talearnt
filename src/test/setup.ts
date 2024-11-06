import { server } from "@/test/api/mock/server";
import { afterAll, afterEach, beforeAll } from "vitest";
import { TransformStream } from "web-streams-polyfill";

import "@testing-library/jest-dom/vitest";
globalThis.TransformStream = TransformStream;

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
