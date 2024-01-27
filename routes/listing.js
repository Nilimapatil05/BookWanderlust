const express = require("express");
const httpProxy = require("http-proxy");
const wrapAsync = require("../utils/wrapAsync.js");
const router = express.Router();
const { Listing } = require("../models/listing");

const { listingSchema } = require("../schema.js");

const { isLoggedIn, isowner, validateListing } = require("../middleware.js");
const ListingControllers = require("../controllers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

const apiProxy = httpProxy.createProxyServer();

router
  .route("/")
  .get(wrapAsync(ListingControllers.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(ListingControllers.createListing)
  );

//new route
router.get("/new", isLoggedIn, ListingControllers.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(ListingControllers.showListing))
  .put(
    isLoggedIn,
    isowner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(ListingControllers.updateListing)
  )
  .delete(isLoggedIn, isowner, wrapAsync(ListingControllers.destroyListing));

//edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isowner,

  wrapAsync(ListingControllers.renderEditForm)
);

router.use("/mapbox", (req, res) => {
  apiProxy.web(req, res, {
    target: "https://api.mapbox.com",
    changeOrigin: true,
  });
});
module.exports = router;
//index route
// router.get("/", wrapAsync(ListingControllers.index));

//show route
// router.get("/:id", wrapAsync(ListingControllers.showListing));

//create route
// router.post(
//   "/",
//   isLoggedIn,
//   validateListing,

//   wrapAsync(ListingControllers.createListing)
// );

//update route
// router.put(
//   "/:id",
//   isLoggedIn,
//   isowner,
//   validateListing,
//   wrapAsync(ListingControllers.updateListing)
// );

//delete  post route
// router.delete(
//   "/:id",
//   isLoggedIn,
//   isowner,
//   wrapAsync(ListingControllers.destroyListing)
// );
