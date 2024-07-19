const bcrypt = require('bcrypt')

const usersRouter = require('express').Router()
const User = require('../models/user')

// Get all users
usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({})
  response.json(users)
})


// Add user
usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (password.length < 3) {
    return response.status(400).json({
      error: 'Password must be at least 3 characters long'
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  const newUser = new User({ username, name, passwordHash })
  const savedUser = await newUser.save()
  response.status(201).json(savedUser)
})


// Get user info
usersRouter.get('/:id', async (request, response) => {
  const userId = request.params.id
  const user = await User.findById(userId)
  if (!user) {
    return response.status(404).send()
  }
  response.json(user)
})


// Get blogs added by user
usersRouter.get('/:id/blogs', async (request, response) => {
  const userId = request.params.id
  const user = await User
    .findById(userId)
    .populate('blogs', { title: 1, author: 1, id: 1 })

  if (!user) {
    return response.status(404).send()
  }
  response.json(user.blogs)
})

module.exports = usersRouter
