// external imports
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const imageUploader = require("../utilities/Imageuploader");
// internal imports
const User = require("../models/People");

// get login page
function getLogin(req, res, next) {
  res.render("auth/login");
}

// do login
async function login(req, res, next) {
  try {
    // find a user who has this email/name
    const user = await User.findOne({
      $or: [{ email: req.body.email }, { mobile: req.body.mobile }],
    });

    if (user && user._id) {
      const isValidPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (isValidPassword) {
        // prepare the user object to generate token
        const userObject = {
          userid: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar || null,
          role: user.role || "user",
        };

        // generate token
        const token = jwt.sign(userObject, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRY,
        });

        // set cookie
        res.cookie(process.env.COOKIE_NAME, token, {
          maxAge: process.env.JWT_EXPIRY,
          httpOnly: true,
          signed: true,
        });

        // set logged in user local identifier
        res.locals.loggedInUser = userObject;

        res.status(200).json({
          status: "success",
          message: "Your are logged in!",
        });
      } else {
        throw createError("Login failed! Please try again.");
      }
    } else {
      throw createError("Login failed! Please try again.");
    }
  } catch (err) {
    console.log("custom err", err);

    res.status(500).json({
      errors: {
        common: {
          msg: "Unknown error occured!",
        },
      },
    });
  }
}
async function register(req, res, next) {
  // console.log("aa", req);

  let newUser;
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  if (req.files) {
    const path = await imageUploader(req.files.avatar, "avatars");

    newUser = new User({
      ...req.body,
      avatar: path,
      password: hashedPassword,
    });
  } else {
    newUser = new User({
      ...req.body,
      password: hashedPassword,
    });
  }

  console.log("newUser", newUser);

  // save user or send error
  try {
    const user = await newUser.save();
    console.log("user", user);

    const userObject = {
      userid: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar || null,
      role: user.role || "user",
    };

    // generate token
    const token = jwt.sign(userObject, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY,
    });

    // set cookie
    res.cookie(process.env.COOKIE_NAME, token, {
      maxAge: process.env.JWT_EXPIRY,
      httpOnly: true,
      signed: true,
    });
    res.status(200).json({
      status: "success",
      message: "Your are successfully registered, automatically logged in!",
    });
  } catch (err) {
    console.log("custom err", err);

    res.status(500).json({
      errors: {
        common: {
          msg: "Unknown error occured!",
        },
      },
    });
  }
}

// do logout
function logout(req, res) {
  res.clearCookie(process.env.COOKIE_NAME);
  res.send("logged out");
}

module.exports = {
  getLogin,
  login,
  register,
  logout,
};
