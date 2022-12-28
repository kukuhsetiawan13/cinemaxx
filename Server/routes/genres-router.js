const router = require('express').Router()
const Controller = require('../controllers')
const {loginAuthentication} = require('../middlewares/auths')



router.get('/pub', Controller.showAllGenres)

router.use(loginAuthentication)

router.get('', Controller.showAllGenres)

router.post('/add', Controller.addGenre)

router.delete('/delete/:genreId', Controller.deleteGenre)

router.patch('/edit/:genreId', Controller.editGenre)

module.exports = router
