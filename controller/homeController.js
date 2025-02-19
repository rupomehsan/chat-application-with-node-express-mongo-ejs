// external imports

// internal imports

// get login page
function getHomePage(req, res, next) {
  res.render("home");
}

module.exports = {
  getHomePage,
};
