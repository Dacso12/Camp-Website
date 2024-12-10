const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const { storeReturnTo } = require('../middleware');
const users = require('../controllers/user')

router.get('/register',(users.userRender))

router.post('/register', catchAsync(users.registerUser))

router.get('/login',(users.loginRender))

router.post('/login',(users.loginUser))

router.get('/logout',(users.logoutUser))

/*router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'welcome back!');
    res.redirect('/campgrounds');
})*/

module.exports = router