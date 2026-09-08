const Listing = require("../models/listing");
const escapeRegex = require("../utils/escapeRegex.js");

module.exports.index = async (req, res) => {
    const search = (req.query.q || "").trim();
    const escapedSearch = escapeRegex(search);
    const filter = search ? {
                        $or: [
                            { title: { $regex: escapedSearch, $options: "i" } },
                            { location: { $regex: escapedSearch, $options: "i" } },
                            { country: { $regex: escapedSearch, $options: "i" } },
                            { description: { $regex: escapedSearch, $options: "i" } }
                        ]
                    }: {};
    const allListings = await Listing.find(filter);
    res.render("listings/index.ejs", { allListings, search });
};
