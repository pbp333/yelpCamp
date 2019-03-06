var express = require("express"),
	Comment = require("../models/comment"),
	Campground = require("../models/campground");

var router = express.Router({mergeParams: true});

router.get("/campgrounds/:id/comments/new", isLoggedIn,function(req, res) {
	Campground.findById(req.params.id).populate("comments").exec(function (err, campground) {
		if (err) {
			console.log(err);
		} else {
			res.render("comments/new", {campground: campground});
		}
	});
});

router.post("/campgrounds/:id/comments", function (req, res) {
	Campground.findById(req.params.id).populate("comments").exec(function (err, campground) {
		if (err) {
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			Comment.create(req.body.comment, function (err, comment) {
				if (err) {
					console.log(err);
				} else {
					campground.comments.push(comment);
					campground.save();
					res.redirect("/campgrounds/" + campground._id);
				}
			});
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