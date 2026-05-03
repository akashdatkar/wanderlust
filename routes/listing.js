const express=require("express");
const router=express.Router();
const wrapAsync=require("../utility/wrapAsync.js");
const ExpressError=require("../utility/ExpressError.js");
const {listingSchema}=require("../schema.js");
const Listing=require("../models/listing.js");
const {isLoggedIn, isOwner,validatelisting}=require("../middleware.js");

const { index, renderNewForm, showListing, createListing, editListing, updateListing, destroyListing } = require("../controllers/listing.js");
const multer  = require("multer");
const {storage}=require("../cloudConfig.js");
const upload = multer({storage});

 
router.route("/")
.get(wrapAsync(index))
//.post(isLoggedIn,validatelisting,wrapAsync(createListing));
.post(
  isLoggedIn,
  upload.single('listing[image]'),
  validatelisting,
  wrapAsync(createListing)
)
// all listings
// router.get("/", wrapAsync(index));

//new listing
router.get("/new",isLoggedIn, renderNewForm);

//show listing
router.get("/:id", wrapAsync(showListing));

//new Listing
// router.post("/", validatelisting,isLoggedIn,wrapAsync(createListing));

//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(editListing));

//update listing
router.put("/:id",validatelisting,isLoggedIn,isOwner, wrapAsync(updateListing));

//delete listing
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(destroyListing));

module.exports=router;