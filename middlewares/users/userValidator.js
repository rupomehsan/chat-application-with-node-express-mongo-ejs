const { check, validationResult } = require("express-validator");
const createError = require("http-errors");
const User = require("../../models/People");
const { unlink } = require("fs");
const addUserValidators = [
  check("name")
    .isLength({ min: 1 })
    .withMessage("Name is required")
    .isAlpha("en-US", { ignore: " -" })
    .withMessage("Name must be alphabetic")
    .trim(),

  check("email")
    .isEmail()
    .withMessage("Email must be valid")
    .trim()
    .custom(async (value) => {
      try {
        const user = await User.findOne({ email: value });
        if (user) {
          return Promise.reject("E-mail already in use");
        }
      } catch (err) {
        console.log(err);
      }
    }),

  check("mobile")
    .isMobilePhone("bn-BD")
    .withMessage("Mobile number is not valid")
    .trim()
    .custom(async (value) => {
      try {
        const user = await User.findOne({ mobile: value });
        if (user) {
          return Promise.reject("Mobile number already in use");
        }
      } catch (err) {
        console.log(err);
      }
    }),

  check("password")
    .isStrongPassword()
    .withMessage(
      "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character"
    ),
];

const addUserValidationHandler = (req, res, next) => {
  const errors = validationResult(req);
  const mappedErrors = errors.mapped();

  console.log("mappedErrors", mappedErrors);

  if (Object.keys(mappedErrors).length === 0) {
    next();
  } else {
    if (req.files.length > 0) {
      const { filename } = req.files[0];
      unlink(
        path.join(__dirname, "../public/uploads/avatars/", filename),
        (err) => {
          if (err) {
            console.log(err);
          }
        }
      );
    }

    res.status(500).json({
      errors: mappedErrors,
    });
  }
};

module.exports = { addUserValidators, addUserValidationHandler };
