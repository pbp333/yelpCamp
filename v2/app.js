var express = require("express"),
app = express(),
bodyParser = require("body-parser"),
mongoose = require("mongoose"),
Campground = require("./models/campground.js"),
seedDB = require("./seeds");

seedDB();



mongoose.connect("mongodb://localhost/yelpcamp");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));


app.get("/", function (req, res) {
	res.render("landing");
});

app.get("/campgrounds/new", function(req, res) {
	res.render("new");
});

app.get("/campgrounds", function (req, res) {
	Campground.find({}, function (err, allCampgrounds) {
		if (err) {
			console.log(err);
		} else {

			res.render("index", {campgrounds: allCampgrounds});
		}
	});
});

app.post("/campgrounds", function (req, res) {
	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description;
	var campground = {name: name, image: image, description: description};
	Campground.create(campground, function (err, newlyCreated) {
		if (err) {
			console.log(err);
		} else {
			res.redirect("/campgrounds");
		}
	});
});

app.get("/campgrounds/:id", function (req, res) {
	Campground.findById(req.params.id).populate("comments").exec(function (err, campground) {
		if (err) {
			console.log(err);
		} else {
			res.render("show", {campground: campground});
		}
	});
});


app.listen(8080, function() {
	console.log("Yelp Camp server has started...")
});