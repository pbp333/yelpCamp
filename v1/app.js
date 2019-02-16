var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

var campgrounds = [
	{name: "whatever1", image: "https://res.cloudinary.com/sfp/image/upload/q_60/cste/b06b7885-2afa-446c-bb7e-f44f897b3b60.jpeg"},
	{name: "whatever2", image: "https://res.cloudinary.com/sfp/image/upload/q_60/cste/b06b7885-2afa-446c-bb7e-f44f897b3b60.jpeg"},
	{name: "whatever3", image: "https://res.cloudinary.com/sfp/image/upload/q_60/cste/b06b7885-2afa-446c-bb7e-f44f897b3b60.jpeg"},
	{name: "whatever4", image: "https://res.cloudinary.com/sfp/image/upload/q_60/cste/b06b7885-2afa-446c-bb7e-f44f897b3b60.jpeg"},
	{name: "whatever5", image: "https://res.cloudinary.com/sfp/image/upload/q_60/cste/b06b7885-2afa-446c-bb7e-f44f897b3b60.jpeg"},
	{name: "whatever6", image: "https://res.cloudinary.com/sfp/image/upload/q_60/cste/b06b7885-2afa-446c-bb7e-f44f897b3b60.jpeg"},
	{name: "whatever7", image: "https://res.cloudinary.com/sfp/image/upload/q_60/cste/b06b7885-2afa-446c-bb7e-f44f897b3b60.jpeg"},
	{name: "whatever8", image: "https://res.cloudinary.com/sfp/image/upload/q_60/cste/b06b7885-2afa-446c-bb7e-f44f897b3b60.jpeg"},
	{name: "whatever9", image: "https://res.cloudinary.com/sfp/image/upload/q_60/cste/b06b7885-2afa-446c-bb7e-f44f897b3b60.jpeg"},
]

app.get("/", function(req, res) {
	res.render("landing");
});

app.get("/campgrounds/new", function(req, res) {
	res.render("new");
})

app.get("/campgrounds", function(req, res) {
	res.render("campgrounds", {campgrounds: campgrounds});
})

app.post("/campgrounds", function(req, res) {
	var name = req.body.name;
	var image = req.body.image;
	var campground = {name: name, image: image};
	campgrounds.push(campground);
	res.redirect("/campgrounds");
})


app.listen(8080, function() {
	console.log("Yelp Camp server has started...")
});