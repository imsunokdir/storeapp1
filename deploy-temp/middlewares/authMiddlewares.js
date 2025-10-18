const jwt = require("jsonwebtoken");

const authMiddlewares = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  next();
};

module.exports = authMiddlewares;
