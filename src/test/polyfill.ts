import { BroadcastChannel } from "broadcast-channel";

if (typeof global.BroadcastChannel === "undefined") {
  global.BroadcastChannel = BroadcastChannel;
}
