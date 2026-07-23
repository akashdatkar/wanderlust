const mongoose = require('mongoose');
const Review = require('./reviews.js');
const { listingSchema } = require('../schema.js');

const newSchema=new mongoose.Schema({
    title:{
        type:String,
        require:true,
    },
    description:String,
    image:{
    filename: String,
    url: {
        type: String,
        default: "https://images.unsplash.com/photo-1775641987684-afe489a18949?w=500&auto=format&fit=crop&q=60",
        set: (v) => v === "" ? "https://images.unsplash.com/photo-1775641987684-afe489a18949?w=500&auto=format&fit=crop&q=60" : v
       }
    },
    price:Number,
    location:String,
    country:String,
    reviews:{
        type:[
            {
                type:mongoose.Schema.Types.ObjectId, 
                ref:"Reviews",
            },
        ],
        default: [],
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId, 
        ref:"Users",
    },
});

newSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        await Review.deleteMany({_id: {$in: listing.reviews}})
    }
});

const Listing=mongoose.model("Listing",newSchema);

module.exports=Listing;