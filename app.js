const express = require("express");
const app = express();
require('dotenv').config();
const mongoose = require("mongoose");
const port = 8080;


async function main(){
    await mongoose.connect(process.env.MONGO_URI);
}
main().then(() => {
    console.log("MongoDB connected");
    app.listen(port, () => {
        console.log(`app is listening on server ${port}`);
    })
}).catch((err) => {
    console.log("error connecting to MongoDB", err);
})


