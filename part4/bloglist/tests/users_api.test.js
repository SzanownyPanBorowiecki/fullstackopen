const { describe, test, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')

const app = require('../app')
const config = require('../utils/config')
const User = require('../models/user')
const helper = require('../utils/test_helper')

const mongoose = require('mongoose')
const bcrypt = require('bcrypt')


const api = supertest(app)

describe('when there are users in the database', () => {
  beforeEach(async () => {
    await User.deleteMany({})
  
    for (let userData of helper.initialUsers) {
      let userObject = new User(userData)
      await userObject.save()
    }
  })

  test('listing users returns HTTP 200, JSON data', async () => {
    await api.get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  
  test('adding user that already exists returns HTTP 400', async () => {
    await api.post('/api/users')
      .send({
        username: helper.initialUsers[0].username,
        name: 'Test name',
        password: 'secret'
      })
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })
})


describe('adding new users', () => {
  beforeEach(async () => {
    await User.deleteMany({})
  })
  
  test('adding new user', async () => {
    const userData = {
      username: 'username',
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

    const isValidPassword = await bcrypt.compare(userData.password, userInDb.passwordHash)
    assert.strictEqual(isValidPassword, true)
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