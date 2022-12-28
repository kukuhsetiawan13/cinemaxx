const {authenticationMiddleware, authorizationMiddleware} = require('./auths')
const {errorHandler} = require('./errorHandler')

module.exports = {authenticationMiddleware, authorizationMiddleware, errorHandler}
