var express = require ("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var seedDB = require("./seeds");
var LocalStrategy = require("passport-local");
var User = require("./models/user");
var passport = require("passport")
var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var authRoutes = require("./routes/auth")
var methodOverride = require("method-override");
var flash = require("connect-flash");
var port = process.env.PORT || 3000;


app.use(methodOverride("_method"));
app.use(flash());

mongoose.connect("mongodb+srv://Yelp_camp:rusty@yelpcamp.rhmhx.mongodb.net/yelpcamp?retryWrites=true&w=majority",{useNewUrlParser: true});

// Campground.create(
// 	{name: "Salmon Creek", image:"https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&h=350"}, function(err, campground){
// 		if(err){
// 			console.log(err)
// 			}
// 		else {
// 			console.log("Newly created campground:");
// 			console.log(campground);
// 		}
// 		}
	
// )



// var campgrounds = [
// 		{name: "Salmon Creek", image:"https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&h=350"},
// 		{name: "Granite Hill", image:"https://images.pexels.com/photos/4499511/pexels-photo-4499511.jpeg?auto=compress&cs=tinysrgb&h=350"},
// 		{name: "Salmon Creek", image:"https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&h=350"},
// 		{name: "Granite Hill", image:"https://images.pexels.com/photos/4499511/pexels-photo-4499511.jpeg?auto=compress&cs=tinysrgb&h=350"},{name: "salmon Creek", image:"https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&h=350"},
// 		{name: "Granite Hill", image:"https://images.pexels.com/photos/4499511/pexels-photo-4499511.jpeg?auto=compress&cs=tinysrgb&h=350"}]


// Campground.create({
// 	name: "Granite Hill",
// 	image: "https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&h=350",
// 	description: "Good campground"
// })

// seed the database
// seedDB();

app.use(bodyParser.urlencoded({extended:true}));



app.use(require("express-session")({
	secret:"Rusty is fat",
	resave: false,
	saveUninitialized: false,
	
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
})

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(express.static(__dirname+"/public"))

app.use(authRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

//=======================
// Comment Route
//======================

app.listen(port, function () {
  console.log("Server Has Started!");
});


