import { createRouter } from "@/core/factory";

const router = createRouter();

router.get("/", (c) => {
  return c.text("(づ｡◕‿‿◕｡)づ	哇呜！又是美好的一天✌");
});

export default router;
