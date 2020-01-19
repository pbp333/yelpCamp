var express = require("express"),
app = express(),
bodyParser = require("body-parser"),
mongoose = require("mongoose"),
passport = require("passport"),
methodOverride = require("method-override"),
LocalStrategy = require("passport-local"),
Campground = require("./models/campground"),
Comment = require("./models/comment")
seedDB = require("./seeds"),
User = require("./models/user")
flash = require("connect-flash");

var commentRoutes = require("./routes/comments"),
campgroundRoutes = require("./routes/campgrounds"),
indexRoutes = require("./routes/index");

app.use(flash());
// PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "Whatevergeufen2ie93ue3j3jr",
	resave: false,
	save: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



// mongoose.connect("mongodb://localhost/yelpcamp", { useNewUrlParser: true , useUnifiedTopology: true });
mongoose.connect("mongodb+srv://yelpUser:yelpUser333@cluster0-zuasm.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.errorMessage = req.flash("error");
	res.locals.successMessage = req.flash("success");
	next();
})

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

const host = '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen(port, host, function() {
  console.log("Yelp Camp server has started...")
});


/*app.listen(8080, function() {
	console.log("Yelp Camp server has started...")
});*/