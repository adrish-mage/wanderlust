const express = require("express");
const router = express.Router({ mergeParams: true });
const passport = require("passport");

const { saveRedirectUrl } = require("../middleware");
const userController = require("../controllers/user.js");

router.get("/signup", userController.renderSignupForm);
router.post("/signup", userController.signup);
router.get("/login", userController.renderLoginForm);
router.post(
    "/login",
    saveRedirectUrl,
    passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),
    userController.login
);
router.get("/logout", userController.logout);

module.exports = router;
