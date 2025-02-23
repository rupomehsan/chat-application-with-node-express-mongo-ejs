// external imports
const bcrypt = require("bcrypt");
const { unlink } = require("fs");
const path = require("path");

// internal imports
const Post = require("../models/Post");

// get users page
async function getAllPosts(req, res, next) {
  try {
    const posts = await Post.find();

    res.status(200).json({
      data: {
        posts: posts,
      },
    });
  } catch (err) {
    next(err);
  }
}

// add user
async function createPost(req, res, next) {
  let newPost;

  newPost = new Post({
    ...req.body,
    user: {
      id: req.user.userid,
      name: req.user.name,
      avatar: req.user.avatar || null,
    },
  });

  // save user or send error
  try {
    const result = await newPost.save();
    res.status(200).json({
      message: "Post added successfully!",
    });
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: "Unknown error occured!",
        },
      },
    });
  }
}

// remove user
async function removePost(req, res, next) {
  try {
    const post = await Post.findByIdAndDelete({
      _id: req.params.id,
    });

    res.status(200).json({
      message: "Post was removed successfully!",
    });
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: "Could not delete the user!",
        },
      },
    });
  }
}

module.exports = {
  getAllPosts,
  createPost,
  removePost,
};
