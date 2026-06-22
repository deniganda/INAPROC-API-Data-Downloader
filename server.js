const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

const HOST = "127.0.0.1";
const PORT = Number(process.env.PORT || 3000);
const ROOT = __dirname;
const ALLOWED_HOST = "data.inaproc.id";

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon"
};

function send(res, statusCode, body, headers = {}) {
  res.writeHead(statusCode, headers);
  res.end(body);
}

function setCorsHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
}

function safeJoin(root, requestPath) {
  const normalized = path.normalize(requestPath).replace(/^(\.\.[/\\])+/, "");
  return path.join(root, normalized);
}

function isAllowedApiUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" && parsed.hostname === ALLOWED_HOST;
  } catch {
    return false;
  }
}

async function handleProxy(req, res, requestUrl) {
  setCorsHeaders(res);

  if (req.method === "OPTIONS") {
    send(res, 204, "");
    return;
  }

  if (req.method !== "GET") {
    send(res, 405, JSON.stringify({ error: "Method not allowed" }), {
      "Content-Type": "application/json; charset=utf-8"
    });
    return;
  }

  const target = requestUrl.searchParams.get("target");
  if (!target || !isAllowedApiUrl(target)) {
    send(res, 400, JSON.stringify({ error: "Invalid target URL" }), {
      "Content-Type": "application/json; charset=utf-8"
    });
    return;
  }

  const upstreamHeaders = {};
  const authHeader = req.headers.authorization;
  if (typeof authHeader === "string" && authHeader.trim()) {
    upstreamHeaders.Authorization = authHeader;
  }

  try {
    const upstreamRes = await fetch(target, {
      method: "GET",
      headers: upstreamHeaders
    });
    const bodyText = await upstreamRes.text();
    const contentType = upstreamRes.headers.get("content-type") || "application/json; charset=utf-8";

    send(res, upstreamRes.status, bodyText, {
      "Content-Type": contentType
    });
  } catch (error) {
    send(res, 502, JSON.stringify({
      error: "Proxy request failed",
      detail: error instanceof Error ? error.message : String(error)
    }), {
      "Content-Type": "application/json; charset=utf-8"
    });
  }
}

function handleStatic(req, res, requestUrl) {
  const pathname = requestUrl.pathname === "/" ? "/index.html" : requestUrl.pathname;
  const filePath = safeJoin(ROOT, pathname);

  if (!filePath.startsWith(ROOT)) {
    send(res, 403, "Forbidden", { "Content-Type": "text/plain; charset=utf-8" });
    return;
  }

  fs.stat(filePath, (statErr, stats) => {
    if (statErr || !stats.isFile()) {
      send(res, 404, "Not found", { "Content-Type": "text/plain; charset=utf-8" });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": contentType });
    fs.createReadStream(filePath).pipe(res);
  });
}

const server = http.createServer((req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host || `${HOST}:${PORT}`}`);

  if (requestUrl.pathname === "/proxy") {
    handleProxy(req, res, requestUrl);
    return;
  }

  handleStatic(req, res, requestUrl);
});

server.listen(PORT, HOST, () => {
  console.log(`INAPROC downloader server running at http://${HOST}:${PORT}`);
});
