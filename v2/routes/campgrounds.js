var express = require("express"),
Campground = require("../models/campground");

var router = express.Router();

router.get("/new", isLoggedIn,function(req, res) {
	res.render("campgrounds/new");
});


router.get("", function (req, res) {
	Campground.find({}, function (err, allCampgrounds) {
		if (err) {
			console.log(err);
		} else {

			res.render("campgrounds/index", {campgrounds: allCampgrounds});
		}
	});
});

router.post("/", isLoggedIn, function (req, res) {
	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description;
	var author = {
		username: req.user.username,
		id: req.user._id
	}
	var campground = {name: name, image: image, description: description, author: author};
	Campground.create(campground, function (err, newlyCreated) {
		if (err) {
			console.log(err);
		} else {
			newlyCreated.save();
			res.redirect("/campgrounds");
		}
	});
});

router.get("/:id", isLoggedIn, function (req, res) {
	Campground.findById(req.params.id).populate("comments").exec(function (err, campground) {
		if (err) {
			console.log(err);
		} else {
			res.render("campgrounds/show", {campground: campground});
		}
	});
});

router.get("/:id/edit", function(req, res) {
	Campground.findById(req.params.id, function (err, campground) {
		if (err) {
			console.log(err);
			res.redirect("campgrounds");
		} else {
			res.render("campgrounds/edit", {campground: campground});
		}
	});
});

router.put("/:id", function(req, res) {
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedCampground) {
		if (err) {
			console.log(err);
			res.redirect("campgrounds");
		} else {
			res.redirect("/campgrounds/" + updatedCampground.id);
		}
	});
});

router.delete("/:id", function(req, res) {
	console.log("enetered here")
	Campground.findByIdAndRemove(req.params.id, function(err) {
		if (err) {
			console.log(err);
		}
		res.redirect("campgrounds");		
	});
});

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}

module.exports = router;
