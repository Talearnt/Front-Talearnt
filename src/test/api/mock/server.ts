import { setupServer } from "msw/node";

import "web-streams-polyfill";
import { handlers } from "./handler";

export const server = setupServer(...handlers);
