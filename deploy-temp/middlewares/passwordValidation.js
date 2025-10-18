const { body } = require("express-validator");

const passwordValidation = body("password")
  .isLength({ min: 8, max: 16 })
  .withMessage("Password must be between 8 and 16 characters")
  .matches(/[A-Z]/)
  .withMessage("Password must contain at least one uppercase letter")
  .matches(/[^A-Za-z0-9]/)
  .withMessage("Password must contain at least one special character");
const passwordUpdateValidation = body("newPassword")
  .isLength({ min: 8, max: 16 })
  .withMessage("Password must be between 8 and 16 characters")
  .matches(/[A-Z]/)
  .withMessage("Password must contain at least one uppercase letter")
  .matches(/[^A-Za-z0-9]/)
  .withMessage("Password must contain at least one special character");

module.exports = { passwordValidation, passwordUpdateValidation };
