var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Campground= require("../models/campground")

router.get("/register", function(req,res){
	res.render("register.ejs");
})

router.get("/", function(req, res){
	res.render("landing.ejs");
})

router.get("/login", function(req,res){
	res.render("login.ejs");
});

router.get("/logout", function(req,res){
	req.logout();
	req.flash("success", "Logged you out!");
	res.redirect("/campgrounds");
	
})

router.post("/login",passport.authenticate("local", {
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}), function(req,res){
});

router.post("/register", function(req,res){
	var newUser = (new User({username: req.body.username}));
	User.register(newUser, req.body.password, function(err,user){
		if(err){
			console.log(err);
			req.flash("error", err.message);
			return res.redirect("/register");
		}
		passport.authenticate("local")(req,res,function(){
			req.flash("success","Welcome to Yelp Camp " + user.username)
			res.redirect("/campgrounds");
		})
	})
})


module.exports = router;
