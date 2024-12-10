const express = require('express')
const router = express.Router({mergeParams: true})
const {validateReview} = require('../middleware.js')
const Campground = require('../models/campground')
const Review = require('../models/review.js')
const reviews = require('../controllers/reviews.js')


const ExpressError = require('../utils/ExpressError')
const catchAsync = require('../utils/catchAsync')


router.post('/', validateReview, catchAsync(reviews.postReview))

router.delete('/:reviewId', catchAsync(reviews.deleteReview))

module.exports = router