const express = require("express");
const {
  signup,
  listStores,
  submitRating,
  updatePassword,
  getUserRating,
} = require("../controller/user.controller");
const { userValidation } = require("../middlewares/userValidation");
const authMiddlewares = require("../middlewares/authMiddlewares");
const roleMiddlewares = require("../middlewares/roleMiddlewares");
const ratingValidation = require("../middlewares/ratingValidation");
const { passwordValidation } = require("../middlewares/passwordValidation");

const userRouter = express.Router();

userRouter.post("/signup", userValidation, signup);
userRouter.get(
  "/stores",
  authMiddlewares,
  //   roleMiddlewares("normal_user"),
  listStores
);

userRouter.post(
  "/stores/:storeId/rate",
  authMiddlewares,
  roleMiddlewares("normal_user"),
  ratingValidation,
  submitRating
);

userRouter.get("/rating", getUserRating);

userRouter.put(
  "/update-password",
  authMiddlewares,
  roleMiddlewares("normal_user"),
  passwordValidation,
  updatePassword
);

module.exports = userRouter;
