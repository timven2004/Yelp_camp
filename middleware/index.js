// all the middleware
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middlewareObj = {};


middlewareObj.checkCampgroundOwnership = function (req,res,next){
	if(req.isAuthenticated()){
	Campground.findById(req.params.id , function(err, campground){
		if(err){console.log(err)} else {
			if(campground.author.id.equals(req.user._id)){
			next();
			} else {
			req.flash("error","No Permission to do that");
			res.redirect("back");
		} 
	}})
} else {
	req.flash("error", "You need to be logged in to do that")
	res.redirect("back");
}}

middlewareObj.checkCommentOwnership = function checkCommentOwnership(req,res,next){
	if(req.isAuthenticated()){
	Comment.findById(req.params.comment_id , function(err, foundComment){
		if(err){
			console.log(err);
			req.flash("error", "Campground not found");
			redirect("back");
		} else {
			console.log(foundComment);
			if(foundComment.author.id.equals(req.user._id)){
			next();
			} else {
			req.flash("error","No Permission to do that");
			res.redirect("back");
		} 
	}})
} else {
	res.redirect("back");
}}

middlewareObj.isLoggedIn = function (req,res,next){
	if(req.isAuthenticated()){
		return next();
	} else {
	req.flash("error", "Please Login first!");
	res.redirect("/login");
	}
}


module.exports = middlewareObj;