const request = require('supertest')
const express = require("express");
const app = require('../app')
const {generateHashedPassword} = require('../helpers/bcrypt')
const {sequelize} = require('../models')
const {generateToken} = require('../helpers/jwt')


const users = require('../data/data.json').Users
users.forEach(el => {
    el.createdAt = el.updatedAt = new Date()
    el.password = generateHashedPassword(el.password)
})

const genres = require('../data/data.json').Genres
genres.forEach(el => {
    el.createdAt = el.updatedAt = new Date()
})

const movies = require('../data/data.json').Movies
movies.forEach(el => {
    el.createdAt = el.updatedAt = new Date()
})


beforeAll( async () => {
    try {
        await sequelize.queryInterface.bulkInsert('Users', users)
        await sequelize.queryInterface.bulkInsert('Genres', genres)
        await sequelize.queryInterface.bulkInsert('Movies', movies)
        await sequelize.queryInterface.bulkInsert('Wishlists', [{
            UserId: 13,
            MovieId: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        }])
    } catch (err) {
        console.log(err)
    }
}) 


afterAll( async () => {
    try {
        await sequelize.queryInterface.bulkDelete('Wishlists', null, {
            truncate: true,
            restartIdentity: true,
            cascade: true
        })
        await sequelize.queryInterface.bulkDelete('Movies', null, {
            truncate: true,
            restartIdentity: true,
            cascade: true
        })
        await sequelize.queryInterface.bulkDelete('Genres', null, {
            truncate: true,
            restartIdentity: true,
            cascade:true
        })
        await sequelize.queryInterface.bulkDelete('Users', null, {
            truncate: true,
            restartIdentity: true,
            cascade: true
        })
    } catch(err) {
        console.log(err)
    }
}) 



describe.skip('POST /users/pub/register', () => {
    test('success register', async() => {
        const res = await request(app)
            .post('/users/pub/register')
            .send({
                email: "userTest10@mail.com",
                password: "userTest10"
            })
        
        expect(res.status).toBe(201)
        expect(res.body).toMatchObject({
            email: "userTest10@mail.com",
            password: expect.any(String),
            role: "Customer"
        })
    })

    test('email is not given', async() => {
        const res = await request(app)
            .post('/users/pub/register')
        expect(res.status).toBe(400)
        expect(res.body).toMatchObject({
            message: expect.arrayContaining(['Email can not be empty'])
        })
    })

    test('password is not given', async() => {
        const res = await request(app)
            .post('/users/pub/register')
        expect(res.status).toBe(400)
        expect(res.body).toMatchObject({
            message: expect.arrayContaining(['Password can not be empty'])
        })
    })

    test('email is an empty string', async() => {
        const res = await request(app)
            .post('/users/pub/register')
            .send({
                email: ""
            })
        expect(res.status).toBe(400)
        expect(res.body).toMatchObject({
            message: expect.arrayContaining(['Email can not be empty'])
        })
    })

    test('password is an empty string', async() => {
        const res = await request(app)
            .post('/users/pub/register')
            .send({
                password: ""
            })
        expect(res.status).toBe(400)
        expect(res.body).toMatchObject({
            message: expect.arrayContaining(["Password can not be empty"])
        })
    })

    test('email has been registered', async() => {
        const res = await request(app)
            .post('/users/pub/register')
            .send({
                email: "rowling@mail.com",
                password: "rowling"
            })
        expect(res.status).toBe(400)
        expect(res.body).toMatchObject({
            message: "Email has already been registered"
        })
    })

    test('invalid email format', async() => {
        const res = await request(app)
            .post('/users/pub/register')
            .send({
                email: "rowling",
                password: "rowling"
            })
        expect(res.status).toBe(400)
        expect(res.body).toMatchObject({
            message: expect.arrayContaining(["Email is not valid"])
        })
    })

})


describe.skip('POST/users/pub/login', () => {
    test('customer succesfully log in', async () => {
        const res = await request(app)
            .post('/users/login')
            .send({
                email: "rowling@mail.com",
                password: "rowling"
            })
        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty("access_token", expect.any(String))
    })

    test('password is not correct', async () => {
        const res = await request(app)
            .post('/users/login')
            .send({
                email: "rowling@mail.com",
                password: "12345"
            })
        expect(res.status).toBe(401)
        expect(res.body).toHaveProperty("message", "Invalid password")
    })

    test('email is not found in the dataabse', async () => {
        const res = await request(app)
            .post('/users/login')
            .send({
                email: "123@mail.com",
                password: "12345"
            })
        expect(res.status).toBe(401)
        expect(res.body).toHaveProperty("message", "Invalid email")
    })
})


