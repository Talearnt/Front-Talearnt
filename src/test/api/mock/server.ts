import "web-streams-polyfill/polyfill";
import "broadcast-channel";

if (typeof globalThis.BroadcastChannel === "undefined") {
  globalThis.BroadcastChannel = BroadcastChannel;
}

import { setupServer } from "msw/node";

import { handlers } from "./handler";

export const server = setupServer(...handlers);
