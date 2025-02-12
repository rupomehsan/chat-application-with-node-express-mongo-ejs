const express = require("express");

const router = express.Router();

const { getInboxPage } = require("../controller/inboxController");
const decorateHtmlResponse = require("../middlewares/common/decorateHtml");
//login page
router.get("/", decorateHtmlResponse("Inbox"), getInboxPage);

module.exports = router;
