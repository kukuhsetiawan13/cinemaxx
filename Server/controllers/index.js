const {User, Movie, Genre, History, Wishlist} = require('../models')
const {verifyHashedPassword} = require('../helpers/bcrypt')
const {generateToken, verifyToken} = require('../helpers/jwt')
const { Op } = require("sequelize");
const {OAuth2Client} = require('google-auth-library')
const client = new OAuth2Client(process.env.CLIENT_ID)


class Controller {

    // User - register
    static async register (req, res, next) {
        try {
            const {email, password, phoneNumber, address} = req.body
            let username

            if(email) username = req.body.username || email.slice(0,email.lastIndexOf('@'))

           const newUser = await User.create({username, email, password, phoneNumber, address})

           res.status(201).json({message: `User with email ${newUser.email} has just been created`})
        } catch (err) {
            next(err)
        }
    }
    
    // User - login
    static async login (req, res, next) {
        try {
            const {email, password} = req.body

            const loginUser = await User.findOne({where: {email}})
            if(!loginUser) throw ('Invalid email/password')

            const isValidPassword = verifyHashedPassword(password, loginUser.password)
            if(!isValidPassword) throw ('Invalid password')

            const payload = {
                id: loginUser.id
            }

            const access_token = generateToken(payload)

            res.status(200).json({access_token, username: loginUser.username})

        } catch (err) {
            next (err)
        }
    }

    // User - Google sign-in
    static async googleLogin (req, res, next) {
        try {
            const token = req.headers['google-oauth-token']

            // verify google
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: process.env.CLIENT_ID  
            });

            const {email, name} = ticket.getPayload();
            const [user, created] = await User.findOrCreate({
                where: { email },
                defaults: {
                  username: name,
                  email,
                  password: 'google',
                  role: 'Staff'
                },
                hooks: false
            });
            
            const payload = {
                id: user.id
            }

            const access_token = generateToken(payload)

