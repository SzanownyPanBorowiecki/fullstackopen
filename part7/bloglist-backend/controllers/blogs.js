const { userExtractor } = require('../utils/middleware')

const blogsRouter = require('express').Router()

const Blog = require('../models/blog')
const User = require('../models/user')
const Comment = require('../models/comment')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.get('/:id', async (request,response) => {
  const blog = await Blog
    .findById(request.params.id)
    .populate('user', { username: 1, name: 1 })
  if (!blog) {
    return response.status(404).send()
  }
  response.json(blog)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const blog = new Blog({ ...request.body, user: request.user.id })
  const savedBlog = await blog.save()
  await savedBlog.populate('user', { username: 1, name: 1 })

  await User.findByIdAndUpdate(
    request.user.id,
    { $push: { blogs: savedBlog._id } }
  )

  response.status(201).json(savedBlog)
})

blogsRouter.put('/:id', userExtractor, async (request, response) => {
  const result = await Blog
    .findByIdAndUpdate(
      request.params.id,
      request.body,
      { new: true, runValidators: true, context: 'query' }
    )
    .populate('user', { username: 1, name: 1 })

  if (!result) return response.status(404).send()

  response.json(result)
})

blogsRouter.post('/:id/comments', userExtractor, async (request, response) => {
  const comment = new Comment({ ...request.body, blog: request.params.id })
  const blog = await Blog.findByIdAndUpdate(
    request.params.id,
    { $push: { comments: comment._id } }
  )
  if (!blog) return response.status(404).send()

  const savedComment = await comment.save()
  response.status(201).json(savedComment)
})

blogsRouter.get('/:id/comments', userExtractor, async (request, response) => {
  const blog = await Blog
    .findById(request.params.id)
    .populate('comments', { createdAt: 1, content: 1 })
  response.json(blog.comments)
})

blogsRouter.post('/:id/likes', userExtractor, async (request, response) => {
  const id = request.params.id
  const result = await Blog.findByIdAndUpdate(
    id,
    { $inc: { likes: 1 } },
    { new: true }
  )

  if (!result) return response.status(404).send()
  response.status(201).json({ likes: result.likes })
})


blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).send()
  }

  if (blog.user.toString() !== request.user.id) {
    return response.status(401).json({
      error: 'deletion of another user\'s blog not permitted'
    })
  }

  await blog.deleteOne()

  // *** note: deleting from user's blog array handled by middleware ***
  // const user = await User.findById(request.user.id)
  // user.blogs = user.blogs.filter(b => b._id !== blog._id)
  // await user.save()

  response.status(204).send()
})



module.exports = blogsRouter
