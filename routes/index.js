var express = require("express"),
User = require("../models/user"),
Campground = require("../models/campground"),
passport = require("passport");

var router = express.Router();


router.get("/", function (req, res) {
	res.render("landing");
});

// AUTH ROUTES

router.get("/register", function(req, res) {
	res.render("register", {page: 'register'});
});

router.post("/register", function(req, res) {
	var newUser = new User({
		username: req.body.username,
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		avatar: req.body.avatar
	});

	User.register(newUser, req.body.password, function (err, user) {
		if (err) {
			console.log(err);
			req.flash("error", err.message);
			return res.redirect("/register");
		}
		passport.authenticate("local")(req, res, function() {
			req.flash("success", "Succefully Signed Up! Welcome, " + user.username);
			res.redirect("/campgrounds");
		});
	});
});

//LOGIN ROUTES

router.get("/login", function(req, res) {
	res.render("login", {page: 'login'});
});

router.post("/login", passport.authenticate("local", 
{
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}),function(req, res) {
});

// LOGOUT

router.get("/logout", function(req, res) {
	req.logout();
	res.redirect("/campgrounds");
});

// USER PROFILE

router.get("/users/:id", function (req, res) {
	User.findById(req.params.id, function (err, user) {
		if (err || !user) {
			console.log(err);
			req.flash("error", "User not found");
			res.redirect("back");
		}

		Campground.find().where("author.id").equals(user._id).exec(function (err, campgrounds) {
			if (err || !campgrounds) {
				console.log(err);
				req.flash("error", "User not found");
				res.redirect("back");
			}
			console.log(campgrounds);
			user.campgrounds = campgrounds;
			res.render("users/view", { user: user });
		});
	});
});

module.exports = router;
