const Listing=require("../models/listing.js");


module.exports.index=async(req,res)=>{
    let allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}

module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
}

module.exports.createListing=async(req,res,next)=>{
        if(!req.body.listing){
            throw new ExpressError(400,"Send valid Data for Listing");
        }

        let newListing = new Listing(req.body.listing);

        if (req.file) {
        newListing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

        newListing.owner=req.user._id;
        await newListing.save();
        req.flash("success","New Listing Created!");
        res.redirect("/listings");
    }

module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id)
    .populate({
        path:"reviews",
        populate:{
        path:"auther",
        },  
}).populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exit!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
}

module.exports.editListing=async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you request for does not exit!");
        res.redirect("/listing");
    }
    res.render("listings/edit.ejs",{listing});
}

module.exports.updateListing=async(req,res)=>{
     if(!req.body.listing){
        throw new ExpressError(400,"Send valid Data for Listing");
    }
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
}
