const express = require("express");

const router = express.Router();

const {
  getInbox,
  searchUser,
  addConversation,
  getMessages,
  sendMessage,
} = require("../controller/inboxController");
const decorateHtmlResponse = require("../middlewares/common/decorateHtml");
const attachmentUpload = require("../middlewares/inbox/attachmentUpload");

const { checkLogin } = require("../middlewares/common/checkLogin");
//inbox page
router.get("/", decorateHtmlResponse("Inbox"), checkLogin, getInbox);
// search user for conversation
router.post("/search", checkLogin, searchUser);
// add conversation
router.post("/conversation", checkLogin, addConversation);

// get messages of a conversation
router.get("/messages/:conversation_id", checkLogin, getMessages);

// send message
router.post("/message", checkLogin, attachmentUpload, sendMessage);

module.exports = router;
