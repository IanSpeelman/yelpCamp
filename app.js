const express = require("express");
const mongoose = require("mongoose");
const Campgrounds = require("./models/campgrounds");

const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const { v4: uuid } = require("uuid");
const ExpressError = require("./utils/ExpressError");
const catchAsync = require("./utils/catchAsync");
const { campgroundSchema } = require("./utils/validationSchemas");

const app = express();
const port = 3001;
mongoose
	.connect("mongodb://localhost:27017/yelp-camp")
	.then(() => console.log("database connected"))
	.catch((err) => console.log(err));
app.set("views", `${__dirname}/views`);
app.set("view engine", "ejs");
app.use(express.static("./public"));

app.engine("ejs", ejsmate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const validateCampground = (req, res, next) => {
	const { error } = campgroundSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(",");
		throw new ExpressError(400, msg);
	} else {
		next();
	}
};

app.get("/", (req, res) => {
	res.render("home");
});
app.get(
	"/campgrounds",
	catchAsync(async (req, res) => {
		const campgrounds = await Campgrounds.find({});
		res.render("campgrounds/index", { campgrounds });
	})
);
app.get("/campgrounds/new", (req, res) => {
	res.render("campgrounds/new");
});
app.post(
	"/campgrounds",
	validateCampground,
	catchAsync(async (req, res) => {
		const { title, location, price, description, image } =
			req.body.campground;
		const newId = uuid();
		const newCampground = new Campgrounds({
			title,
			location,
			price,
			description,
			image,
			_id: newId,
		});
		await newCampground.save();
		res.redirect(`/campgrounds/${newId}`);
	})
);
app.get(
	"/campgrounds/:id",
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const campground = await Campgrounds.findById(id);
		if (!campground) {
			throw new ExpressError(404, "this campground does not exist");
		}
		res.render("campgrounds/show", { campground });
	})
);
app.get(
	"/campgrounds/:id/edit",
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const campground = await Campgrounds.findById(id);
		res.render("campgrounds/edit", { campground });
	})
);
app.put(
	"/campgrounds/:id",
	validateCampground,
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const data = req.body.campground;
		const campground = await Campgrounds.findByIdAndUpdate(id, { ...data });
		res.redirect(`/campgrounds/${campground._id}`);
	})
);
app.delete(
	"/campgrounds/:id",
	catchAsync(async (req, res) => {
		const { id } = req.params;
		await Campgrounds.findByIdAndDelete(id);
		res.redirect("/campgrounds");
	})
);
app.all("*", (req, res, next) => {
	next(new ExpressError(404, "Page does not exist!"));
});
app.use((err, req, res, next) => {
	const { statusCode = 500, message = "oops something unexpected happened" } =
		err;
	res.status(statusCode).render("error", { err });
});

app.listen(port, () => console.log("server started"));
