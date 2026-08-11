const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3000;

// Simple UI for submitting URLs when accessing the root route directly
app.get('/', (req, res, next) => {
  const targetUrl = req.query.url;
  if (!targetUrl) {
    return res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Node Proxy</title>
        <style>
          body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #121212; color: #fff; }
          .card { background: #1e1e1e; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.5); text-align: center; max-width: 400px; width: 100%; }
          input { width: 100%; padding: 10px; margin: 10px 0; border-radius: 4px; border: 1px solid #333; box-sizing: border-box; }
          button { width: 100%; padding: 10px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
          button:hover { background: #0056b3; }
        </style>
      </head>
      <body>
        <div class="card">
          <h2>Web Proxy</h2>
          <form action="/" method="GET">
            <input type="text" name="url" placeholder="https://example.com" required />
            <button type="submit">Go</button>
          </form>
        </div>
      </body>
      </html>
    `);
  }
  next();
});

// Middleware to forward requests to the target destination
app.use('/', (req, res, next) => {
  const target = req.query.url;
  if (!target) return next();

  let formattedTarget = target;
  if (!/^https?:\/\//i.test(formattedTarget)) {
    formattedTarget = 'https://' + formattedTarget;
  }

  createProxyMiddleware({
    target: formattedTarget,
    changeOrigin: true,
    ws: true,
    router: () => formattedTarget,
    onProxyRes: (proxyRes) => {
      // Strips frame restrictions to allow loading within proxy view
      delete proxyRes.headers['x-frame-options'];
      delete proxyRes.headers['content-security-policy'];
    },
    onError: (err, req, res) => {
      res.status(500).send('Proxy Error: Unable to reach destination.');
    }
  })(req, res, next);
});

app.listen(PORT, () => {
  console.log(`Proxy server listening on port ${PORT}`);
});
