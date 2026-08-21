const path = require("path");

require("dotenv").config({
    path: path.join(__dirname, "..", ".env")
});

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

console.log(process.env.MONGO_URI);

async function main(){
    await mongoose.connect(process.env.MONGO_URI);
}
main().then(() => {
    console.log("MongoDB connected");
    console.log("Connected to database:", mongoose.connection.name);
}).catch((err) => {
    console.log("error connecting to MongoDB", err);
})

const initDB = async () => {
    await Listing.deleteMany({});

    const dataWithOwner = initData.data.map((obj) => ({
        ...obj,
        owner: '6a87f510faff48615e84d734',
    }));

    await Listing.insertMany(dataWithOwner);

    console.log("data was initialized");
};


initDB();