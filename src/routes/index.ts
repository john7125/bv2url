import { Hono } from "hono";
import homeRouter from "./home";
import bvRouter from "./bv";

const apiRouter = new Hono();

apiRouter.route("/", homeRouter);
apiRouter.route("/bv", bvRouter);

export default apiRouter;
