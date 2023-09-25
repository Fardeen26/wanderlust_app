const express = require("express");
const app = express();
const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const Listing = require("./models/listing.js");

main().then(() => {
    console.log("Connected to MongoDB");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}
app.get("/", (req, res) => {
    res.send("Hy, next big thing in the wolrd");
});

app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({})
    res.render("listings/index.ejs", { allListings });
});

// app.get("/testlisting", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "Elon Musk House 8BHK",
//         description: "This benglow is the Elon Musk's Bunglow that is worls richest men made from new technologies",
//         price: 58966,
//         location: "Silicon Vally, Califonia",
//         country: "United States of America",
//     });

//     await sampleListing.save();
//     console.log("Sample was saved");
//     res.send("Jao DB ke Terminal me jake dekho");
// })
app.listen(8080, () => {
    console.log("Listning to port 8080");
})