const Blog = require('../models/blog')
const jwt = require('jsonwebtoken')

const initialBlogs = [
  {
    _id: '667b21cb1587db4a621ce701',
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    user: '667b20a0b3ce5288e41b38f2'
  },
  {
    _id: '667b21dbd431969af3c69532',
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    user: '667b20a0b3ce5288e41b38f2'
  },
  {
    _id: '667b21edcf1e3aff38c9e1de',
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    user: '667b20a0b3ce5288e41b38f2'
  },
  {
    _id: '667b21f1a8c6a84591b30dc3',
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    user: '667b20a9b3ce5288e41b38f4'
  },
  {
    _id: '667b21f63d8045cb5e6d8508',
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    user: '667b20a9b3ce5288e41b38f4'
  },
  {
    _id: '667b21fa36f4eec8a9d90037',
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    user: '667b20b6b3ce5288e41b38f6'
  }  
]

const initialUsers = [
  {
    _id: '667b20a0b3ce5288e41b38f2',
    username: 'user',
    name: 'User Name',
    passwordHash: '$2b$10$l12w1wJQ3mFQqAMAptgB1.V8bgn/ZjzG/Ze1XqT077A0OUWH23bzm', // 'userPassword'
    blogs: ['667b21cb1587db4a621ce701', '667b21dbd431969af3c69532', '667b21edcf1e3aff38c9e1de']
  },
  {
    _id: '667b20a9b3ce5288e41b38f4',
    username: 'root',
    name: 'Root Name',
    passwordHash: '$2b$10$9sH7wNDpTRDQkD5QuWuvlOsgRuXs1KcJrGW8.TvfHpQCbp74fbYGy', // 'rootPassword'
    blogs: ['667b21f1a8c6a84591b30dc3', '667b21f63d8045cb5e6d8508']
  },
  {
    _id: '667b20b6b3ce5288e41b38f6',
    username: 'test',
    name: 'Test Name',
    passwordHash: '$2b$10$nF8x8KFHC3e0aztpNBG.LOaZkFBAbPJk0t4azQCPfMZDUDTdcgQxm', // 'testPassword'
    blogs: ['667b21fa36f4eec8a9d90037']
  }
]

const docsInDb = async Model => {
  const res = await Model.find({})
  return res.map(doc => doc.toJSON())
}


const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const blogData = async (id) => {
  const result = await Blog
    .find({_id: id}, '-_id title author url likes')
    .lean()
  return (result.length == 0) ? undefined : result[0]
}

module.exports = { 
  initialBlogs,
  initialUsers,
  
  blogsInDb,
  blogData
}