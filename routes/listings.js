const express = require("express");
const router = express.Router({ mergeParams: true });
const ExpressError = require("../utils/expressError.js");
const wrapAsync = require('../utils/wrapAsync.js');
const Listing = require("../models/listing.js");

const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");


// Index Route
router.get("/", async (req, res) => {
    const allListings = await Listing.find();
    res.render("listings/index.ejs", { allListings });
})

// New Route
router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new");
});

// Show Route
router.get("/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: 'reviews', 
            populate: {
                path: "author",
            }
        })
        .populate('owner');
    console.log(listing.owner);
    console.log(listing.reviews);
    
    if (listing && listing.reviews && listing.reviews.length) {
        listing.reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    console.log(listing.owner.username);
    res.render("../views/listings/show.ejs", { listing });

})
// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
})
// Update Route
router.put("/:id", validateListing, isLoggedIn, isOwner, async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
})
// Create Route
router.post("/", validateListing, isLoggedIn, wrapAsync(async (req, res, next) => {

    if (!req.body.listing) {
        throw new ExpressError(400, "Send valid data for listing");
    }
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Added");
    res.redirect("/listings");
}))
// Delete Route
router.delete("/:id", isLoggedIn, isOwner, async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    const name = listing.title;

    await Listing.findByIdAndDelete(id);

    req.flash("error", `${name} is deleted successfully`);
    res.redirect("/listings");
})


module.exports = router;