const express = require('express')
const mongoose = require('mongoose')
const requireDir = require('require-dir')

const server = express()

server.use(express.json())

mongoose.connect('mongodb://localhost:27017/auth', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})

requireDir('./models')

server.use('/auth', require('./routes'))

const port = 3333

server.listen(port, console.log(`Server running at port ${port}`))
