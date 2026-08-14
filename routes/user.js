const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
router.get("/signup", (req, res) => {
    res.render("./users/signup.ejs");
})

router.post("/signup", async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const newUser = new User({ email, username });
        await User.register(newUser, password);
        req.flash("success", `${username} registered successfully`);
        res.redirect("/listings");
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }

})

router.get("/login", (req, res) => {
    res.render("users/login.ejs");
})

router.post("/login", passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), async (req, res) => {
    req.flash("success", `Welcome back ${req.body.username}`);
    res.redirect("/listings");
})






module.exports = router;