const mongoose = require("mongoose");
const Campground = require("../models/campgrounds");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");
const {v4: uuid} = require("uuid")

mongoose
	.connect("mongodb://localhost:27017/yelp-camp")
	.then(() => console.log("database connected"))
	.catch((err) => console.log(err));

const randomLocation = (cities) => {
	const rand = Math.floor(Math.random() * cities.length);
	return `${cities[rand].city}, ${cities[rand].state}`;
};
const randomTitle = (item) => {
	const rand = Math.floor(Math.random() * item.length);
	return item[rand];
};
const randomPrice = () => Math.random() * 50;

const seed = async () => {
	await Campground.deleteMany({});
	for (let i = 0; i < 50; i++) {
		const c = new Campground({
			_id: uuid(),
			location: randomLocation(cities),
			title: `${randomTitle(descriptors)} ${randomTitle(descriptors)}`,
			price: randomPrice().toFixed(2),
			image: "http://source.unsplash.com/collection/483251",
			description:"Nihil ullam minima, eos hic debitis deserunt expedita ipsa numquam nobis dignissimos dolor atque, rerum ipsum. Dolore laborum voluptas vel dolores eum quia officiis ipsa impedit iste cupiditate. Ut, ducimus dicta recusandae voluptates quibusdam inventore, veritatis, doloremque accusamus sed explicabo molestias in?",
		});

		await c.save();
	}
};
seed().then(() => mongoose.disconnect());
