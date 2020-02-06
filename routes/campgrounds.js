var express = require("express"),
Campground = require("../models/campground"),
middleware = require("../middleware"),
NodeGeocoder = require("node-geocoder")
multer = require("multer")
cloudinary = require("cloudinary");

var storage = multer.diskStorage({
	filename: function(req, file, callback) {
		callback(null, Date.now() + file.originalname);
	}
});

var imageFilter = function (req, file, cb) {
	if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
		return cb(new Error("Only image files are allowed!"), false);
	}
	cb (null, true);
}

var upload = multer({ storage: storage, fileFilter: imageFilter });

cloudinary.config({
	cloud_name: process.env.CLOUDINARYNAME,
	api_key: process.env.CLOUDINARYAPI,
	api_secret: process.env.CLOUDINARYKEY
});


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


router.get("/", function (req, res) {

	if (req.query.search) {
		const searchText = new RegExp(escapeRegex(req.query.search), "gi");
		Campground.find({ name: searchText }, function (err, allCampgrounds) {
			if (err) {
				console.log(err);
			} else {

				res.render("campgrounds/index", {campgrounds: allCampgrounds, page: 'campgrounds'});
			}
		});

	} else {

		Campground.find({}, function (err, allCampgrounds) {
			if (err) {
				console.log(err);
			} else {

				res.render("campgrounds/index", {campgrounds: allCampgrounds, page: 'campgrounds'});
			}
		});
	}
});

router.post("/", middleware.isLoggedIn, upload.single("image"), function (req, res) {

	cloudinary.uploader.upload(req.file.path, function (result) {

		if (!result) {
			req.flash("error", "Problem uploading image file");
			console.log(err);
			res.redirect("back");
		}

		var image = result.secure_url;

		var name = req.body.name;
		var price = req.body.price;
		var description = req.body.description;
		var author = {
			username: req.user.username,
			id: req.user._id
		}

		geocoder.geocode(req.body.location, function (err, data) {
			if (err || !data.length) {
				console.log(err);
				req.flash("error", "Invalid address");
				return res.redirect("back");
			}

			var lat = data ? data[0].latitude : 0;
			var lng = data ? data[0].longitude : 0;
			var location = data ? data[0].formattedAddress : "";

			var campground = {name: name, price: price, image: image, description: description, author: author, location: location, lat: lat, lng: lng};

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

router.put("/:id", middleware.checkCampgroundOwnership, upload.single("image"), function(req, res) {

	geocoder.geocode(req.body.location, function (err, data) {
		if (err || !data.length) {
			console.log(err);
			req.flash("error", "Invalid address");
			return res.redirect("back");
		}

		req.body.campground.lat = data ? data[0].latitude : 0;
		req.body.campground.lng = data ? data[0].longitude : 0;
		req.body.campground.location = data ? data[0].formattedAddress : "";

		if (req.file) {
			cloudinary.uploader.upload(req.file.path, function (result) {
				if (!result) {
					req.flash("error", "Problem uploading image file");
					console.log(err);
					res.redirect("back");
				}
				req.body.campground.image = result.secure_url;

				updateCampgroundById(req.params.id, req.body.campground, res);
			});

		} else {
			updateCampgroundById(req.params.id, req.body.campground, res);
		}
	});
});

function updateCampgroundById (id, campground, res) {
	Campground.findByIdAndUpdate(id, campground, function (err, updatedCampground) {
		if (err) {
			console.log(err);
			res.redirect("campgrounds");
		} else {
			res.redirect("/campgrounds/" + updatedCampground.id);
		}
	});
}


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

function escapeRegex(text) {
	return text.replace(/[-[\]{}()*+?.,\\|#\s]/g, "\\$&");
}

module.exports = router;
