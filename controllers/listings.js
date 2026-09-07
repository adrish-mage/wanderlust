const ExpressError = require("../utils/expressError.js");
const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const search = (req.query.q || "").trim();
    const filter = search
        ? {
            $or: [
                { title: { $regex: search, $options: "i" } },
                { location: { $regex: search, $options: "i" } },
                { country: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ]
        }
        : {};
    const allListings = await Listing.find(filter);
    res.render("listings/index.ejs", { allListings, search });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new");
};

module.exports.show = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({ path: "reviews", populate: { path: "author" } })
        .populate("owner");

    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }

    listing.reviews.sort((first, second) =>
        new Date(second.createdAt) - new Date(first.createdAt)
    );
    res.render("listings/show.ejs", { listing });
};

module.exports.renderEditForm = async (req, res) => {
    const listing = req.listing || await Listing.findById(req.params.id);
    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }
    let origImage = listing.image.url;
    origImage = origImage.replace(
        "/upload",
        "/upload/c_limit,w_1200,q_auto:best,f_auto"
    );
    res.render("listings/edit.ejs", { listing, origImage });
};

module.exports.create = async (req, res) => {
    if (!req.body.listing) {
        throw new ExpressError(400, "Send valid data for listing");
    }
    const newListing = new Listing(req.body.listing);
    if (req.file) {
        newListing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Added");
    res.redirect("/listings");
};

module.exports.update = async (req, res) => {
    const { id } = req.params;
    const updatedListing = await Listing.findById(id);
    Object.assign(updatedListing, req.body.listing);
    if (req.file) {
        updatedListing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }
    await updatedListing.save();
    res.redirect(`/listings/${id}`);
};

module.exports.destroy = async (req, res) => {
    const listing = req.listing || await Listing.findById(req.params.id);
    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }

    await Listing.findByIdAndDelete(listing._id);
    req.flash("error", `${listing.title} is deleted successfully`);
    res.redirect("/listings");
};