const Listing = require("../models/listing");
const { listingSchema } = require("../schema.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;

  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner")
    .exec();

  if (!listing) {
    req.flash("error", "listing Not exist");
    res.redirect("/listings");
  }
  await listing.save();
  console.log(listing);
  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res) => {
  const result = listingSchema.validate(req.body);
  // console.log(result);
  // if (result.error) {
  //   throw new ExpressError(400, result.error);
  // }
  // let newListing = new Listing(req.body.listing);
  // newListing = req.user._id;
  // await newListing.save();

  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  let url = req.file.path;
  let filename = req.file.filename;
  console.log(url, "..", filename);
  let newListing = new Listing(req.body.listing);
  console.log(req.user);
  newListing.owner = req.user._id; // Assuming 'owner' is a field in your Listing model
  newListing.image = { url, filename };
  newListing.geometry = response.body.features[0].geometry;
  let savedListing = await newListing.save();
  console.log(savedListing);

  req.flash("sucess", "New listing Created!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "listing Not exist");
    res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250");

  req.flash("sucess", "listing edited");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;

  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file != "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("sucess", "listing updated");
  res.redirect(`/listings/${id}`);
};

module.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deleteListing = await Listing.findByIdAndDelete(id);
  console.log(deleteListing);
  req.flash("sucess", "listing deleted");
  res.redirect("/listings");
};
