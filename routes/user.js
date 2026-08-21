const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { isLoggedIn, saveRedirectUrl } = require("../middleware");
router.get("/signup", (req, res) => {
    res.render("./users/signup.ejs");
})

router.post("/signup", async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const newUser = new User({ email, username });
        await User.register(newUser, password);
        req.login(newUser, (err) => {
            if (err) { return next(err); }
            req.flash("success", `${username} registered successfully`);
            res.redirect("/listings");
        })

    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }

})

router.get("/login", (req, res) => {
    if (req.isAuthenticated()) {
        req.flash("success", "You are already logged in !");
        return res.redirect("/listings");
    }
    res.render("users/login.ejs");
})

router.post("/login", saveRedirectUrl, passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), async (req, res) => {
    req.flash("success", `Welcome back ${req.body.username}`);
    
    res.redirect(res.locals.redirectUrl ||"/listings" );
})

router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }

        req.flash("success", "You logged out successfully");
        res.redirect("/listings");
    });
});


module.exports = router;