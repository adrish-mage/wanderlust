const express = require("express");
const app = express();
require('dotenv').config();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const port = 8080;
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError = require("./utils/expressError.js");
const {ListingSchema} = require("./schemaValidator.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")))


const validateListing = ((req,res,next) => {
    const {error} = ListingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,result.error);
    }else{
        next();
    }
})
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
app.put("/listings/:id",validateListing, async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
})
// Create Route
app.post("/listings", validateListing, wrapAsync(async (req, res,next) => { 
    if(!req.body.listing) {
        throw new ExpressError(400,"Send valid data for listing");
    }  
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
    })
)
// Delete Route
app.delete("/listings/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
})
app.all("/{*splat}",(req,res,next) => {
    next(new ExpressError(404,"Page Not Found"));
})
app.use((err,req,res,next) => {
    let {statusCode = 500 , message = "something went wrong"} = err;
    res.status(statusCode).send(message);
    
})

