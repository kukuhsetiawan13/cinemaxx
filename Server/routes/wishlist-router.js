const router = require('express').Router()
const Controller = require('../controllers')
const {isCustomer} = require('../middlewares/auths')



// isCustomer authentication
router.use(isCustomer)

router.get('/pub', Controller.showBookmark)

router.post('/pub/addToBookmark/:movieId', Controller.addToBookmark)

router.delete('/pub/deleteFromBookmark/:movieId', Controller.deleteFromBookmark)


module.exports = router