const express = require("express");
const router = express.Router({ mergeParams: true });
const ExpressError = require("../utils/expressError.js");
const wrapAsync = require('../utils/wrapAsync.js');
const Listing = require("../models/listing.js");
const { ListingSchema } = require("../schemaValidator.js");

const validateListing = ((req, res, next) => {
    const { error } = ListingSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, result.error);
    } else {
        next();
    }
})

// Index Route
router.get("/", async (req, res) => {
    const allListings = await Listing.find();
    res.render("listings/index.ejs", { allListings });
})

// New Route
router.get("/new", (req, res) => {
    res.render("listings/new");
});

// Show Route
router.get("/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate('reviews');
    if (listing && listing.reviews && listing.reviews.length) {
        listing.reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    res.render("../views/listings/show.ejs", { listing });
})
// Edit Route
router.get("/:id/edit", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
})
// Update Route
router.put("/:id", validateListing, async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
})
// Create Route
router.post("/", validateListing, wrapAsync(async (req, res, next) => {
    if (!req.body.listing) {
        throw new ExpressError(400, "Send valid data for listing");
    }
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
})
)
// Delete Route
router.delete("/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
})


module.exports = router;