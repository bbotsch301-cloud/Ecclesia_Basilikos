import express, { type Request, Response, NextFunction } from "express";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import path from "path";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic } from "./vite";
import { initializeEmailTemplates } from "./initializeEmailTemplates";
import { storage } from "./storage";
import { csrfProtection } from "./csrf";
import logger from "./logger";
import { requestId } from "./requestId";

const app = express();

// Gzip/Brotli compression
app.use(compression());

// Request IDs
app.use(requestId);

// Security headers
const isDevelopment = process.env.NODE_ENV === "development";
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: isDevelopment
        ? ["'self'", "'unsafe-inline'", "localhost:*", "127.0.0.1:*"]
        : ["'self'", "https://plausible.io", "https://cdnjs.cloudflare.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
      imgSrc: ["'self'", "data:", "blob:", "https:"],
      mediaSrc: ["'self'", "https:"],
      frameSrc: ["'self'", "https://www.youtube.com", "https://www.youtube-nocookie.com", "https://player.vimeo.com"],
      connectSrc: isDevelopment
        ? ["'self'", "ws:", "wss:", "localhost:*", "127.0.0.1:*"]
        : ["'self'", "https://plausible.io"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
    },
  },
}));

// Square webhook needs raw body for signature verification - must be before express.json()
app.post(
  "/api/square/webhook",
  express.raw({ type: "application/json" }),
  async (req: Request, res: Response) => {
    try {
      const { handleWebhookEvent, isSquareEnabled } = await import("./square");
      if (!isSquareEnabled()) {
        return res.status(503).json({ error: "Square is not configured" });
      }
      const signature = req.headers["x-square-hmacsha256-signature"];
      if (!signature || typeof signature !== "string") {
        return res.status(400).json({ error: "Missing x-square-hmacsha256-signature header" });
      }
      const notificationUrl = `${process.env.BASE_URL || "http://localhost:5000"}/api/square/webhook`;
      await handleWebhookEvent(req.body.toString("utf8"), signature, notificationUrl);
      res.json({ received: true });
    } catch (error: any) {
      logger.error({ err: error }, "Square webhook error");
      res.status(400).json({ error: error.message || "Webhook processing failed" });
    }
  },
);

// Legacy Stripe webhook (kept for any in-flight Stripe payments)
app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  async (req: Request, res: Response) => {
    try {
      const { handleWebhookEvent, isStripeEnabled } = await import("./stripe");
      if (!isStripeEnabled()) {
        return res.status(503).json({ error: "Stripe is not configured" });
      }
      const signature = req.headers["stripe-signature"];
      if (!signature || typeof signature !== "string") {
        return res.status(400).json({ error: "Missing stripe-signature header" });
      }
      await handleWebhookEvent(req.body as Buffer, signature);
      res.json({ received: true });
    } catch (error: any) {
      logger.error({ err: error }, "Stripe webhook error");
      res.status(400).json({ error: error.message || "Webhook processing failed" });
    }
  },
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// CSRF protection for API routes
app.use("/api", csrfProtection);

// Prevent caching of API responses (sensitive data)
app.use("/api", (_req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

// Request logging
app.use((req, res, next) => {
  const start = Date.now();
  const reqPath = req.path;

  res.on("finish", () => {
    if (reqPath.startsWith("/api")) {
      const duration = Date.now() - start;
      logger.info({
        method: req.method,
        path: reqPath,
        status: res.statusCode,
        duration,
        requestId: req.id,
      }, `${req.method} ${reqPath} ${res.statusCode} in ${duration}ms`);
    }
  });

  next();
});

// Startup validation
if (process.env.NODE_ENV === "production" && !process.env.BASE_URL) {
  logger.warn("BASE_URL is not set. Email links and redirects may not work correctly in production.");
}

(async () => {
  const server = await registerRoutes(app);

  // Initialize email templates
  await initializeEmailTemplates();

  // Seed trust structure and document templates on startup
  try {
    await storage.seedTrustStructure();
    await storage.seedTrustDocumentTemplates();
    logger.info("Trust structure and document templates seeded (if not already present)");
  } catch (err) {
    logger.error({ err }, "Failed to seed trust data on startup");
  }

  app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    if (err instanceof SyntaxError && status === 400 && 'body' in err) {
      logger.warn({ err }, "JSON parse error");
      return res.status(400).json({ message: "Invalid JSON" });
    }

    // Structured error log with request context for observability
    logger.error({
      err,
      status,
      method: req.method,
      path: req.path,
      requestId: (req as any).id,
      userId: (req as any).user?.id || null,
      userAgent: req.get("user-agent"),
      ip: req.ip,
      stack: err.stack,
    }, `Unhandled error: ${message}`);

    res.status(status).json({ message });
  });

  // Serve resource PDFs statically (must be before Vite/SPA catch-all)
  app.use("/resources", express.static(path.resolve(import.meta.dirname, "../resources")));

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);

  server.on("error", (err: NodeJS.ErrnoException) => {
    if (err.code === "EADDRINUSE") {
      logger.warn(`Port ${port} is in use, retrying in 2 seconds...`);
      setTimeout(() => {
        server.listen({ port, host: "0.0.0.0", reusePort: true });
      }, 2000);
    } else {
      logger.fatal({ err }, "Server error");
      process.exit(1);
    }
  });

  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    logger.info(`Server listening on port ${port}`);
  });
})();
