const mongoose = require('mongoose');
const initData=require("./data.js");
const Listing=require("../models/listing.js");

if(process.env.NODE_ENV !="production"){
     require('dotenv').config()
}

const MONGO_URL = process.env.MONGO_ATLAS_URL || 'mongodb://127.0.0.1:27017/wanderlust';

main().then(()=>{
    console.log("Connection successful");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
} 

const initDb= async ()=> {
  await Listing.deleteMany({});
  initData.data=initData.data.map((obj)=>({
    ...obj,
    owner:"69ecb70dd467d7897b0ca27d"
  }));
  await Listing.insertMany(initData.data);
  console.log("Data Was Initialize..");
}

initDb();