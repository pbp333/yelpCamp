var express = require("express"),
User = require("../models/user"),
Campground = require("../models/campground"),
Notification = require("../models/notification"),
middleware = require("../middleware"),
async = require("async"),
nodemailer = require("nodemailer"),
crypto = require("crypto"),
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
	failureRedirect: "/login",
	failureFlash: true,
	successFlash: 'Welcome to YelpCamp!'
}),function(req, res) {
});

// LOGOUT

router.get("/logout", function(req, res) {
	req.logout();
	req.flash("success", "See you later!");
	res.redirect("/campgrounds");
});

// USER PROFILE

router.get("/users/:id", async function (req, res) {

	try {

		let user = await User.findById(req.params.id).populate("followers").exec();
		let campgrounds = await Campground.find().where("author.id").equals(user._id).exec();

		user.campgrounds = campgrounds;
		res.render("users/view", { user: user });

	} catch (err) {
		console.log(err);
		req.flash("error", "User not found");
		res.redirect("back");
	}
});

// FOLLOW USER

router.post("/follow/:id", middleware.isLoggedIn, async function(req, res) {
	try {
		let user = await User.findById(req.params.id);
		user.followers.push(req.user._id);
		user.saver();
		req.flash("success", "Succefully followed " + user.username + "!");
		res.redirect("/users/" + req.params.id);
	} catch (err) {
		console.log(err);
		req.flash("error", "Could not follow user");
		res.redirect("back");
	}
});

// VIEW ALL NOTIFICATIONS

router.get("/notifications/:id", middleware.isLoggedIn, async function(req, res) {
	try {
		let user = await User.findById(req.params.id).populate({
			path: "notifications",
			options: { sort: {"_id": -1 } }

		}).exec();
		let allNotifications = user.notifications;
		res.render("notifications/index", { allNotifications });

	} catch (err) {
		console.log(err);
		req.flash("error", "Problem getting notifications");
		res.redirect("back");
	}
});

// HANDEL NOTIFICATION

router.get("/notifcations/:id", middleware.isLoggedIn, async function(req, res) {
	try {
		let notifcation = await Notification.findById(req.params.id);
		notification.isRead = true;
		notification.save();
		res.redirect("/campgrounds/" + notification.campgroundId);

	} catch (err) {
		console.log(err);
		req.flash("error", "Problem getting notification");
		res.redirect("back");
	}
});

// PASSWORD RECOVERY
router.get("/forgot", function (req, res) {
	res.render("forgot");
});

router.post("/forgot", function (req, res) {
	async.waterfall([
		function (done) {
			crypto.randomBytes(20, function(err, buf) {
				var token = buf.toString('hex');
				done(err, token);
			});
		},
		function (token, done) {
			User.findOne({ email: req.body.email }, function (err, user) {
				if (!user) {
					req.flash("error", "No account found with that email address.");
					return res.redirect("/forgot");
				}

				user.resetPasswordToken = token;
				user.resetPasswordExpires = Date.now() + 3600000 // 1 * 60 * 60 * 1000 ms = 1 hour

				user.save(function (err) {
					done(err, token, user);
				});
			});
		},
		function (token, user, done) {
			var smtpTransport = nodemailer.createTransport({
				service: "Gmail",
				auth: {
					user: process.env.GMAILACC,
					pass: process.env.GMAILPW
				}
			});

			var mailOptions = {
				to: user.email,
				from: process.env.GMAILACC,
				subject: "Password Reset - YelpCamp",
				text: "Click the following link to reset your password - " + "http://" + req.headers.host + "/reset/" + token
			};
			smtpTransport.sendMail(mailOptions, function (err) {
				console.log("mail sent");
				req.flash("success", "An email has been sent to " + user.mail);
				done(err, 'done');
			});
		}

		], function(err) {
			console.log("entered here")
			if (err) {
				console.log(err);
				return next(err);
			}
			res.redirect("/forgot");
		});
});

router.get("/reset/:token", function(req, res) {
	User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
		if (err) {
			req.flash("error", "Password reset token is invalid or has expired.");
			return res.redirect("/forgot");
		}
		res.render("reset", { token: req.params.token });
	});
});

router.post('/reset/:token', function(req, res) {
	async.waterfall([
		function(done) {
			User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
				if (!user) {
					req.flash('error', 'Password reset token is invalid or has expired.');
					return res.redirect('back');
				}
				if(req.body.password === req.body.confirm) {
					user.setPassword(req.body.password, function(err) {
						user.resetPasswordToken = undefined;
						user.resetPasswordExpires = undefined;

						user.save(function(err) {
							req.logIn(user, function(err) {
								done(err, user);
							});
						});
					})
				} else {
					req.flash("error", "Passwords do not match.");
					return res.redirect('back');
				}
			});
		},
		function(user, done) {
			var smtpTransport = nodemailer.createTransport({
				service: 'Gmail', 
				auth: {
					user: process.env.GMAILACC,
					pass: process.env.GMAILPW
				}
			});
			var mailOptions = {
				to: user.email,
				from: process.env.GMAILACC,
				subject: 'Your password has been changed',
				text: 'Hello,\n\n' +
				'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
			};
			smtpTransport.sendMail(mailOptions, function(err) {
				req.flash('success', 'Success! Your password has been changed.');
				done(err);
			});
		}
		], function(err) {
			res.redirect('/campgrounds');
		});
});

module.exports = router;
