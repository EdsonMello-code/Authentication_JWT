const { Schema, model } = require('mongoose')
const bcrypt = require('bcryptjs')

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true
  },

  password: {
    type: String,
    required: true,
    select: false
  },

  createAt: {
    type: Date,
    default: Date.now
  }
})

// executa algo antes de salvar
// Usar function em vez de arrow function
UserSchema.pre('save', async function (next) {
  const hash = await bcrypt.hash(this.password, 10 /* número de quantos hash vai ser gerado */)

  this.password = hash

  next()
})

model('UserAuth', UserSchema)
