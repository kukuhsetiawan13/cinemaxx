const router = require('express').Router()
const Controller = require('../controllers')


router.get('', (req, res) => {
    res.redirect('/users/register')
})

// User
// register
router.post('/register', Controller.register)

// login 
router.post('/login', Controller.login)

// google-login
router.post('/google-login', Controller.googleLogin)


// Customer
// register
router.post('/pub/register', Controller.customerRegister)

// login 
router.post('/pub/login', Controller.login)

// google-login
router.post('/pub/google-login', Controller.customerGoogleLogin)

module.exports = router
