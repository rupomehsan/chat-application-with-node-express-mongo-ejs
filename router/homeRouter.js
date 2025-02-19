// external imports
const express = require("express");

// internal imports
const { getHomePage } = require("../controller/homeController");
const decorateHtmlResponse = require("../middlewares/common/decorateHtmlResponse");
const { checkLogin } = require("../middlewares/common/checkLogin");

const router = express.Router();

// set page title
const page_title = "Welcome to Chat Application";

// login page
router.get("/", decorateHtmlResponse(page_title), checkLogin, getHomePage);

module.exports = router;
