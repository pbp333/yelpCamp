var express = require("express"),
Campground = require("../models/campground"),
middleware = require("../middleware");

var router = express.Router();

router.get("/new", middleware.isLoggedIn,function(req, res) {
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

router.post("/", middleware.isLoggedIn, function (req, res) {
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

router.get("/:id", function (req, res) {
	Campground.findById(req.params.id).populate("comments").exec(function (err, campground) {
		if (err) {
			console.log(err);
		} else {
			res.render("campgrounds/show", {campground: campground});
		}
	});
});

router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
	Campground.findById(req.params.id, function (err, campground) {
		res.render("campgrounds/edit", {campground: campground});
	});
});

router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedCampground) {
		if (err) {
			console.log(err);
			res.redirect("campgrounds");
		} else {
			res.redirect("/campgrounds/" + updatedCampground.id);
		}
	});
});


// TODO fix exception being thrown afetr element is deleted
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {

	Campground.findByIdAndDelete(req.params.id, function(err) {
		if (err) {
			console.log(err);
		}
	});

	res.redirect("campgrounds");	
});

module.exports = router;
