const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utility/wrapAsync.js");
const ExpressError=require("../utility/ExpressError.js");
const {reviewSchema}=require("../schema.js");
const Review=require("../models/reviews.js");
const Listing=require("../models/listing.js");
const {validatereview, isLoggedIn, isReviewAuther}=require("../authMiddleware.js");

const { createReview, destroyReview } = require("../controllers/reviews.js");


//Reviews
//post new review
router.post("/",isLoggedIn,validatereview, wrapAsync(createReview));

//delete review
router.delete("/:reviewId",isLoggedIn,isReviewAuther, wrapAsync(destroyReview));

module.exports=router;