var express = require("express"),
app = express(),
bodyParser = require("body-parser"),
mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/yelpcamp");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

// SCHEMA SETUP

var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

/*Campground.create(
	{
		name: "whatever1",
		image: "https://upload.wikimedia.org/wikipedia/en/thumb/a/aa/One_Piece_DVD_18.png/200px-One_Piece_DVD_18.png",
		description: "whatever1 description"
	}, function (err, newlyCreated) {
		if (err) {
			console.log(err);
		} else {
			console.log("A new campground was created!");
			console.log(newlyCreated);
		}
	}
	);*/

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
		Campground.findById(req.params.id, function (err, campground) {
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