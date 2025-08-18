const express = require("express");
const {
  createUser,
  createStore,
  getDashboardStats,
  listUsers,
  listStores,
} = require("../controller/admin.controller");
const authMiddlewares = require("../middlewares/authMiddlewares");
const roleMiddlewares = require("../middlewares/roleMiddlewares");
const { userValidation } = require("../middlewares/userValidation");
const storeValidation = require("../middlewares/storeValidation");
const { updatePassword } = require("../controller/user.controller");

const adminRouter = express.Router();

adminRouter.post(
  "/create-user",
  // authMiddlewares,
  // roleMiddlewares("admin", "normal_user"),
  userValidation,
  createUser
);

adminRouter.post(
  "/create-store",
  authMiddlewares,
  roleMiddlewares("admin"),
  storeValidation,
  createStore
);

adminRouter.get(
  "/dashboard",
  authMiddlewares,
  roleMiddlewares("admin"),
  getDashboardStats
);

adminRouter.get("/users", authMiddlewares, roleMiddlewares("admin"), listUsers);
adminRouter.get(
  "/stores",
  authMiddlewares,
  roleMiddlewares("admin", "normal_user"),
  listStores
);

adminRouter.put(
  "/update-password",
  authMiddlewares,
  roleMiddlewares("store_owner"),
  updatePassword
);
module.exports = adminRouter;
