const bcrypt = require('bcryptjs')

const generateHashedPassword = (password) => {
    const salt = bcrypt.genSaltSync(8);
    return bcrypt.hashSync(password, 8);
}

const verifyHashedPassword = (password, hashedPassword) => {
    return bcrypt.compareSync(password, hashedPassword)
}

module.exports = {
    generateHashedPassword,
    verifyHashedPassword
}