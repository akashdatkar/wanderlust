const Listing=require("./models/listing.js");
const ExpressError=require("./utility/ExpressError.js");
const {listingSchema}=require("./schema.js");
const {reviewSchema}=require("./schema.js");
const Review=require("./models/reviews.js");

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
       req.session.redirectUrl=req.originalUrl;
       req.flash("error","You must have to logged in to create new listing!");
       return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl=(req,res,next)=>{
    if( req.session.redirectUrl){
        res.locals.redirectUrl= req.session.redirectUrl;
    }    
    next();
}

module.exports.isOwner=async (req,res,next)=>{
    let {id}=req.params;
    let listing= await Listing.findById(id);  
    if(!listing.owner.equals(res.locals.currentUser._id)){
        req.flash("error","You dont have access to edit");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isReviewAuther=async (req,res,next)=>{
    let {id,reviewId}=req.params;
    let review= await Review.findById(reviewId);  
    if(!review.auther.equals(res.locals.currentUser._id)){
        req.flash("error","You dont have access to delete");
        return res.redirect(`/listings/${id}`);
    }
    next(); 
}

module.exports.validatelisting=(req,res,next)=>{
    const { error } = listingSchema.validate(req.body);
        if(error){
            let errMsg=error.details.map((el)=>el.message).join(",");
            throw new ExpressError(400,errMsg);
        }else{
            next();
        }
}

module.exports.validatereview=(req,res,next)=>{
    const { error } = reviewSchema.validate(req.body,{ convert: true });
        if(error){
            let errMsg=error.details.map((el)=>el.message).join(",");
            throw new ExpressError(400,errMsg);
        }else{
            next();
        }
}
