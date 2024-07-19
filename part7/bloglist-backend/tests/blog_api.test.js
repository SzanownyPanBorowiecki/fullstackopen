// This needs to be before require('supertest)
// otherwise error handling middleware doesn't catch exceptions
require('express-async-errors')

const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
require('dotenv').config()
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const helper = require('../utils/test_helper')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')


describe('when there are blogs in the database', () => {

  beforeEach(async () => {
    await helper.resetDb()
  })

  test('correct amount of blogs returned in JSON format', async () => {
    const resp = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(resp.body.length, helper.initialBlogs.length)
  })

  test('unique identifier property of the blog posts is named id instead of _id', async () => {
    const resp = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(Object.hasOwn(resp.body[0], 'id'), true)
    assert.strictEqual(Object.hasOwn(resp.body[0], '_id'), false)
  })

  describe('updating blogs', () => {
    test('existing blog can be updated by its creator with proper token', async () => {
      const user = helper.initialUsers[0]
      const token = jwt.sign({ id: user._id, username: user.username }, process.env.SECRET)
      const blogId = user.blogs[0]

      const updatedBlogData = {
        title: 'Updated title',
        author: 'Updated author',
        url: 'http://updated.com',
        likes: 42
      }

      const resp = await api
        .put(`/api/blogs/${blogId}`)
        .set({ 'Authorization': `Bearer ${token}` })
        .send(updatedBlogData)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(resp.body.id, blogId)

      const updatedBlogInDb = await Blog.findById(blogId, '-_id title author url likes').lean()
      assert.deepStrictEqual(updatedBlogData, updatedBlogInDb)
    })


    test('existing blog cannot be updated by non-creator, 401 Unauthorized', async () => {
      const creator = helper.initialUsers[0]
      const blogId = creator.blogs[0]

      const nonCreator = helper.initialUsers[1]
      const nonCreatorToken = jwt.sign({ id: nonCreator._id, username: nonCreator.username }, process.env.SECRET)

      const updatedBlogData = {
        title: 'Updated title',
        author: 'Updated author',
        url: 'http://updated.com',
        likes: 42
      }

      const initialBlogInDb = await Blog.findById(blogId, '-_id title author url likes').lean()

      await api
        .put(`/api/blogs/${blogId}`)
        .set({ 'Authorization': `Bearer ${nonCreatorToken}` })
        .send(updatedBlogData)
        .expect(401)
        .expect('Content-Type', /application\/json/)

      const updatedBlogInDb = await Blog.findById(blogId, '-_id title author url likes').lean()
      assert.deepStrictEqual(initialBlogInDb, updatedBlogInDb)
    })
  })


  describe('deleting blogs', () => {
    test('existing blog can be deleted by its creator with proper token, 401 Unauthorized', async () => {
      const user = helper.initialUsers[0]
      const token = jwt.sign({ id: user._id, username: user.username }, process.env.SECRET)
      const blogId = user.blogs[0]

      await api
        .delete(`/api/blogs/${blogId}`)
        .set({ 'Authorization': `Bearer ${token}` })
        .expect(204)

      const blogData = await helper.blogData(blogId)
      assert.strictEqual(blogData, undefined)
    })

    test('existing blog cannot be deleted by non-creator', async () => {
      const creator = helper.initialUsers[0]
      const blogId = creator.blogs[0]

      const nonCreator = helper.initialUsers[1]
      const nonCreatorToken = jwt.sign({
        id: nonCreator._id,
        username: nonCreator.username }, process.env.SECRET)

      const initialBlog = await Blog.findById(blogId).lean()

      await api
        .put(`/api/blogs/${blogId}`)
        .set({ 'Authorization': `Bearer ${nonCreatorToken}` })
        .expect(401)
        .expect('Content-Type', /application\/json/)

      const finalBlog = await Blog.findById(blogId).lean()
      assert.deepStrictEqual(initialBlog, finalBlog)
    })
  })
})



describe('adding new blogs', () => {
  const user = helper.initialUsers[0]
  const token = jwt.sign({ id: user._id, username: user.username }, process.env.SECRET)

  test('works for correct request', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const newBlog = {
      title: 'Test blog',
      author: 'Test author',
      url: 'http://example.com',
      likes: 2137
    }

    const result = await api
      .post('/api/blogs')
      .set({ 'Authorization': `Bearer ${token}` })
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1)

    const savedBlogId = result.body.id
    const savedBlog = await Blog.findById(savedBlogId, '-_id title author url likes user').lean()
    const userData = await User.findById(user._id)

    assert.deepStrictEqual({ ...newBlog, user: user._id }, { ...savedBlog, user: savedBlog.user.toString() })
    assert.strictEqual(userData.blogs.includes(savedBlogId), true)
    assert.strictEqual(userData.blogs.length, user.blogs.length + 1)
  })


  test('if the likes property is missing from the request, it will default to 0', async () => {
    const newBlog = {
      title: 'Test blog',
      author: 'Test author',
      url: 'http://example.com'
    }

    const result = await api
      .post('/api/blogs')
      .set({ 'Authorization': `Bearer ${token}` })
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const savedBlogId = result.body.id

    const savedBlog = await Blog
      .findById(savedBlogId, '-_id title author url likes')
      .lean()

    assert.deepStrictEqual(savedBlog, { ...newBlog, likes: 0 })
  })

  test('if title is missing return code 400', async () => {
    const newBlog = {
      author: 'Test author',
      url: 'http://example.com',
      likes: 2137
    }

    await api
      .post('/api/blogs')
      .set({ 'Authorization': `Bearer ${token}` })
      .send(newBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/)

  })

  test('if url is missing return code 400', async () => {
    const newBlog = {
      title: 'Test title',
      author: 'Test author',
      likes: 2137
    }

    await api
      .post('/api/blogs')
      .set({ 'Authorization': `Bearer ${token}` })
      .send(newBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/)

  })

  test('if token is missing return code 401', async () => {
    const newBlog = {
      title: 'Test title',
      author: 'Test author',
      likes: 2137
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)
  })

})

after(async () => {
  mongoose.connection.close()
})
