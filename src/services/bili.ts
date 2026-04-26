import ky from "ky";

// B站接口通用的响应结构
interface BiliResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

export class BiliService {
  private api: typeof ky;

  constructor(prefix: string, token: string, cookie?: string) {
    this.api = ky.create({
      // prefix: "https://api.bilibili.com",
      prefix,
      headers: {
        "x-proxy-token": token,
        // 动态注入 Cookie
        ...(cookie ? { Cookie: cookie } : {}),
      },
    });
  }

  async getVideoCid(bvid: string): Promise<number> {
    const res = await this.api
      .get("x/player/pagelist", {
        searchParams: { bvid },
      })
      .json<BiliResponse<{ cid: number }[]>>();

    if (res.code !== 0) {
      throw new Error(`获取视频信息失败: ${res.message} (代码: ${res.code})`);
    }

    // return res.data.cid;
    return res.data[0].cid;
  }

  async getVideoPlayUrl(bvid: string, cid: number): Promise<string> {
    const res = await this.api
      .get("x/player/playurl", {
        searchParams: {
          bvid,
          cid,
          qn: 80,
          fnval: 1,
          platform: "html5", // 无需referer鉴权
          high_quality: 1,
        },
      })
      .json<
        BiliResponse<{
          durl: {
            length: number;
            size: number;
            url: string;
          }[];
        }>
      >();

    if (res.code !== 0) {
      throw new Error(`获取直链失败: ${res.message} (代码: ${res.code})`);
    }

    let url = res.data.durl[0].url;
    /** 替换为国内CDN */
    const upgcxcodeRegex = /(https?:\/\/)(.*?)(\/upgcxcode\/)/;
    if (upgcxcodeRegex.test(url)) {
      url = url.replace(
        upgcxcodeRegex,
        "https://upos-sz-mirrorali.bilivideo.com/upgcxcode/",
      );
    }

    return url;
  }
}
