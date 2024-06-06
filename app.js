const express = require("express");
const mongoose = require("mongoose");
const Campgrounds = require("./models/campgrounds");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate")

const app = express();
const port = 3001;
mongoose
	.connect("mongodb://localhost:27017/yelp-camp")
	.then(() => console.log("database connected"))
	.catch((err) => console.log(err));
app.set("views", `${__dirname}/views`);
app.set("view engine", "ejs");

app.engine("ejs", ejsmate)
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

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
	const { title, location, description, price, image} = req.body.campground;
	const newCampground = new Campgrounds({ title, location, description, price, image });
	newCampground.save();

	res.redirect(`/campgrounds/${newCampground._id}`);
});
app.get("/campgrounds/:id", async (req, res) => {
	const { id } = req.params;
	const campground = await Campgrounds.findById(id);
	res.render("campgrounds/show", { campground });
});
app.get("/campgrounds/:id/edit", async (req, res) => {
	const { id } = req.params;
	const campground = await Campgrounds.findById(id);
	res.render("campgrounds/edit", { campground });
});
app.put("/campgrounds/:id", async (req, res) => {
	const { id } = req.params;
	const data = req.body.campground;
	const campground = await Campgrounds.findByIdAndUpdate(id, { ...data });
      res.redirect(`/campgrounds/${campground._id}`)
});
app.delete("/campgrounds/:id", async (req,res) => {
      const {id} = req.params
      await Campgrounds.findByIdAndDelete(id)
      res.redirect("/campgrounds")
})

app.listen(port, () => console.log("server started"));
