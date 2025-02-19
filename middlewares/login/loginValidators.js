const { check, validationResult } = require("express-validator");
// internal imports
const User = require("../../models/People");
const createError = require("http-errors");

const doLoginValidators = [
  check("email").isLength({ min: 1 }).withMessage(" Email is required"),

  check("password").isLength({ min: 1 }).withMessage("Password is required"),
];
const doRegisterValidators = [
  check("name").isLength({ min: 1 }).withMessage("name is required"),
  check("email")
    .isEmail()
    .withMessage("Invalid email address")
    .trim()
    .custom(async (value) => {
      try {
        const user = await User.findOne({ email: value });
        if (user) {
          throw createError("Email already is use!");
        }
      } catch (err) {
        throw createError(err.message);
      }
    }),
  check("mobile").isLength({ min: 1 }).withMessage("Mobile number is required"),
  check("password").isLength({ min: 8 }).withMessage("Password is required"),
];

const doLoginValidationHandler = function (req, res, next) {
  const errors = validationResult(req);
  const mappedErrors = errors.mapped();
  if (Object.keys(mappedErrors).length === 0) {
    next();
  } else {
    res.status(500).json({
      errors: mappedErrors,
    });
  }
};
const doRegisterValidationHandler = function (req, res, next) {
  const errors = validationResult(req);
  const mappedErrors = errors.mapped();
  if (Object.keys(mappedErrors).length === 0) {
    next();
  } else {
    res.status(500).json({
      errors: mappedErrors,
    });
  }
};

module.exports = {
  doLoginValidators,
  doLoginValidationHandler,
  doRegisterValidators,
  doRegisterValidationHandler,
};
