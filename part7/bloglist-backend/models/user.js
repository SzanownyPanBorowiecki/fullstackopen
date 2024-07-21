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
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})

userSchema.pre(
  'deleteOne',
  { document: true, query: false },
  function(next){
    // Delete all blogs associated with this user
    this.model('Blog').deleteMany({ user: this._id }).exec()

    next()
  }
)

module.exports = mongoose.model('User', userSchema, 'users')
