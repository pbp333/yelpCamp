var mongoose = require("mongoose");

// SCHEMA SETUP

var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String,
	comments: [ {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Comment"
	}],
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "username"
		},
		username: String
	}
});

module.exports = mongoose.model("Campground", campgroundSchema);

