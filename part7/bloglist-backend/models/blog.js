const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: String,
  url: {
    type: String,
    required: true
  },
  likes: {
    type: Number,
    default: 0
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    select: false
  }]
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject.comments
    delete returnedObject._id
    delete returnedObject.__v
  }
})

// On deleting blog
// - remove linked comments
// - remove blog id from users blogs
const Comment = require('./comment')
const User = require('./user')
blogSchema.post('remove', (doc) => {
  Comment.remove({ _id: { $in: doc.comments } })
  User.updateOne(
    { _id: doc.user },
    { $pull: { blogs: doc._id } }
  )
})



module.exports = mongoose.model('Blog', blogSchema, 'blogs')
