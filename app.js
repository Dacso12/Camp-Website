if(process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}

console.log(process.env.SECRET)
console.log(process.env.API_KEY)




const express = require('express')
const path = require('path');
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const session = require('express-session')
const flash = require('connect-flash')
const ExpressError = require('./utils/ExpressError')
const methodOverride = require('method-override')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user.js')
const mongoSanitize = require('express-mongo-sanitize');



const userRoutes = require('./routes/users.js')
const campgrounds = require('./routes/campgrounds.js')
const reviews = require('./routes/reviews.js')

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
.then(() => {
    console.log("Mongo connection open")
})
.catch(err => {
    console.log("Error")
    console.log(err)
})


const app = express()

app.engine('ejs',ejsMate)
app.set('views', path.join(__dirname, 'views'));  // Ensure this points to the 'views' directory
app.set('view engine', 'ejs');  // Ensure ejs is set as the view engine


app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));
app.use(mongoSanitize());
app.use('/leaflet', express.static(path.join(__dirname, 'node_modules/leaflet/dist')));
app.use('/leaflet-cluster', express.static(path.join(__dirname, 'node_modules/leaflet.markercluster/dist')));



const sessionConfing = {
    name: 'session',
    secret: 'xd',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfing))
app.use(flash())
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
    console.log(req.query)
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

app.use('/', userRoutes)
app.use('/campgrounds',campgrounds)
app.use('/campgrounds/:id/reviews', reviews)

app.get('/', (req, res) => {
    res.render('home')
});





app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})