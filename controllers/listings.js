const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({})
    res.render("listings/index.ejs", { allListings });
}

module.exports.catagoryListing = async (req, res) => {
    let { btnValue } = req.body;
    const allListings = await Listing.find({ catagory: btnValue });
    res.render("listings/catagory.ejs", { allListings, btnValue });
}

module.exports.searchResult = async (req, res) => {
    let { search } = req.body;
    const allListings = await Listing.find({
        "$or": [
            { "title": { $regex: search } },
            { "catagory": { $regex: search } },
            { "country": { $regex: search, $options: "i" } },
            { "location": { $regex: search } },
        ]
    });
    let btnValue = search;
    res.render("listings/catagory.ejs", { allListings, btnValue });
}

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" }, }).populate("owner");
    if (!listing) {
        req.flash("error", "Listing does not exists!");
        res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing });
}

module.exports.createListing = async (req, res, next) => {

    let combinedLocation = req.body.listing.location + ", " + req.body.listing.country;
    let responce = await geocodingClient.forwardGeocode({
        query: combinedLocation,
        limit: 1
    }).send();

    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    newListing.geometry = responce.body.features[0].geometry;
    await newListing.save();

    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
}

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing does not exists!");
        res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/c_fill,h_200,w_350")
    res.render("listings/edit.ejs", { listing, originalImageUrl });
}

module.exports.updateListing = async (req, res) => {

    let combinedLocation = req.body.listing.location + ", " + req.body.listing.country;
    let responce = await geocodingClient.forwardGeocode({
        query: combinedLocation,
        limit: 1
    }).send();

    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    listing.geometry = responce.body.features[0].geometry;

    if(typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }else {
        await listing.save();
    }

    req.flash("success", "Listing Updated Successfully!");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleated Successfully!");
    res.redirect("/listings");
}