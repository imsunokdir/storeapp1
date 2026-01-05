const express = require("express");
const cors = require("cors");
const { sequelize, User } = require("./tables");
require("dotenv").config();
const sessionMiddleware = require("./configs/session");

const bcrypt = require("bcryptjs");

const authRoutes = require("./routes/auth.route");
const adminRouter = require("./routes/admin.route");
const userRouter = require("./routes/user.route");
const storeRouter = require("./routes/store.route");
const healthRouter = require("./routes/health.route");

const app = express();

// ---- Middleware ----
const allowedOrigins = process.env.CORS_ORIGIN.split(",").map((o) =>
  o.trim().replace(/\/$/, "")
); // removes trailing slash

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      const normalizedOrigin = origin.replace(/\/$/, "");
      if (allowedOrigins.includes(normalizedOrigin)) {
        callback(null, true);
      } else {
        console.error("❌ CORS blocked origin:", origin);
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessionMiddleware);

// ---- Routes ----
app.use("/auth", authRoutes);
app.use("/admin", adminRouter);
app.use("/user", userRouter);
app.use("/store", storeRouter);
app.use("/health", healthRouter);
// ---- DB Connection Test ----
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully.");

    await sequelize.sync({ alter: true });
    console.log("✅ Database synced.");

    // Optional: seed admin user if not exists
    const password = "admin123";
    const hashedPassword = await bcrypt.hash(password, 10);
    // await User.findOrCreate({
    //   where: { email: "admin@storeapp.com" },
    //   defaults: {
    //     name: "System Admin  System Admin",
    //     email: "admin@storeapp.com",
    //     password: hashedPassword,
    //     role: "admin",
    //     address: "root",
    //   },
    // });

    // Start server only after DB is ready
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 3000}`);
    });
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
    process.exit(1); // Exit if DB connection fails
  }
})();
