var mongoose = require("mongoose");
var Campground = require("./models/campground.js");
var Comment = require("./models/comment.js");

var data = [
{
	name: "Whatever1",
	image: "http://vemco.com/wp-content/uploads/2012/09/image-banner2.jpg",
	description: "whatever description 1"
}, 
{
	name: "Whatever2",
	image: "https://imagejournal.org/wp-content/uploads/bb-plugin/cache/23466317216_b99485ba14_o-panorama.jpg",
	description: "whatever description 2"
},
{
	name: "Whatever3",
	image: "https://www.planwallpaper.com/static/images/sO0mRdKW.jpeg",
	description: "whatever description 3"
}
];

function seedDB() {

	// remove all of campgrounds
	Campground.remove({}, function(err) {
		if (err) {
			console.log(err);
		} else {
			console.log("Removed Campgrounds");
			Comment.remove({}, function(err) {
				if (err) {
					console.log(err);
				} else {
					console.log("Removed Comments");
					// add a few campgrounds
					data.forEach(function(seed) {
						Campground.create(seed, function(err, data) {
							if(err) {
								console.log(err);
							} else {
								console.log("added campground");
								// create comment
								Comment.create({
									text: "whatever comment 1",
									author: "whoever"
								}, function(err, comment) {
									if (err) {
										console.log(err);
									} else {
										data.comments.push(comment);
										data.save();
										console.log("Created new comment");
									}
								});
							}
						});
					})
				}
			});
		}
	});

	
};

module.exports = seedDB;

