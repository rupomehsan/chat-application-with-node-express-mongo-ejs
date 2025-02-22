// external imports
const express = require("express");

// internal imports
const {
  getLogin,
  login,
  register,
  logout,
} = require("../controller/loginController");
const decorateHtmlResponse = require("../middlewares/common/decorateHtmlResponse");
const {
  doLoginValidators,
  doLoginValidationHandler,
  doRegisterValidators,
  doRegisterValidationHandler,
} = require("../middlewares/login/loginValidators");

const { redirectLoggedIn } = require("../middlewares/common/checkLogin");

const router = express.Router();

// set page title
const page_title = "Login";

// login page
router.get(
  "/login",
  decorateHtmlResponse(page_title),
  redirectLoggedIn,
  getLogin
);

// process login
router.post("/signin", doLoginValidators, doLoginValidationHandler, login);
router.post(
  "/signup",
  // doRegisterValidators,
  // doRegisterValidationHandler,
  register
);

// logout
router.delete("/logout", logout);

module.exports = router;
