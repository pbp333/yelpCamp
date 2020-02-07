var mongoose = require("mongoose");

// SCHEMA SETUP

var NotificationSchema = new mongoose.Schema({
	user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
	campground: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Campground"
		},
	comment: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		},
	content: String,
	isRead: { type: Boolean, default: false }
});

module.exports = mongoose.model("Notification", NotificationSchema);