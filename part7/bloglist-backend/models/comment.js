const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
  blog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog',
    requred: true
  },
  content: {
    type: String,
    requred: true
  }
}, { timestamps: true })

commentSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject.updatedAt
    delete returnedObject._id
    delete returnedObject.__v

  }
})

module.exports = mongoose.model('Comment', commentSchema, 'comments')
