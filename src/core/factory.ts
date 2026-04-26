import { createFactory } from "hono/factory";
import type { AppEnv } from "@/types/env";

const factory = createFactory<AppEnv>();

export const createRouter = () => {
  return factory.createApp();
};
