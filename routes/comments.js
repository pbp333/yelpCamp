var express = require("express"),
Comment = require("../models/comment"),
Campground = require("../models/campground"),
middleware = require("../middleware");

var router = express.Router({mergeParams: true});

router.get("/new", middleware.isLoggedIn,function(req, res) {
	Campground.findById(req.params.id).populate("comments").exec(function (err, campground) {
		if (err) {
			console.log(err);
		} else {
			res.render("comments/new", {campground: campground});
		}
	});
});

router.post("/", middleware.isLoggedIn, function (req, res) {
	Campground.findById(req.params.id).populate("comments").exec(function (err, campground) {
		if (err) {
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			Comment.create(req.body.comment, function (err, comment) {
				if (err) {
					req.flash("error", "Something went wrong");
					console.log(err);
					res.redirect("/campgrounds");
				} else {
					comment.author.username = req.user.username;
					comment.author.id = req.user._id;
					comment.save();
					campground.comments.push(comment);
					campground.save();
					req.flash("success", "Comment added");
					res.redirect("/campgrounds/" + campground._id);
				}
			});
		}
	});
});

router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
	Comment.findById(req.params.comment_id, function (err, comment) {
		if (err) {
			req.flash("error", "Something went wrong");
			res.redirect("back");
		} else {
			req.flash("success", "Comment edited");
			res.render("comments/edit", {campgroundId: req.params.id, comment: comment});
		}
	});
});

router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, comment) {
		if (err) {
			console.log(err);
			res.redirect("back");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {

	Comment.findByIdAndDelete(req.params.comment_id, function(err) {
		if (err) {
			req.flash("error", "Something went wrong");
			console.log(err);
		}
	});
	req.flash("success", "Comment removed");
	res.redirect("/campgrounds/" + req.params.id);	
});

module.exports = router;