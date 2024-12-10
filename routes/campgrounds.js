const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const {isLoggedIn,isAuthor,validateCampground} = require('../middleware.js')
const campgrounds = require('../controllers/campgrounds.js')
const multer = require('multer');
const {storage} = require('../cloudinary')
const upload = multer({storage})

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'),validateCampground, catchAsync(campgrounds.createCampground))


    router.get('/new', isLoggedIn,campgrounds.newForm)

router.route('/:id')
.get( isLoggedIn, catchAsync(campgrounds.showCampground))
.put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.upDateCampground))
.delete(isLoggedIn,isAuthor, catchAsync(campgrounds.deleteCampgrund))


router.get('/:id/edit', isLoggedIn,isAuthor,catchAsync(campgrounds.editCampground))


module.exports = router
