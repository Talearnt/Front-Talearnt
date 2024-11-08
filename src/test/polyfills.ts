if (typeof global.TransformStream === "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { TransformStream } = require("web-streams-polyfill");
  global.TransformStream = TransformStream;
}
