const express = require("express");

const router = express.Router();

const { getLoginPage } = require("../controller/loginController");

const decorateHtmlResponse = require("../middlewares/common/decorateHtml");

//login page
router.get("/", decorateHtmlResponse("Login"), getLoginPage);

module.exports = router;
