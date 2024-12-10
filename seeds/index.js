
const mongoose = require('mongoose')
const Campground = require('../models/campground')
const cities = require('./cities')
const {places, descriptors} = require('./seedHelpers')


mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
.then(() => {
    console.log("Mongo connection open")
})
.catch(err => {
    console.log("Error")
    console.log(err)
})

const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
    await Campground.deleteMany({})
    for (let i = 0; i < 5; i++) {
     const price = Math.floor(Math.random() * 20) + 10
     const random1000 = Math.floor(Math.random() * 1000) 
     const camp =new Campground({
        author: '672dfa34a0f56e5034bd51b9',
        location: `${cities[random1000].city}, ${cities[random1000].state}`,
        title: `${sample(descriptors)} ${sample(places)}`,
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta necessitatibus cupiditate dolore, tempore autem totam, itaque dignissimos quaerat, esse qui minima odio odit nisi quisquam quod aut at facere enim?',
        price,
        geometry: {
          type: "Point",
          coordinates: [
            cities[random1000].longitude,
            cities[random1000].latitude
          ]
        },
        images: [
            {
              url: 'https://d2g85s3tfaxbly.cloudfront.net/photo/camp/130409/Wyalusing_State_Park_102.jpg',
              filename: 'Wyalusing_State_Park_102',
            },
            {
              url: 'https://d2g85s3tfaxbly.cloudfront.net/photo/camp/130409/Wyalusing_State_Park_102.jpg',
              filename: 'Wyalusing_State_Park_102',
            }
          ]
        
    })
    await camp.save()
    }

}
seedDB().then(() => {
    mongoose.connection.close()
})