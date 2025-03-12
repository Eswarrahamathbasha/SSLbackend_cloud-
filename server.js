const express = require("express");
const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db"); // Import database connection function

// Load environment variables
dotenv.config();

const app = express();

// Enable CORS with enhanced configuration
app.use(
  cors({
    origin: [
      "https://frontend-s-sl-cloud.vercel.app",
      "https://userportal-five.vercel.app",
      "https://adminportal-wine.vercel.app",
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "http://localhost:3003"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Handle preflight requests for all routes
app.options("*", cors());

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware for request details
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log("Headers:", req.headers);
  next();
});

// Load SSL certificates
const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, "private_key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "certificate.pem")),
};

// Route imports
const userRoutes = require("./routes/userRoutes");
const webAppRoutes = require("./routes/webAppRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const organizationRoutes = require("./routes/organizationRoutes");
const projectRoutes = require("./routes/projectRoutes");
const addUserRoutes = require("./routes/addUserRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const hubIngestRoutes = require("./routes/hubingestroutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const dataStoreRoutes = require("./routes/dataStoreRoutes");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");
const deploymentRoutes = require("./routes/deploymentRoutes");
const taskRoutes = require("./routes/taskRoutes");
const deploymentCircleRoutes = require("./routes/deploymentCircleRouter");
const supportRoutes = require("./routes/supportRoutes");
const dataRoutes = require("./routes/dataRoutes");

// Initialize database and start server
const initializeServer = async () => {
  try {
    // Connect to the database
    await connectDB();
    console.log("✅ Database connected successfully.");

    // Register API routes
    app.use("/api/user", userRoutes);
    app.use("/api/webapp", webAppRoutes);
    app.use("/api/payment", paymentRoutes);
    app.use("/api/org", organizationRoutes);
    app.use("/api/proj", projectRoutes);
    app.use("/api/add-user", addUserRoutes);
    app.use("/api", serviceRoutes);
    app.use("/api/hubingest", hubIngestRoutes);
    app.use("/api/subscriptions", subscriptionRoutes);
    app.use("/api/notifications", notificationRoutes);
    app.use("/api/datastore", dataStoreRoutes);
    app.use("/api/admin", adminRoutes);
    app.use("/api/auth", authRoutes);
    app.use("/api/deployments", deploymentRoutes);
    app.use("/api/tasks", taskRoutes);
    app.use("/api/deploymentCircles", deploymentCircleRoutes);
    app.use("/api/support", supportRoutes);
    app.use("/api/data", dataRoutes);

    // Health check route
    app.get("/", (req, res) => {
      res.status(200).send("Server is deployed and running successfully.");
    });

    // Handle undefined routes
    app.use((req, res, next) => {
      res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.url}`,
      });
    });

    // Global error handler
    app.use((err, req, res, next) => {
      console.error("Global error handler triggered:", err);
      res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
      });
    });

    // Start HTTP Server
    http.createServer(app).listen(process.env.PORT, () => {
      console.log(`✅ HTTP Server running at http://localhost:3000`);
    });

    // Start HTTPS Server (Only if SSL files exist)
    if (fs.existsSync("private_key.pem") && fs.existsSync("certificate.pem")) {
      https.createServer(sslOptions, app).listen(5003, () => {
        console.log(`✅ HTTPS Server running at https://localhost:3000`);
      });
    } else {
      console.log("⚠️ SSL certificates not found. HTTPS not started.");
    }
  } catch (error) {
    console.error("❌ Failed to initialize server:", error.message);
    process.exit(1);
  }
};

// Initialize the server
initializeServer();
