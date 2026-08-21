const express = require("express");
const app = express();
const session = require("express-session");
const flash = require("connect-flash");
require("dotenv").config();

const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/expressError.js");

const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");

const listingsRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const port = 8080;

// MongoDB
async function main() {
    await mongoose.connect(process.env.MONGO_URI);
}

main()
    .then(() => {
        console.log("MongoDB connected");
        console.log("Connected to database:", mongoose.connection.name);

        app.listen(port, () => {
            console.log(`app is listening on server ${port}`);
        });
    })
    .catch((err) => {
        console.log("error connecting to MongoDB", err);
    });

// Configuration
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

// Session
const sessionOptions = {
    secret: "geraltofrivia",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};

app.use(session(sessionOptions));
app.use(flash());

app.use((req, res, next) => {
    console.log("SESSION:", req.session);
    console.log("FLASH:", req.session.flash);
    next();
});

// authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.delete = req.flash("delete");
    res.locals.error = req.flash("error");
    res.locals.CurrUser = req.user;
    next();
});

// Routes
app.get("/", (req, res) => {
    res.send("hi i am root");
});

app.get("/demoUser", async (req, res) => {
    let fakeUser = new User({
        email: "sample123@gmail.com",
        username: "tony stark",

    });

    const registeredUser = await User.register(fakeUser, "passssworrd");
    res.send(registeredUser);
});

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// 404
app.all("/{*splat}", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

// Error handler
app.use((err, req, res, next) => {
    const {
        statusCode = 500,
        message = "something went wrong"
    } = err;

    res.status(statusCode).send(message);
});