const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveredirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js")

router.route("/signup")
.get(userController.renderSignupPage)
.post(wrapAsync(userController.signupNewUser));

router.route("/login")
.get(userController.renderLoginPage)
.post(saveredirectUrl, passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }), userController.loginUser);

router.get("/logout", userController.logoutUser);

module.exports = router;