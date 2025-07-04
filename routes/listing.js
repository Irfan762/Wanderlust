const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js")
const ExpressError=require("../utils/ExpressError.js");
const {ListingSchema}=require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js")





//Index Route
router.get("/",wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
}));

//New Route
router.get("/new",isLoggedIn, (req, res) => {
 
  res.render("listings/new.ejs");
});

//Show Route
router.get("/:id", wrapAsync(async (req, res,next) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews").populate("owner");
  if(!listing){
    req.flash("error","Listing you requested for does not exist !");
    res.redirect("/listings")
  }
  console.log(listing)
  res.render("listings/show.ejs", { listing });
  
}));

//Create Route
router.post("/",isLoggedIn, validateListing, wrapAsync( async (req, res,next) => {
 
  const newListing = new Listing(req.body.listing);
  newListing.owner=req.user._id;
  await newListing.save();
  req.flash("success","New Listing Created !")
  res.redirect("/listings");
}));

//Edit Route
router.get("/:id/edit",isLoggedIn,
  isOwner,
   wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
   if(!listing){
    req.flash("error","Listing you requested for does not exist !");
    res.redirect("/listings")
  }
  res.render("listings/edit.ejs", { listing });
 
}));

//Update Route
router.put("/:id",isLoggedIn,isOwner,validateListing, wrapAsync(async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  req.flash("success","listing is Updated")
  res.redirect(`/listings/${id}`);
}));
//{id}--->goging to the show route

//Delete Route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync( async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success","Listing is Delelted")
  res.redirect("/listings");
}));

module.exports=router;