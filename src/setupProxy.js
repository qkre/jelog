const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://118.67.132.220:8080", // 서버 URL or localhost:포트번호
      changeOrigin: true,
    })
  );
};
