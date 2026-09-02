const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync.js");
const { validateReview, isLoggedIn } = require("../middleware.js");
const reviewController = require("../controllers/review.js");

router.post("/", validateReview, isLoggedIn, wrapAsync(reviewController.create));
router.delete("/:reviewId", isLoggedIn, wrapAsync(reviewController.destroy));

module.exports = router;
