const { userExtractor } = require('../utils/middleware')

const blogsRouter = require('express').Router()

const Blog = require('../models/blog')
const User = require('../models/user')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const user = await User.findById(request.user.id)
  const blog = new Blog({ ...request.body, user: user._id })
  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.put('/:id', userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404)
  }

  //if (blog.user.toString() !== request.user.id) {
  //  return response.status(401).json({ error: 'modification of another user\'s blog not permitted' })
  //}

  const result = await Blog
    .findByIdAndUpdate(
      request.params.id,
      request.body,
      { new: true, runValidators: true, context: 'query' }
    )
    .populate('user', { username: 1, name: 1 })

  if (!result) return response.status(404)

  response.json(result)
})


blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const user = await User.findById(request.user.id)
  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).send()
  }

  if (blog.user.toString() !== request.user.id) {
    return response.status(401).json({ error: 'deletion of another user\'s blog not permitted' })
  }

  await blog.deleteOne()

  user.blogs = user.blogs.filter(b => b._id !== blog._id)
  await user.save()

  response.status(204).send()
})


module.exports = blogsRouter
