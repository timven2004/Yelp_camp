var express = require("express");
var app = express();
var router = express.Router({mergeParams: true});
var Campground= require("../models/campground");
var Comment = require ("../models/comment")
var methodOverride = require("method-override");
var middleware = require("../middleware/index.js");

app.use(methodOverride("_method"));





router.post("/", middleware.isLoggedIn ,function(req,res){
	Campground.findById(req.params.id,function(err, campground){
		if (err){
			console.log(err)
			res.redirect("/campgrounds");
		} else {
			Comment.create(req.body.comment, function(err,comment){
				if (err){
					console.log(err)
					req.flash("error","Something went wrong");
				} else {
					(comment.author.id = req.user._id);
					(comment.author.username = req.user.username);
					(comment.text = req.body.comment.text);
					comment.save();
			campground.comments.push(comment);
			campground.save();
			console.log(campground);
			console.log(comment)
			req.flash("sucess","Successfully added a comment")
			res.redirect("/campgrounds/"+req.params.id);
				}
			})
			
		}
	})
	
})

router.get("/new", middleware.isLoggedIn, function(req,res){
	Campground.findById(req.params.id, function(err, campground){
		if (err){console.log(err)} 
		else {
		res.render("comments/new.ejs",{campground:campground});
	}})
	
})

router.get("/:comment_id/edit", middleware.checkCommentOwnership , function(req, res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if (err) {
			console.log(err);
			res.redirect("back");
		} else {
			Campground.findById(req.params.id, function(err, campground){
				res.render("comments/edit.ejs",{campground : campground, comment: foundComment});

			})
		}
	}
	
)})

router.put("/:comment_id",middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if (err){
			res.redirect("back")
		} else {
			res.redirect("/campgrounds/"+ req.params.id);
		}
	})
	
	
})

router.delete("/:comment_id",middleware.checkCommentOwnership, function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err, deletedComment){
		if (err) {
			console.log(err)
			res.redirect("back");
	} else {
		req.flash("success", "Comment deleted")
		res.redirect("/campgrounds/"+req.params.id);
	}
})})


module.exports = router;