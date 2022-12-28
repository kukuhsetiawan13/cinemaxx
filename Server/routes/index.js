const router = require('express').Router()
const usersRouter = require('./users-router')
const moviesRouter = require('./movies-router')
const genresRouter = require('./genres-router')
const historiesRouter = require('./histories-router')
const wishlistsRouter = require('./wishlist-router')
const {loginAuthentication} = require('../middlewares/auths')



router.get('', (req, res) => {
    res.redirect('/users')
})

// users
router.use('/users', usersRouter)

// movies 
router.use('/movies', moviesRouter)

// genres
router.use('/genres', genresRouter)


// middleware authentication
router.use(loginAuthentication)

// histories
router.use('/histories', historiesRouter)

// wishlist
router.use('/wishlists', wishlistsRouter)

module.exports = router