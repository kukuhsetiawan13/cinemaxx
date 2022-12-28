const jwt = require('jsonwebtoken');
require('dotenv').config()


const generateToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET)
}

const verifyToken = (token) => {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
}

module.exports = {
    generateToken,
    verifyToken
}