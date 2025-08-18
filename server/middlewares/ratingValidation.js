const { body } = require("express-validator");

const ratingValidation = [
  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
];

module.exports = ratingValidation;
