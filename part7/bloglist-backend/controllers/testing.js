const testRouter = require('express').Router()
const { resetDb } = require('../utils/test_helper')

// const User = require('../models/user')
// const Blog = require('../models/blog')


testRouter.post('/reset', async (request, response) => {
  await resetDb()
  response.status(204).end()
})


module.exports = testRouter