describe.skip('GET /movies/pub', () => {
    test('fetch movies data without access token', async() => {
        const res = await request(app)
            .get('/movies/pub')

        expect(res.status).toBe(200)
        expect(res.body).toEqual(expect.any(Array))
        expect(res.body[0]).toMatchObject({
            title: expect.any(String),
            synopsis: expect.any(String),
            trailerUrl: expect.any(String),
            imgUrl: expect.any(String),
            rating: expect.any(Number),
            Genre: expect.objectContaining({
                name: expect.any(String)
            }),
            User: expect.objectContaining({
                email: expect.any(String)
            })
        })
    })

    test('fetch movies data with filters', async() => {
        const res = await request(app)
            .get('/movies/pub')
            .query({
                filter: {
                    search: 'chamber',
                    rating: 7
                }
            })

        expect(res.status).toBe(200)
        expect(res.body).toEqual(expect.any(Array))

    })

    test('fetch movies data with pagination', async() => {
        const res = await request(app)
            .get('/movies/pub')
            .query({
                page: {
                    size: 9,
                    number: 2
                }
            })

        expect(res.status).toBe(200)
        expect(res.body).toEqual(expect.any(Array))
        expect(res.body).toHaveLength(9)
        expect(res.body[0]).toMatchObject({
            title: expect.any(String),
            synopsis: expect.any(String),
            trailerUrl: expect.any(String),
            imgUrl: expect.any(String),
            rating: expect.any(Number),
            Genre: expect.objectContaining({
                name: expect.any(String)
            }),
            User: expect.objectContaining({
                email: expect.any(String)
            })
        })
    })


    test('succesfully fetch movie data by id', async() => {
        const res = await request(app)
            .get('/movies/pub/find/9')

        expect(res.status).toBe(200)
        expect(res.body).toMatchObject({
            title: expect.any(String),
            synopsis: expect.any(String),
            trailerUrl: expect.any(String),
            imgUrl: expect.any(String),
            rating: expect.any(Number),
            Genre: expect.objectContaining({
                name: expect.any(String)
            }),
            User: expect.objectContaining({
                email: expect.any(String)
            })
        })
        
    })

    test('fail to fetch movie data by id', async() => {
        const res = await request(app)
            .get('/movies/pub/find/99')

            console.log(res.body)
        expect(res.status).toBe(404)
        expect(res.body).toHaveProperty('message', 'Movie not found')
        
    })

})

describe('/get/wishlists/pub and /post/wishlists/pub/addMovie/:movieId', () => {

    const adminToken = generateToken({id: 2})
    const customerToken = generateToken({id: 13})

    test('get wishlist based on specific customer', async() => {
        const res = await request(app)
            .get('/wishlists/pub')
            .set('access_token', customerToken)

        console.log(res.status, res.body)
        expect(res.status).toBe(200)
        expect(res.body).toEqual(expect.any(Array))
        expect(res.body[0]).toMatchObject({
            UserId: expect.any(Number),
            MovieId: expect.any(Number),
            Movie: expect.objectContaining({
                title: expect.any(String)
            })
        })
    })

    test('succesfully add a movie to wishlist', async() => {
        const res = await request(app)
            .post('/wishlists/pub/addMovie/1')
            .set('access_token', customerToken)

        expect(res.status).toBe(201)
        expect(res.body).toContain('has been added to your wishlist')
    })

    test('fail to add a movie to wishlist because of wrong movie id', async() => {
        const res = await request(app)
            .post('/wishlists/pub/addMovie/1000')
            .set('access_token', customerToken)

        expect(res.status).toBe(404)
        expect(res.body).toHaveProperty('message', 'Movie not found')
    })

    test(`fail to add a movie to wishlist because of hasn't logged in`, async() => {
        const res = await request(app)
            .post('/wishlists/pub/addMovie/1000')

        expect(res.status).toBe(401)
        expect(res.body).toHaveProperty('message', 'Invalid T  oken')
    })

    test('fail to add a movie to wishlist because of wrong movie id', async() => {
        const res = await request(app)
            .post('/wishlists/pub/addMovie/1000')
            .set('access_token', adminToken)

        expect(res.status).toBe(403)
        expect(res.body).toHaveProperty('message', 'Forbidden')
    })

})
