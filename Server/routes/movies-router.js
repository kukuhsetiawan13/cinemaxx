const router = require('express').Router()
const Controller = require('../controllers')
const {loginAuthentication, isAuthorizedUser, isAdmin} = require('../middlewares/auths')


router.get('/pub', Controller.showAllMovies)

router.get('/pub/find/:movieId', Controller.findMovieById)

// middleware authentication
router.use(loginAuthentication)

router.post('/add', Controller.addMovie)

router.get('', Controller.showAllMovies)

router.get('/find/:movieId', Controller.findMovieById)

router.delete('/delete/:movieId', isAuthorizedUser, Controller.deleteMovieById)

router.put('/edit/:movieId', isAuthorizedUser, Controller.editMovie)

router.patch('/edit-status/:movieId', isAuthorizedUser, isAdmin, Controller.editStatus)



module.exports = router
