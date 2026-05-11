const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const PORT = 3000;
const ROOT = __dirname;
const MSG_DIR = path.join(ROOT, '讯息');

if (!fs.existsSync(MSG_DIR)) fs.mkdirSync(MSG_DIR, { recursive: true });

const MIME = {
  '.html': 'text/html;charset=utf-8',
  '.css': 'text/css;charset=utf-8',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.ttf': 'font/ttf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function serveStatic(res, filePath) {
  const ext = path.extname(filePath);
  const contentType = MIME[ext] || 'application/octet-stream';
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain;charset=utf-8' });
      res.end('404 Not Found');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;

  // CORS for same-origin
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // API: save message
  if (req.method === 'POST' && pathname === '/api/message') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { name, email, content } = JSON.parse(body);
        if (!name || !email || !content) {
          res.writeHead(400, { 'Content-Type': 'application/json;charset=utf-8' });
          res.end(JSON.stringify({ error: '缺少必填字段' }));
          return;
        }

        // Sanitize filename
        const safeName = name.replace(/[<>:"/\\|?*]/g, '').trim();
        const safeEmail = email.replace(/[<>:"/\\|?*]/g, '').trim();
        const fileName = `${safeName}-${safeEmail}.md`;
        const filePath = path.join(MSG_DIR, fileName);

        const now = new Date();
        const timestamp = now.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
        const content_md = [
          `# 留言`,
          ``,
          `- **姓名**: ${name}`,
          `- **邮箱**: ${email}`,
          `- **时间**: ${timestamp}`,
          ``,
          `---`,
          ``,
          content,
          ``,
        ].join('\n');

        fs.writeFile(filePath, content_md, 'utf-8', err => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json;charset=utf-8' });
            res.end(JSON.stringify({ error: '保存失败' }));
            return;
          }
          res.writeHead(200, { 'Content-Type': 'application/json;charset=utf-8' });
          res.end(JSON.stringify({ success: true, file: fileName }));
        });
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json;charset=utf-8' });
        res.end(JSON.stringify({ error: '无效的请求数据' }));
      }
    });
    return;
  }

  // Static files
  let filePath = path.join(ROOT, pathname === '/' ? 'portfolio.html' : pathname);
  serveStatic(res, filePath);
});

server.listen(PORT, () => {
  console.log(`🌐 服务运行在 http://localhost:${PORT}`);
  console.log(`📁 留言保存至: ${MSG_DIR}`);
});
