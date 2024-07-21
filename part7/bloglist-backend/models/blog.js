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
    ref: 'Comment'
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

const User = require('../models/user')
const Comment = require('../models/comment')

blogSchema.pre(
  'deleteOne',
  { document: true, query: false },
  function(){
    // Remove blog reference from user
    User.updateOne(
      { _id: this.user },
      { $pull: { blogs: this._id } }
    ).exec()

    // Delete all comments associated with this blog
    Comment.deleteMany({
      _id: { $in: this.comments }
    }).exec()
  }
)


module.exports = mongoose.model('Blog', blogSchema, 'blogs')
