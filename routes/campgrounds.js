var express = require("express");
var app = express();
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment")
var methodOverride = require("method-override");
var middleware = require("../middleware/index.js")

app.use(methodOverride("_method"));

router.get("/", function(req,res){
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		} else {
			res.render("campgrounds/campgrounds.ejs", {campgrounds:allCampgrounds});
		}
	})
	
})

router.post("/",middleware.isLoggedIn, function(req,res){
	console.log(req.user);
	//get data from form and add to campgrounds array
	//redirect to /campgrounds route
	var newName = req.body.name
	var newImage = req.body.image
	var newDescription = req.body.description
	var newAuthor = {id: req.user._id, username:req.user.username};
	var newPrice = req.body.price
	console.log(req.user);
	var newCampground = {name: newName, image: newImage, description: newDescription, author:newAuthor, price:newPrice}
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else {
			console.log(newlyCreated);
			res.redirect("campgrounds/");
		}
	})
	
})

router.get("/new",middleware.isLoggedIn, function(req,res){
	res.render("campgrounds/new.ejs");
})



router.get("/:id", function(req,res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
	if(err)	{
		console.log(err);
		
	} else {
		console.log(foundCampground);
		res.render("campgrounds/show.ejs", {campground:foundCampground});
	}
	})
})

//edit campground
router.get("/:id/edit", middleware.checkCampgroundOwnership ,function(req,res){
	Campground.findById(req.params.id , function(err, campground){
		if(err){console.log(err)} else{
		if (campground.author.id.equals(req.user._id)){
		res.render("campgrounds/edit.ejs",{campground:campground});
		}
	}})
	
})

//update campground

router.put("/:id",middleware.checkCampgroundOwnership, function(req,res){
	Campground.findByIdAndUpdate(req.params.id ,req.body.campground ,function(err, updatedCampground){
		if(err){console.log(err);
			   res.redirect("/campgrounds")} else{
	res.redirect("/campgrounds/"+ req.params.id);
	}})
	
})

//Destroy campground router

router.delete("/:id",middleware.checkCampgroundOwnership, function(req,res){
	Campground.findByIdAndRemove(req.params.id, function(err, deletedCampground){
		if (err){
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds");
		}
	})
	
})


module.exports = router;