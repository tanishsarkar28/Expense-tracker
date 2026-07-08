/**
 * Global error handler middleware.
 * Catches errors thrown anywhere in the app and returns a structured JSON response.
 */
function errorHandler(err, req, res, next) {
  console.error("❌ Error:", err.message || err);

  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({
    error: true,
    status,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
}

module.exports = errorHandler;
