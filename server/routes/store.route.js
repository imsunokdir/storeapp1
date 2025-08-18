const express = require("express");
const authMiddlewares = require("../middlewares/authMiddlewares");
const roleMiddlewares = require("../middlewares/roleMiddlewares");
const {
  getUsersWhoRated,
  getStoreOwnerStores,
  getStoreDashboardData,
  getStoreRaters,
  getStoreDetails,
  getAverageRatingOfUserStores,
  getStoreRatingDetails,
} = require("../controller/store.controller");
const { updatePassword } = require("../controller/user.controller");
const {
  passwordValidation,
  passwordUpdateValidation,
} = require("../middlewares/passwordValidation");
const validateRequest = require("../middlewares/validateRequest");
const storeRouter = express.Router();

storeRouter.get(
  "/users-rated",
  authMiddlewares,
  roleMiddlewares("store_owner"),
  getUsersWhoRated
);

storeRouter.get(
  "/average-rating",
  // authMiddlewares,
  // roleMiddlewares("store_owner"),
  getAverageRatingOfUserStores
);

storeRouter.get(
  "/my-stores",
  authMiddlewares,
  roleMiddlewares("store_owner"),
  getStoreOwnerStores
);

storeRouter.get(
  "/dashboard",
  authMiddlewares,
  roleMiddlewares("store_owner"),
  getStoreDashboardData
);

storeRouter.get(
  "/:storeId/raters",
  authMiddlewares,
  roleMiddlewares("store_owner"),
  getStoreRaters
);

storeRouter.put(
  "/update-password",
  authMiddlewares,
  roleMiddlewares("store_owner", "normal_user"),
  // passwordValidation("newPassword"),
  passwordUpdateValidation,
  validateRequest,
  updatePassword
);

storeRouter.get(
  "/store-details/:storeId",
  // authMiddlewares,
  // roleMiddlewares("store_owner"),
  getStoreDetails
);

storeRouter.get("/rating-details/:storeId", getStoreRatingDetails);
module.exports = storeRouter;
