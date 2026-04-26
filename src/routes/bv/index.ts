import { BiliService } from "@/services/bili";
import { createRouter } from "@/core/factory";

const router = createRouter();

router.get("/:bvid", async (c) => {
  try {
    const { bvid } = c.req.param();

    const bili = new BiliService(
      c.env.BILI_PROXY,
      c.env.PROXY_TOKEN,
      c.env.BILI_COOKIE,
    );

    const cid = await bili.getVideoCid(bvid);
    const url = await bili.getVideoPlayUrl(bvid, cid);

    return c.json({
      code: 0,
      message: "success",
      data: { url },
    });
  } catch (error: any) {
    console.error("解析视频失败:", error.message);
    return c.json(
      {
        code: -1,
        message: error.message || "解析失败，请检查 BV 号或稍后重试",
      },
      500,
    );
  }
});

export default router;
