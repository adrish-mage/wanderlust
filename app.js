const express = require("express");
const app = express();
require('dotenv').config();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const port = 8080;
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);


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

app.get("/", (req, res) => {
    res.send("hi i am root");
});
// Index Route
app.get("/listings", async (req, res) => {
    const allListings = await Listing.find();
    res.render("listings/index.ejs", { allListings });
})

// New Route
app.get("/listings/new", (req, res) => {
    res.render("listings/new");
});

// Show Route
app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
})
// Edit Route
app.get("/listings/:id/edit", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
})
// Update Route
app.put("/listings/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
})
// Create Route
app.post("/listings", async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
})
// Delete Route
app.delete("/listings/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
})

