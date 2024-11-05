const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8082',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '/boot'
      },
      cookieDomainRewrite: '',  // 쿠키 도메인 재작성
      onProxyRes: function(proxyRes, req, res) {
        // Set-Cookie 헤더 수정
        if (proxyRes.headers['set-cookie']) {
          proxyRes.headers['set-cookie'] = proxyRes.headers['set-cookie'].map(cookie =>
            cookie.replace(/Domain=[^;]+;/, '')
              .replace(/Path=[^;]+;/, 'Path=/;')
          );
        }
      },
      onProxyReq: (proxyReq, req, res) => {
        console.log('Proxy Request:', req.method, req.url);
      }
    })
  );
};