const express = require("express");
const app = express();
require('dotenv').config();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const port = 8080;


async function main(){
    await mongoose.connect(process.env.MONGO_URI);
}
main().then(() => {
    console.log("MongoDB connected");
    app.listen(port, () => {
        console.log(`app is listening on server ${port}`);
    })
    console.log("Connected to database:", mongoose.connection.name);
}).catch((err) => {
    console.log("error connecting to MongoDB", err);
})

app.get("/",(req,res) => {
    res.send("hi i am root");
});

app.get("/listingTest", async (req,res) => {
    const sampleListing = new Listing({
        title : "My new villa",
        description : "This villa stands at the conjungtion of the spheres of sea and land",
        image : "https://www.pinterest.com/ideas/house-in-london-aesthetic/930533389747/",
        price: 1000000,
        location : "Edinbourg",
        country : "Scotland"
    })
    await sampleListing.save();
    console.log("sample was saved ");
    res.send("sample data saved successfully");
})


