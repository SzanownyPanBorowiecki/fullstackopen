import { useState, useRef, useEffect } from 'react'

import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import NewBlogForm from './components/NewBlogForm'

import blogService from './services/blogs'
import loginService from './services/login'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const [notificationTimeout, setNotificationTimeout] = useState(null)


  useEffect(() => {
    async function getAllBlogs() {
      const blogs = await blogService.getAll()
      setBlogs(blogs)
    }
    getAllBlogs()
  }, [])

  useEffect(() => {
    const userJSON = window.localStorage.getItem('loggedBloglistUser')
    if (userJSON) {
      setUser(JSON.parse(userJSON))
    }
  }, [])

  const notify = newNotification => {
    setNotification(newNotification)
    clearTimeout(notificationTimeout)
    setNotificationTimeout(
      setTimeout(() => setNotification(null), 5000)
    )
  }

  useEffect(() => {
    blogService.setToken(user?.token ? user.token : null)
  }, [user])

  const handleLogin = async userData => {
    try {
      const user = await loginService.login(userData)
      window.localStorage.setItem(
        'loggedBloglistUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      notify({
        type: 'success',
        message: `Welcome ${user.name}!`
      })
    } catch (e) {
      notify({
        type: 'error',
        message: e.response?.data?.error
          ? e.response.data.error
          : e.message
      })
    }
  }

  const handleLogout = async (event) => {
    setUser(null)
    window.localStorage.removeItem('loggedBloglistUser')
    notify({
      type: 'success',
      message: 'Logged out'
    })
  }

  const handleCreateNewBlog = async blogData => {
    try {
      const newBlog = await blogService.create(blogData)
      setBlogs(blogs.concat(newBlog))

      notify({
        type: 'success',
        message: `a new blog ${blogData.title} by ${blogData.author} added`
      })

      newBlogRef.current.toggleVisibility()
    } catch (e) {
      notify({
        type: 'error',
        message: e.response?.data?.error
          ? e.response.data.error
          : e.message
      })
    }
  }

  const handleLike = async blogData => {
    try {
      const updatedBlog = await blogService.update({
        ...blogData,
        likes: blogData.likes + 1,
        user: blogData.user.id
      })

      notify({
        type: 'success',
        message: `You now like blog ${blogData.title} by ${blogData.author}`
      })

      setBlogs(blogs.map(b => b.id === updatedBlog.id ? updatedBlog : b))
    } catch (e) {
      notify({
        type: 'error',
        message: e.response?.data?.error
          ? e.response.data.error
          : e.message
      })
    }
  }

  const handleRemove = async blogData => {
    if (window.confirm(`Remove blog ${blogData.title} by ${blogData.author}?`)) {
      try {
        await blogService.remove(blogData.id)

        notify({
          type: 'success',
          message: `Blog ${blogData.title} by ${blogData.author} has been removed`
        })

        setBlogs(blogs.filter(b => b.id !== blogData.id))

      } catch (e) {
        notify({
          type: 'error',
          message: e.response?.data?.error
            ? e.response.data.error
            : e.message
        })
      }
    }
  }

  const newBlogRef = useRef()


  if (user === null) {
    return (
      <div>
        <Notification notification={notification} />
        <LoginForm loginHandler={handleLogin} />
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification notification={notification} />
      <div>
        <b>{user.name}</b> logged in <button onClick={handleLogout}>logout</button>
      </div>
      <Togglable buttonLabel="new note" ref={newBlogRef}>
        <NewBlogForm createNewBlogHandler={handleCreateNewBlog} />
      </Togglable>
      {
        blogs
          .sort((a, b) => b.likes - a.likes)
          .map(blog =>
            <Blog
              key={blog.id}
              blog={blog}
              likeHandler={handleLike}
              removeButtonVisible={blog.user?.username === user.username}
              removeHandler={handleRemove}
            />
          )
      }
    </div>
  )
}

export default App
