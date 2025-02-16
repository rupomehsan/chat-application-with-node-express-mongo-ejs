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

const { checkLogin } = require("../middlewares/common/checkLogin");

const {
  addUserValidators,
  addUserValidationHandler,
} = require("../middlewares/users/userValidator");

//user page
router.get("/", decorateHtmlResponse("Users"), checkLogin, getUsers);
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
