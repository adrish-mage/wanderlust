const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const search = (req.query.q || "").trim();
    const filter = search ? {
                        $or: [
                            { title: { $regex: search, $options: "i" } },
                            { location: { $regex: search, $options: "i" } },
                            { country: { $regex: search, $options: "i" } },
                            { description: { $regex: search, $options: "i" } }
                        ]
                    }: {};
    const allListings = await Listing.find(filter);
    res.render("listings/index.ejs", { allListings, search });
};
