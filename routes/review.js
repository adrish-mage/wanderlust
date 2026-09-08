const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync.js");
const { validateReview, isLoggedIn } = require("../middleware.js");
const reviewController = require("../controllers/review.js");
const { doubleCsrfProtection } = require("../utils/csrf.js");

router.post("/", isLoggedIn, doubleCsrfProtection, validateReview, wrapAsync(reviewController.create));
router.delete("/:reviewId", isLoggedIn, doubleCsrfProtection, wrapAsync(reviewController.destroy));

module.exports = router;
