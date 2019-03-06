var express = require("express"),
	Campground = require("../models/campground");

var router = express.Router();

router.get("/campgrounds/new", function(req, res) {
	res.render("campgrounds/new");
});


router.get("/campgrounds", function (req, res) {
	Campground.find({}, function (err, allCampgrounds) {
		if (err) {
			console.log(err);
		} else {

			res.render("campgrounds/index", {campgrounds: allCampgrounds});
		}
	});
});

router.post("/campgrounds", function (req, res) {
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

router.get("/campgrounds/:id", isLoggedIn, function (req, res) {
	Campground.findById(req.params.id).populate("comments").exec(function (err, campground) {
		if (err) {
			console.log(err);
		} else {
			res.render("campgrounds/show", {campground: campground});
		}
	});
});

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}

module.exports = router;
