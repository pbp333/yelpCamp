var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/cats_app");

var catSchema = new mongoose.Schema({
	name: String,
	age: Number,
	temperament: String
});

var Cat = mongoose.model("Cat", catSchema);

var whatever = new Cat({
	name: "whatever5",
	age: 2,
	temperament: "what5"
});

// whatever.save(function(err, cat) {
// 	if (err) {
// 		console.log("something went wrong!");
// 	} else {
// 		console.log("cat was saved to db -" + cat);
// 	}

// });

// Cat.create({
// 	name: "whatever6",
// 	age: "33",
// 	temperament: "whatever9"
// }, function(err, cat) {
// 	if (err) {
// 		console.log("Something went wrong");
// 	} else {
// 		console.log(cat + " was created!");
// 	}
// });

Cat.find({}, function(err, cats) {
	if(err) {
		console.log("something went wrong, " + err);
	} else {
		console.log("All the cats in the db");
		console.log(cats);
	}
});