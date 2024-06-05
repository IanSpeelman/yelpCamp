const express = require("express")
const mongoose = require("mongoose")
const Campground = require("./models/campgrounds")

const app = express()
const port = 3001;
mongoose.connect("mongodb://localhost:27017/yelp-camp")
.then(() => console.log("database connected"))
.catch(err => console.log(err))
app.set("views", `${__dirname}/views`)
app.set("view engine", "ejs")

app.get("/", (req,res) => {
      res.render("home")
})
app.get("/campgrounds", async (req,res) => {
      const campgrounds = await Campground.find({})
      res.render("campgrounds/index", { campgrounds })
})


app.listen(port, () => console.log("server started"))
