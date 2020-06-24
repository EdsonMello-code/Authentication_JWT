const { Router } = require('express')

const authController = require('./controllers/authController')
const autMiddleware = require('./middlewares/auth')

const routes = Router()

routes.get('/', autMiddleware, authController.index)
routes.post('/register', authController.store)
routes.post('/autenticate', authController.authenticate)

module.exports = routes