            res.status(200).json({access_token, username: user.username})
        } catch (err) {
            next(err)
        }
    }


    // Public - Register
    static async customerRegister (req, res, next) {
        try {
            const {email, password, phoneNumber, address} = req.body
            let username 

            if(email) username = req.body.username || email.slice(0,email.lastIndexOf('@'))

            const role = 'Customer'

           const newCustomer = await User.create({username, email, password, phoneNumber, address, role})

           const payload = {
                id: newCustomer.id
           }

           const access_token = generateToken(payload)

            res.status(201).json({message: `User ${newCustomer.username} has just been created`, access_token})
        } catch (err) {
            next(err)
        }
    }

    // Public - login
    static async login (req, res, next) {
        try {
            const {email, password} = req.body

            const loginUser = await User.findOne({where: {email}})
            if(!loginUser) throw ('Invalid email')

            if(loginUser.role !== 'Customer') throw('Forbidden')

            const isValidPassword = verifyHashedPassword(password, loginUser.password)
            if(!isValidPassword) throw ('Invalid password')

            const payload = {
                id: loginUser.id
            }

            const access_token = generateToken(payload)

            res.status(200).json({access_token, username: loginUser.username})

        } catch (err) {
            next (err)
        }
    }

    // Public - Google sign-in
    static async customerGoogleLogin (req, res, next) {
        try {
            const token = req.headers['google-oauth-token']

            // verify google
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: process.env.CLIENT_ID  
            });

            const {email, name} = ticket.getPayload();
            const [user, created] = await User.findOrCreate({
                where: { email },
                defaults: {
                  username: name,
                  email,
                  password: 'google',
                  role: 'Customer'
                },
                hooks: false
            });
            
            const payload = {
                id: user.id
            }

            const access_token = generateToken(payload)

            res.status(200).json({access_token, username: user.username})
        } catch (err) {
            next(err)
        }
    }

    // Movies - add movie
    static async addMovie (req, res, next) {
        try {
            const {title, synopsis, trailerUrl, imgUrl, rating, genreId} = req.body

            const authorId = req.userAuthenticationInfo.id


            const option = {
                title,
                synopsis,
                rating,
                authorId
            }
            if(trailerUrl) option.trailerUrl = trailerUrl
            if(imgUrl) option.imgUrl = imgUrl
            if(genreId) option.genreId = genreId
            
            const newMovie = await Movie.create(option)

            await History.create({
                title: newMovie.title,
                description: `New movie with id ${newMovie.id} is created`,
                updatedBy: req.userAuthenticationInfo.email
            })
            
            res.status(201).json(newMovie)
        } catch(err) {
            next(err)
        }
    }


    // Movies - show all movies
    static async showAllMovies (req, res, next) {
        try{
            const {filter, page} = req.query
            
            const option = {
                order: [['id', 'ASC']],
                include: [
                   {
                    model: User
                   },
                   {
                    model: Genre
                   }
                ]
            }

            if(filter && Object.keys(filter).length !== 0) {
                option.where = {}
                
                if(filter.search && filter.search !== '') option.where.title = {[Op.iLike]: `%${filter.search}%`}
                if(filter.genre && filter.genre !== '') option.include[1].where = {name: filter.genre} 
            }

            if(page && Object.keys(page).length !== 0) {
                if(page.size && page.size !== '') option.limit = page.size

                if(page.number && page.number !== '' && option.limit) option.offset = page.number * option.limit - option.limit
            }

            const movies = await Movie.findAll(option)
            res.status(200).json(movies)
        } catch (err) {
            next(err)
        }
        
    }

    // Movies - find movie by Id
    static async findMovieById (req, res, next) {
         try {
            const {movieId} = req.params
            const foundMovie = await Movie.findByPk(movieId, {
                include: [
                    User,
                    Genre
                ]
            })

            if(foundMovie) res.status(200).json(foundMovie)
            else throw ('Movie not found')
        } catch (err) {
            next(err)
        }
    }


    // Movies - delete movie by id
    static async deleteMovieById (req, res, next) {
        try {
            const {movieId} = req.params
            const theSearchedMovie = await Movie.findByPk(movieId)
            if(!theSearchedMovie) throw ('Movie not found')

            await Movie.destroy({
                where: {
                    id: movieId
                }
            })

            await History.create({
                title: theSearchedMovie.title,
                description: `Movie with id ${theSearchedMovie.id} is deleted`,
                updatedBy: req.userAuthenticationInfo.email
            })

            res.status(200).json({message: `${theSearchedMovie.title} has been succesfully deleted`})
        } catch(err) {
            next(err)
        }
    }

    // Movies - edit 
    static async editMovie (req, res, next) {
        try {
 
            const {movieId} = req.params
            

            const theSearchedMovie = await Movie.findByPk(movieId)
            if(!theSearchedMovie) throw ('Movie not found')
            
            const {title, synopsis, trailerUrl, imgUrl, rating, genreId} = req.body
            const authorId = req.userAuthenticationInfo.id

            const option = {
                title,
                synopsis,
                rating,
                authorId
            }
            if(trailerUrl) option.trailerUrl = trailerUrl
            if(imgUrl) option.imgUrl = imgUrl
            if(genreId) option.genreId = genreId
            
            const updatedMovie = await Movie.update(option, {
                where: {id: movieId},
                returning: ['*']
            })

    
            await History.create({
                title: theSearchedMovie.title,
                description: `Movie with id ${theSearchedMovie.id} is updated`,
                updatedBy: req.userAuthenticationInfo.email
            })

            res.status(200).json(`Movie with id ${theSearchedMovie.id} has just been updated`)

        } catch(err) {
            next(err)
        }
    }

    // Movies - edit status
    static async editStatus (req, res, next) {
        try {
 
            const {movieId} = req.params
            const {status} = req.body

            const theSearchedMovie = await Movie.findByPk(movieId)
            if(!theSearchedMovie) throw ('Movie not found')
 
            const updatedMovie = await Movie.update({status}, {
                where: {
                    id: theSearchedMovie.id
                },
                returning: ['*']
            })

            await History.create({
                title: theSearchedMovie.title,
                description: `Movie'status with id ${movieId} has been updated from ${theSearchedMovie.status} to ${updatedMovie[1][0].status}`,
                updatedBy: req.userAuthenticationInfo.email
            })

            res.status(200).json(`${theSearchedMovie.title}'s status has been changed to ${status}`)
        } catch(err) {
            next(err)
        }
    }


    // Genres - show all genres 
    static async showAllGenres (req, res, next) {
        try {
            const genres = await Genre.findAll({
                order: [['id', 'ASC']]
            })
            res.status(200).json(genres)
        } catch (err) {
            next(err)
        }
    }

    // Genres - add genre
    static async addGenre (req, res, next) {
        try {

            const {name} = req.body
            const newGenre = await Genre.create({name})

            res.status(201).json(newGenre)
        } catch (err) {

            next(err)
        }
    }

    // Genres - delete genre
    static async deleteGenre (req, res, next) {
        try {
            const {genreId} = req.params

            const theSearchedGenre = await Genre.findByPk(genreId)
            if(!theSearchedGenre) throw ('Genre not found')

            const deletedGenre = await Genre.destroy({
                where: {
                    id: genreId
                }
            })
            res.status(200).json(`Genre ${theSearchedGenre.name} has just been deleted`)
        } catch (err) {
            next(err)
        }
    }

    // Genres - edit genre
    static async editGenre (req, res, next) {
        try {
            const {genreId} = req.params
            const {name} = req.body

            const theSearchedGenre = await Genre.findByPk(genreId)
            if(!theSearchedGenre) throw ('Genre not found')

            const editedGenre = await Genre.update({name}, {
                 where: {
                    id: genreId
                }, 
                returning: ['*']
            })

            res.status(200).json(`Genre ${theSearchedGenre.name} has just been edited to ${editedGenre[1][0].name}`)
        } catch (err) {
            next(err)
        }
    }

    // Histories - show Histories
    static async showHistories (req, res, next) {
        try {
            const histories = await History.findAll({
                order: [['id', 'DESC']]
            })

            res.status(200).json(histories)
        } catch (err) {
            next(err)
        }
    }

    // Bookmark - show bookmark
    static async showBookmark (req, res, next) {
        try {
           const UserId = req.userAuthenticationInfo.id

            const wishlist = await Wishlist.findAll({
                where: {
                    UserId
                },
                include: Movie
            })

            res.status(200).json(wishlist)
        } catch (err) {
            next(err)
        }
    }

    // Bookmark - add movie to bookmark
    static async addToBookmark (req, res, next) {
        try {
            const {movieId} = req.params

            const theSearchedMovie = await Movie.findByPk(movieId)
            if(!theSearchedMovie) throw ('Movie not found')

            const isDuplicate = await Wishlist.findOne({
                where: {
                    [Op.and]: [
                        { UserId: req.userAuthenticationInfo.id },
                        { MovieId: movieId }
                    ]
                }
            })
            if(isDuplicate) throw ('This movie is already bookmarked')

            await Wishlist.create({
                UserId: req.userAuthenticationInfo.id,
                MovieId: movieId
            })


            res.status(201).json(`${theSearchedMovie.title} has been added to your bookmark`)
        } catch (err) {
            next(err)
        }
    }

    // Bookmark - delete movie from bookmark
    static async deleteFromBookmark (req, res, next) {
        try {
            const {movieId} = req.params

            const theSearchedMovie = await Movie.findByPk(movieId)
            if(!theSearchedMovie) throw ('Movie not found')

            const theSearchedBookmark = await Wishlist.findOne({
                where: {
                    [Op.and]: [
                        { UserId: req.userAuthenticationInfo.id },
                        { MovieId: movieId }
                    ]
                }
            })
            if(!theSearchedBookmark) throw ('Bookmark not found')

            await Wishlist.destroy({
                where: {
                   id: theSearchedBookmark.id
                }
            })


            res.status(200).json(`${theSearchedMovie.title} has been removed from your bookmark`)
        } catch (err) {
            next(err)
        }
    }
    

}

module.exports = Controller