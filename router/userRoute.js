const express = require("express");

const router = express.Router();

const {
  getUsers,
  addUser,
  removeUser,
  getSingelUser,
} = require("../controller/userController");
const decorateHtmlResponse = require("../middlewares/common/decorateHtml");
const avatarUpload = require("../middlewares/users/avatarUpload");

const {
  addUserValidators,
  addUserValidationHandler,
} = require("../middlewares/users/userValidator");

//user page
router.get("/", decorateHtmlResponse("Users"), getUsers);
// add user
router.post(
  "/",
  avatarUpload,
  addUserValidators,
  addUserValidationHandler,
  addUser
);

// remove user
router.delete("/:id", removeUser);
// get single user
router.get("/:id", getSingelUser);

module.exports = router;
