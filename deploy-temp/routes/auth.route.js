const express = require("express");
const { login, logout, isLoggedIn } = require("../controller/auth.controller");

const authRoutes = express.Router();

authRoutes.post("/login", login);
authRoutes.post("/logout", logout);
authRoutes.get("/isAuth", isLoggedIn);

module.exports = authRoutes;
