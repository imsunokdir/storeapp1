const { body } = require("express-validator");

const userValidation = [
  body("name")
    .isLength({ min: 20, max: 60 })
    .withMessage("Name must be between 20 and 60 characters"),

  body("email").isEmail().withMessage("Must be a valid email address"),

  body("password")
    .isLength({ min: 8, max: 16 })
    .withMessage("Password must be 8 to 16 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password must include at least one uppercase letter")
    .matches(/[\W_]/)
    .withMessage("Password must include at least one special character"),

  body("address")
    .isLength({ max: 400 })
    .withMessage("Address cannot exceed 400 characters"),

  body("role")
    .optional()
    .isIn(["admin", "normal_user", "store_owner"])
    .withMessage("Role must be one of admin, normal_user or store_owner"),
];

module.exports = { userValidation };
