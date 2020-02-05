var express = require("express"),
Campground = require("../models/campground"),
middleware = require("../middleware"),
NodeGeocoder = require("node-geocoder");

var router = express.Router();

var options = {
	provider: "google",
	httpAdapter: "https",
	apiKey: process.env.GEOCODER_API_KEY,
	formatter: null
};

var geocoder = NodeGeocoder(options);

router.get("/new", middleware.isLoggedIn,function(req, res) {
	res.render("campgrounds/new");
});


router.get("", function (req, res) {
	Campground.find({}, function (err, allCampgrounds) {
		if (err) {
			console.log(err);
		} else {
			
			res.render("campgrounds/index", {campgrounds: allCampgrounds, page: 'campgrounds'});
		}
	});
});

router.post("/", middleware.isLoggedIn, function (req, res) {
	var name = req.body.name;
	var price = req.body.price;
	var image = req.body.image;
	var description = req.body.description;
	var author = {
		username: req.user.username,
		id: req.user._id
	}

	geocoder.geocode(req.body.location, function (err, data) {
		if (err || !data.length) {
			console.log(err);
			req.flash("error", "Invalid address");
			// return res.redirect("back");
		}

		var lat = data ? data[0].latitude : 0;
		var lng = data ? data[0].longitude : 0;
		var location = data ? data[0].formattedAddress : "";

		var campground = {name: name, price: price, image: image, description: description, author: author, location: location, lat: lat, lng: lng};

		console.log(campground);

		Campground.create(campground, function (err, newlyCreated) {
			if (err) {
				console.log(err);
			} else {
				newlyCreated.save();
				res.redirect("/campgrounds");
			}
		});
	});
});

router.get("/:id", function (req, res) {
	Campground.findById(req.params.id).populate("comments").exec(function (err, campground) {
		if (err) {
			req.flash("error", "Campground not found");
			console.log(err);
			res.redirect("/campgrounds");
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

	geocoder.geocode(req.body.location, function (err, data) {
		if (err || !data.length) {
			console.log(err);
			req.flash("error", "Invalid address");
			// return res.redirect("back");
		}

		req.body.campground.lat = data ? data[0].latitude : 0;
		req.body.campground.lng = data ? data[0].longitude : 0;
		req.body.campground.location = data ? data[0].formattedAddress : "";

		Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedCampground) {
			if (err) {
				console.log(err);
				res.redirect("campgrounds");
			} else {
				res.redirect("/campgrounds/" + updatedCampground.id);
			}
		});
	});
});


// TODO fix exception being thrown after element is deleted
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {

	Campground.findByIdAndDelete(req.params.id, function(err) {
		if (err) {
			req.flash("error", "Campground not found");
			console.log(err);
		}
	});

	res.redirect("campgrounds");	
});

module.exports = router;
