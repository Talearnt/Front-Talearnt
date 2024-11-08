/* eslint-disable simple-import-sort/imports */
import "@testing-library/jest-dom/vitest";

import { server } from "@/test/api/mock/server";
import { afterAll, afterEach, beforeAll } from "vitest";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
