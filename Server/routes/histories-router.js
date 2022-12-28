const router = require('express').Router()
const Controller = require('../controllers')


router.get('', Controller.showHistories)


module.exports = router