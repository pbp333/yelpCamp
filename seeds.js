var mongoose = require("mongoose");
var Campground = require("./models/campground.js");
var Comment = require("./models/comment.js");
var User = require("./models/user.js");

var data = [
{
	name: "Whatever1",
	image: "http://vemco.com/wp-content/uploads/2012/09/image-banner2.jpg",
	description: "Aut dolorem tempore repudiandae tempora et. Et molestiae hic aut ut officiis. Assumenda perspiciatis autem nulla qui ducimus. Ullam maiores est dolorum. Ex ipsa adipisci eius aut quasi. Est sunt numquam magni voluptatem in eos."
}, 
{
	name: "Whatever2",
	image: "https://imagejournal.org/wp-content/uploads/bb-plugin/cache/23466317216_b99485ba14_o-panorama.jpg",
	description: "Et harum perferendis sapiente. Qui doloremque voluptatibus quis laboriosam et quaerat. Est velit iste voluptate esse laborum similique dignissimos."
},
{
	name: "Whatever3",
	image: "https://www.planwallpaper.com/static/images/sO0mRdKW.jpeg",
	description: "Quaerat ut qui voluptas aut accusamus nobis saepe voluptatibus. Autem qui rerum nisi nobis natus nesciunt. Fugit quam accusamus facilis eum nam natus doloremque dolores. Ut aut totam qui odit tempora nobis veniam."
}
];

async function seedDB() {

	try {

	await Comment.remove({});

	await Campground.remove({});

	await User.remove({});
	
	} catch (err) {
		console.log(err);
	}


};

module.exports = seedDB;

