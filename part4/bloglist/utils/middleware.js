const jwt = require('jsonwebtoken')

const getToken = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
}

const userExtractor = (request, response, next) => {
  const token = getToken(request)
  const decodedToken = jwt.verify(token, process.env.SECRET)

  if (!decodedToken.id) {
    next({
      name: 'TokenAuthError',
      message: 'Invalid token'
    })
  }

  request.user = {
    username: decodedToken.username,
    id: decodedToken.id
  }

  next()
}

const errorHandler = (error, request, response, next) => {
  console.log('errorHandler: ', error.message)

  if (error.name === 'CastError') {
    return response.status(400).json({ error: error.message })
  }

  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: `Validation error: ${error.message}` })
  }

  if (error.name === 'MongoServerError' && error.code === 11000) {
    return response.status(400).json({ error: error.message })
  }

  if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: `Token error: ${error.message}` })
  }

  next(error)
}

module.exports = {
  userExtractor,
  errorHandler
}