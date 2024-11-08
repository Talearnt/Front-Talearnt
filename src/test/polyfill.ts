// polyfill.ts
import { BroadcastChannel as PolyfillBroadcastChannel } from "broadcast-channel";

import "web-streams-polyfill/polyfill";

// Node.js 환경에서만 BroadcastChannel을 폴리필합니다.
if (
  typeof window === "undefined" &&
  typeof global.BroadcastChannel === "undefined"
) {
  global.BroadcastChannel = PolyfillBroadcastChannel;
}
