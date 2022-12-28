const {verifyToken} = require('../helpers/jwt')
const {User, Movie} = require('../models')


const loginAuthentication = async(req, res, next) => {
    try {
        const {access_token} = req.headers
        if(!access_token) throw('Invalid token')

        const payload = verifyToken(access_token)
        
        const theSearchedUser = await User.findByPk(payload.id)
        if(!theSearchedUser) throw ('Invalid token')

        req.userAuthenticationInfo = {
            id: theSearchedUser.id,
            role: theSearchedUser.role,
            email: theSearchedUser.email
        }
        
        next()
    } catch (err) {
        next(err)
    }
}



const isAuthorizedUser = async (req, res, next) => {
    try {
        
        const {movieId} = req.params
        
        const specificMovie = await Movie.findByPk(+movieId)
        if(!specificMovie) throw ('Movie not found')
        
        if(req.userAuthenticationInfo.role === 'Admin') next()
        else {
            if(specificMovie.authorId !== req.userAuthenticationInfo.id) throw ('Forbidden')
            next()
        }
    } catch (err) {
        next(err)
    }

}

const isAdmin = (req, res, next) => {
    if(req.userAuthenticationInfo.role === 'Admin') next()
    else throw ('Forbidden')
}

const isCustomer = (req, res, next) => {
    if(req.userAuthenticationInfo.role === 'Customer') next()
    else throw ('Forbidden')
}

module.exports = {loginAuthentication, isAuthorizedUser, isAdmin, isCustomer}