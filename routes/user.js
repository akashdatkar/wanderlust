const express=require("express");
const router=express.Router();
const User=require("../models/users.js");
const wrapAsync = require("../utility/wrapAsync.js");
const passport=require("passport");
const { saveRedirectUrl } = require("../authMiddleware.js");
const { renderSignUpForm, signUp, renderLoginForm, login, logout } = require("../controllers/users.js");


//register User
router.get("/signup", renderSignUpForm);

router.post("/signup", wrapAsync(signUp));

//login User
router.get("/login", renderLoginForm);

router.post("/login",saveRedirectUrl,passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash:true,
    }),
    login
);

router.get("/logout",logout);

module.exports=router;