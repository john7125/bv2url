import { Hono } from "hono";
import type { Context } from "hono";
import { cors } from "hono/cors";
import apiRouter from "@/routes";
import type { AppEnv } from "@/types/env";
import ky from "ky";

const app = new Hono<AppEnv>();

app.use(
  "*",
  cors({
    origin: (origin, c: Context<AppEnv>) => {
      return c.env.CORS_ORIGIN;
    },
  }),
);

app.route("/", apiRouter);

export default {
  fetch: app.fetch,
  async scheduled(event: any, env: AppEnv["Bindings"]) {
    const time = new Date().toLocaleString("zh-CN", {
      timeZone: "Asia/Shanghai",
      hour12: false, // 使用 24 小时制
    });
    console.log(`Cron triggered at: ${time}`);

    const healthcheck = `${env.BILI_PROXY}/healthcheck`;

    try {
      const text = await ky
        .get(healthcheck, {
          retry: {
            limit: 2,
            methods: ["get"],
          },
          timeout: 60000,
        })
        .text();
      console.log(`✅ Render 唤醒成功, 响应: ${text}`);
    } catch (error) {
      console.error("❌ 敲门唤醒失败:", error);
    }
  },
};
