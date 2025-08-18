const session = require("express-session");
const sequelize = require("./db");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
require("dotenv").config();

const sessionStore = new SequelizeStore({
  db: sequelize,
});

sessionStore.sync();

const isProduction = process.env.NODE_ENV === "production";

module.exports = session({
  secret: process.env.SESSION_SECRET,
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true, // MUST be true for cross-origin in production
    maxAge: 1000 * 60 * 60 * 24,
    sameSite: "none", // MUST be 'none' for cross-origin
    httpOnly: true,
    // Don't set domain - let it default
  },
});
