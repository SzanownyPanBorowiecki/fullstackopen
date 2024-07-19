const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: v => v.length >= 3
    }
  },
  name: {
    type: String,
    required: true
  },
  passwordHash: String,
  blogs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog'
  }]
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    console.log('user toJSON:', document, returnedObject)
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})

// On deleting user
// - remove linked blogs
const Blog = require('./blog')
userSchema.post('remove', (doc) => {
  Blog.remove({ _id: { $in: doc.blogs } })
})

module.exports = mongoose.model('User', userSchema, 'users')
