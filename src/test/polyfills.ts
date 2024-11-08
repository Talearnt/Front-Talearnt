import { TransformStream } from "web-streams-polyfill";

if (typeof global.TransformStream === "undefined") {
  global.TransformStream = TransformStream;
}
