var express = require("express"),
app = express(),
bodyParser = require("body-parser"),
mongoose = require("mongoose"),
passport = require("passport"),
LocalStrategy = require("passport-local"),
Campground = require("./models/campground"),
Comment = require("./models/comment")
seedDB = require("./seeds"),
User = require("./models/user");

var commentRoutes = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	indexRoutes = require("./routes/index");

seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "Whatevergeufen2ie93ue3j3jr",
	resave: false,
	save: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



mongoose.connect("mongodb://localhost/yelpcamp");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	next();
})

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


app.listen(8080, function() {
	console.log("Yelp Camp server has started...")
});