const express = require("express");
const router = express.Router({ mergeParams: true });

const ExpressError = require("../utils/expressError.js");
const wrapAsync = require("../utils/wrapAsync.js");

const { ReviewSchema } = require("../schemaValidator.js");

const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

const validateReview = ((req, res, next) => {
    const { error } = ReviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
})

router.post("/", validateReview, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    const newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
}));

router.delete("/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    res.redirect(`/listings/${id}`);
}))

module.exports = router;