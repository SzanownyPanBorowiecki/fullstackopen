const config = require('./utils/config')

const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const testingRouter = require('./controllers/testing')

const middleware = require('./utils/middleware')
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
mongoose.connect(config.MONGODB_URI)

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

// TEST ONLY: slow down
app.use((req,res,next) => setTimeout(next,500))

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

if (process.env.NODE_ENV === 'test') {
  app.use('/api/testing', testingRouter)
}

app.use(middleware.errorHandler)

app.use(middleware.unknownEndpoint)

module.exports = app
