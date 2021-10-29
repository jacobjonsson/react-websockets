const express = require("express");
const next = require("next");
const { createProxyMiddleware } = require("http-proxy-middleware");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });

const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();

    server.use(
      "/api",
      createProxyMiddleware({
        target: "http://localhost:3001",
        changeOrigin: true,
        ws: true,
        logLevel: "info",
        onClose() {
          console.log(`[INFO]: Proxy closed`);
        },
        onError(err, req, res) {
          console.group(
            `[ERROR]: Caught an error while proxying to ${proxyTarget}${req.url}`
          );
          console.error(err);
          console.groupEnd();

          res.end();
        },
        onProxyReq(proxy, req) {
          console.log(
            `[INFO]: Proyxing ${proxy.path} to ${proxyTarget}${req.url}`
          );
        },
        onProxyReqWs(proxy, req) {
          console.log(
            `[INFO]: Proyxing websocket ${proxy.path} to ${proxyTarget}${
              req.url
            }. connection: ${proxy.getHeader("connection")}`
          );
        },
        onProxyRes(proxyRes, req) {
          console.log(
            `[INFO]: Responding with ${proxyRes.statusCode} for ${proxyTarget}${req.url}. correlation-id: ${proxyRes.headers["x-correlation-id"]}`
          );
        },
      })
    );

    // Default catch-all handler to allow Next.js to handle all other routes
    server.all("*", (req, res) => handle(req, res));

    server.listen(port, (err) => {
      if (err) {
        throw err;
      }
      console.log(`[INFO]: Ready on port ${port}`);
    });
  })
  .catch((err) => {
    console.log("[ERROR]: An error occurred, unable to start the server");
    console.log(err);
  });
