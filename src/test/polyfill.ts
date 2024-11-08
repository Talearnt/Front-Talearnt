import { Blob, File } from "node:buffer";
import { fetch, FormData, Headers, Request, Response } from "undici";

import "broadcastchannel-polyfill/index.js";
import "web-streams-polyfill/polyfill";

Object.defineProperties(globalThis, {
  fetch: { value: fetch, writable: true },
  Blob: { value: Blob },
  File: { value: File },
  Headers: { value: Headers },
  FormData: { value: FormData },
  Request: { value: Request },
  Response: { value: Response }
});
