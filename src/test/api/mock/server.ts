/* eslint-disable simple-import-sort/imports */
import "web-streams-polyfill/polyfill";
import "@/test/polyfill";

import { setupServer } from "msw/node";

import { handlers } from "./handler";

export const server = setupServer(...handlers);
