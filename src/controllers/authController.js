const { model } = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const authConfig = require('../config/auth.json')

const UserAuth = model('UserAuth')

function generateToken (params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400
  })
}

module.exports = {
  async index (request, response) {
    const users = await UserAuth.find()
    if (!users) {
      return response.status(404).json({ message: 'Users not found' })
    };

    return response.json(users)
  },

  async store (request, response) {
    const { email } = request.body
    try {
      if (await UserAuth.findOne({ email })) {
        return response.status(400).send({ error: 'User alread exists' })
      }
      const user = await UserAuth.create(request.body)

      // para não retorna a senha
      user.password = undefined

      return response.json({
        user,
        token: generateToken({ id: user.id })
      })
    } catch {
      return response.status(400).json({ message: 'Registration failed' })
    }
  },

  async authenticate (request, response) {
    const { email, password } = request.body
    const user = await UserAuth.findOne({ email }).select('+password')
    if (!user) {
      return response.status(404).send({ error: 'User not found' })
    }

    if (!await bcrypt.compare(password, user.password)) {
      return response.status(400).json({ error: 'Invalid password' })
    }
    // Retorna um pequeno error no terminal
    user.password = undefined

    return response.json({
      user,
      token: generateToken({ id: user.id })
    })
  }

}
