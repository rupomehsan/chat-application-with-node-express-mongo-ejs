// external imports
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");

// internal imports
const User = require("../models/People");

// get login page
async function getHomePage(req, res, next) {
  try {
    const userList = await User.find({ _id: { $ne: req.user.userid } });
    res.render("pages/home", { user: req.user, users: userList });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send("Server error");
  }
}

module.exports = {
  getHomePage,
};
