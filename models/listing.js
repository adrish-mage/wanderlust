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
            default: "https://www.istockphoto.com/photos/default-image",
        },
        url: {
            type: String,
            default: "https://www.istockphoto.com/photos/default-image",
        },
    },
    price: Number,
    location: String,
    country: String
});
//compile a model
const listing = mongoose.model("Listing", listingSchema);

module.exports = listing;
