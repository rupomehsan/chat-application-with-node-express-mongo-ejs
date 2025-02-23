// external imports
const express = require("express");

// internal imports
const {
  createPost,
  getAllPosts,
  removePost,
} = require("../controller/postController");
const {
  addPostValidators,
  addPostValidationHandler,
} = require("../middlewares/post/postValidators");

const { checkLogin, requireRole } = require("../middlewares/common/checkLogin");

const router = express.Router();

// add post
router.post(
  "/",
  checkLogin,
  addPostValidators,
  addPostValidationHandler,
  createPost
);
router.get("/", checkLogin, getAllPosts);

// remove post

module.exports = router;
