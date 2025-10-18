const { body } = require("express-validator");

const storeValidation = [
  body("name").isLength({ min: 1 }),
  body("email").isEmail(),
  body("address").isLength({ max: 400 }),
  body("owner_id").isInt(),
];

module.exports = storeValidation;
