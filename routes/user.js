const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");


router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});

router.post("/signup" ,wrapAsync(async (req,res)=>{
    try{
 let {username,email,password}=req.body;
    const newUser=new User({email,username})
  const registerUser= await  User.register(newUser,password);
  console.log(registerUser);
  req.login(registerUser,(err)=>{
    if(err){
        return  next(err);
    }
      req.flash("success","Welcome to wanderlist");
  res.redirect("/listings")

  });
    } 
    catch(e){
        req.flash("error",e.message),
        res.redirect("/signup")
    }
   
}));

router.post("/login",passport.authenticate("local",{
    failureRedirect:'login',
    failureFlash:true}),
    async (req,res)=>{
        req.flash("success","welcome to wanderlist");
        res.redirect("/listings");
      
    
})

router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
})

router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return   next(err);
        }
        req.flash("success","you are logged out !")
        res.redirect("/listings");
    })
})







module.exports = router;