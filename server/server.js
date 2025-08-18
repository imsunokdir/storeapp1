// const express = require("express");
// const { sequelize, User } = require("./tables");
// require("dotenv").config();
// const sessionMiddleware = require("./configs/session");
// const cors = require("cors");

// const bcrypt = require("bcryptjs");
// const authRoutes = require("./routes/auth.route");
// const adminRouter = require("./routes/admin.route");
// const userRouter = require("./routes/user.route");
// const storeRouter = require("./routes/store.route");

// const app = express();

// app.use(
//   cors({
//     origin: process.env.CORS_ORIGIN,
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization", "Accept"],
//   })
// );

// // app.options(
// //   "*",
// //   cors({
// //     origin: [process.env.CORS_ORIGIN],
// //     credentials: true,
// //   })
// // );

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(sessionMiddleware);

// app.use("/auth", authRoutes);
// app.use("/admin", adminRouter);
// app.use("/user", userRouter);
// app.use("/store", storeRouter);
// sequelize.sync({ alter: true }).then(async () => {
//   //   const password = "admin123";
//   //   const hashesPassword = await bcrypt.hash(password, 10);
//   //   await User.create({
//   //     name: "System Admin",
//   //     email: "admin@storeapp.com",
//   //     password: hashesPassword,
//   //     role: "admin",
//   //     address: "root",
//   //   });
//   console.log("Database synced");
// });

// app.listen(process.env.PORT, () => {
//   console.log(`Server running on port ${process.env.PORT}`);
// });

// ***********************************************************************
const express = require("express");
const { sequelize, User } = require("./tables");
require("dotenv").config();
const sessionMiddleware = require("./configs/session");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const authRoutes = require("./routes/auth.route");
const adminRouter = require("./routes/admin.route");
const userRouter = require("./routes/user.route");
const storeRouter = require("./routes/store.route");

const app = express();

// ---- Middleware ----
const allowedOrigins = process.env.CORS_ORIGIN.split(",");
app.use(
  cors({
    origin: allowedOrigins,
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
    app.listen(process.env.PORT || 3000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 3000}`);
    });
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
    process.exit(1); // Exit if DB connection fails
  }
})();
