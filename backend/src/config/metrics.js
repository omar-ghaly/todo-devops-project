const client = require("prom-client");

// Collect default Node.js metrics (CPU, memory, event loop, etc.)
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ prefix: "todo_backend_" });

// Custom metric: HTTP request counter
const httpRequestCounter = new client.Counter({
  name: "todo_backend_http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
});

// Custom metric: HTTP request duration histogram
const httpRequestDuration = new client.Histogram({
  name: "todo_backend_http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.05, 0.1, 0.3, 0.5, 1, 2, 5],
});

// Middleware to record metrics for every request
const metricsMiddleware = (req, res, next) => {
  const start = process.hrtime();

  res.on("finish", () => {
    const diff = process.hrtime(start);
    const durationInSeconds = diff[0] + diff[1] / 1e9;

    // Use route pattern if available, fallback to path
    const route = req.route ? req.baseUrl + req.route.path : req.path;

    httpRequestCounter.inc({
      method: req.method,
      route,
      status_code: res.statusCode,
    });

    httpRequestDuration.observe(
      {
        method: req.method,
        route,
        status_code: res.statusCode,
      },
      durationInSeconds
    );
  });

  next();
};

module.exports = {
  register: client.register,
  metricsMiddleware,
};
