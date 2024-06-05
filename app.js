const express = require("express");
const mongoose = require("mongoose");
const Campgrounds = require("./models/campgrounds");

const app = express();
const port = 3001;
mongoose
	.connect("mongodb://localhost:27017/yelp-camp")
	.then(() => console.log("database connected"))
	.catch((err) => console.log(err));
app.set("views", `${__dirname}/views`);
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
	res.render("home");
});
app.get("/campgrounds", async (req, res) => {
	const campgrounds = await Campgrounds.find({});
	res.render("campgrounds/index", { campgrounds });
});
app.get("/campgrounds/new", (req, res) => {
	res.render("campgrounds/new");
});
app.post("/campgrounds", async (req, res) => {
	const { title, location } = req.body.campground;
	const newCampground = new Campgrounds({ title, location });
	newCampground.save();
      res.redirect(`/campgrounds/${newCampground._id}`)
});
app.get("/campgrounds/:id", async (req, res) => {
	const { id } = req.params;
	const campground = await Campgrounds.findById(id);
	res.render("campgrounds/show", { campground });
});

app.listen(port, () => console.log("server started"));
