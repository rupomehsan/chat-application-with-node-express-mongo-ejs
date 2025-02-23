// external imports
const { check, validationResult } = require("express-validator");
const createError = require("http-errors");
const path = require("path");
const { unlink } = require("fs");

// internal imports
const User = require("../../models/Post");

// add user
const addPostValidators = [
  check("description")
    .isLength({ min: 1 })
    .withMessage("Description is required")
    .trim(),
];

const addPostValidationHandler = function (req, res, next) {
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
  addPostValidators,
  addPostValidationHandler,
};
