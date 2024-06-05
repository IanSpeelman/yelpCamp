const mongoose = require("mongoose")
const Campground = require("../models/campgrounds")
const cities = require("./cities")
const {descriptors, places} = require("./seedHelpers")

mongoose.connect("mongodb://localhost:27017/yelp-camp")
.then(() => console.log("database connected"))
.catch(err => console.log(err))


const randomLocation = (cities) => {
      const rand = Math.floor(Math.random() * cities.length)
      return `${cities[rand].city}, ${cities[rand].state}`
}
const randomTitle = (item) => {
      const rand = Math.floor(Math.random() * item.length)
      return item[rand]
}
const randomPrice = () => Math.random() * 50

const seed = async () => {
      await Campground.deleteMany({})
      for (let i = 0; i < 50; i++) {
            const c = new Campground({
                  location: randomLocation(cities),
                  title: `${randomTitle(descriptors)} ${randomTitle(descriptors)}`,
                  price: randomPrice().toFixed(2)
            })
            
            await c.save()
            
      }

}
 seed().then(() => mongoose.disconnect())