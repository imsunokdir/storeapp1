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
  proxy: true,
  cookie: {
    secure: process.env.NODE_ENV === "production", // true in prod (HTTPS), false in dev (HTTP)
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // 'none' with secure=true for cross-site cookies in prod, else lax in dev
    httpOnly: true,
  },
});
