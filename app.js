if(process.env.NODE_ENV !="production"){
     require('dotenv').config()
}

const express=require("express");
const app=express();
const path=require("path");
const mongoose = require('mongoose');
const Listing=require("./models/listing.js");
//const { v4: uuidv4 } = require('uuid');
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const wrapAsync=require("./utility/wrapAsync.js");
const ExpressError=require("./utility/ExpressError.js");
const {listingSchema, reviewSchema}=require("./schema.js");
const Review=require("./models/reviews.js");
const session=require("express-session");
const MongoStore = require("connect-mongo").default;
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User=require("./models/users.js");


const listingsRouter=require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const { required } = require("joi");

// Use Atlas if provided, otherwise fall back to local MongoDB for development
const MONGO_URL = process.env.MONGO_ATLAS_URL || 'mongodb://127.0.0.1:27017/wanderlust';
const port = process.env.PORT || 8080;

//uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
app.engine('ejs',  ejsMate);
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));

const store= MongoStore.create({
    mongoUrl:MONGO_URL,
    crypto:{
     secret:process.env.SECRET,
    },
    touchAfter: 24 * 60 * 60,
})

store.on("error", (e) => {
    console.log("Error in mongo session store", e);
});

const sessionOptions={
    store:store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: new Date(Date.now()+7*24*60*60*1000),
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },
};


main().then(()=>{
    console.log("Connection successful");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
} 

// app.get("/",(req,res)=>{
//     res.send("Working....");
// })

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currentUser=req.user;
    next();
});

// app.get("/demouser",async(req,res)=>{
//     let fakeUser=new User({
//         email:"apdatkar2004@gmail.com",
//         username:"Akash@123",
//     });
//     let ReUser=await User.register(fakeUser,"helloworld");
//     console.log(ReUser);
// })

app.use("/listings",listingsRouter);// after shipting code to routes/listing.js
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);
 

app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

// app.all("/*",(req,res,next)=>{
//    next(new ExpressError(404,"Page Not Found!"));
// });

app.use((err,req,res,next)=>{
    let {statuscode=500,message="Somthing went wrong"}=err;
    res.status(statuscode).render("error.ejs", {message});
    //res.status(statuscode).send(message);
})

// app.use((err,req,res,next)=>{
//     res.send("Something went wrong..");
// })

if (require.main === module) {
    app.listen(port,()=>{
        console.log(`Server Started on ${port}`);
    })
}

module.exports = app;



// app.get("/testlisting", async (req,res)=>{
//     let sampleListing=new Listing({
//         title:"My New Villa",
//         discreption:"By the beach",
//         price:2000,
//         location:"Calangute, Goa",
//         country:"India",
//     });

//     await sampleListing.save();
//     res.send("Successful....");
// });