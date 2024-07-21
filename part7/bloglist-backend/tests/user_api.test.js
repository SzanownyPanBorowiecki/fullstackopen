// This needs to be before require('supertest)
// otherwise error handling middleware doesn't catch exceptions
require('express-async-errors')

const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')

const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('../utils/test_helper')

const app = require('../app')
const api = supertest(app)


const User = require('../models/user')
const bcrypt = require('bcrypt')


describe('when there are users in the database', async () => {
  beforeEach(async () => {
    await helper.resetDb()
  })

  test('listing users returns HTTP 200, JSON data', async () => {
    await api.get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })


  test('adding user that already exists returns HTTP 400', async () => {
    const existingUsers = await User.find({})
    const existingUsername = existingUsers[0].username

    const userData = {
      username: existingUsername,
      name: 'Test name',
      password: 'secret'
    }
    console.log('userdata', userData)
    await api.post('/api/users')
      .send(userData)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })
})


describe('adding new users', () => {
  test('adding new user', async () => {
    const userData = {
      username: 'nonexistentusername',
      name: 'name',
      password: 'secret'
    }

    const resp = await api.post('/api/users')
      .send(userData)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const userId = resp.body.id

    const userInDb = await User
      .findById(userId, '-_id username name passwordHash')
      .lean()

    const isWorkingPasswordHash = await bcrypt.compare(userData.password, userInDb.passwordHash)
    assert.strictEqual(isWorkingPasswordHash, true)
    assert.deepStrictEqual(
      {
        username: userData.username,
        name: userData.name,
      },
      {
        username: userInDb.username,
        name: userInDb.name
      })
  })

  test('adding user with username shorter than 3 characters returns HTTP 400', async () => {
    await api.post('/api/users')
      .send({
        username: 'a',
        name: 'Test name',
        password: 'secret'
      })
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })


  test('adding user with password shorter than 3 characters returns HTTP 400', async () => {
    await api.post('/api/users')
      .send({
        username: 'uniquelogin',
        name: 'Test name',
        password: 'a'
      })
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })
})

after(async () => {
  mongoose.connection.close()
})
