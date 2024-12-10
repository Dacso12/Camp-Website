const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema;
const opts = { toJSON: { virtual: true } };

const CampgroundSchema = new Schema({
    title: String,
    images: [
        {
            url: String,
            filename: String
        }
    ],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts);



CampgroundSchema.virtual("properties.popUpMarkup").get(function (){
    const newUrl = `/campgrounds/${this._id}`
    return `<h6><a href=${newUrl}>${this.title}Tester</a></h6>`
})



CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        });
    }
});

module.exports = mongoose.model('Campground', CampgroundSchema);
