const mongoose = require("mongoose");
// define a schema
const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        filename: {
            type: String,
            default: "https://t4.ftcdn.net/jpg/04/70/29/97/360_F_470299797_UD0eoVMMSUbHCcNJCdv2t8B2g1GVqYgs.jpg",
        },
        url: {
            type: String,
            default: "https://t4.ftcdn.net/jpg/04/70/29/97/360_F_470299797_UD0eoVMMSUbHCcNJCdv2t8B2g1GVqYgs.jpg",
        },
    },
    price: Number,
    location: String,
    country: String
});
//compile a model
const listing = mongoose.model("Listing", listingSchema);

module.exports = listing;
