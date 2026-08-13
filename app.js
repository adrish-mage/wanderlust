const express = require("express");
const app = express();
require('dotenv').config();
const router = require("./routes/listings.js");
const mongoose = require("mongoose");
const port = 8080;
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const ExpressError = require("./utils/expressError.js");

const listings = require("./routes/listings.js");
const review = require("./routes/review.js");

async function main() {
    await mongoose.connect(process.env.MONGO_URI);
}
main().then(() => {
    console.log("MongoDB connected");
    app.listen(port, () => {
        console.log(`app is listening on server ${port}`);
    })
    console.log("Connected to database:", mongoose.connection.name);
}).catch((err) => {
    console.log("error connecting to MongoDB", err);
}) 

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")))

app.get("/", (req, res) => {
    res.send("hi i am root");
});

app.use("/listings",listings);
app.use("/listings/:id/reviews",review);

app.all("/{*splat}", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
})
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "something went wrong" } = err;
    res.status(statusCode).send(message);

})

