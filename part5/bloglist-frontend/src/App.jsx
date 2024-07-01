import { useState, useRef, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const LoginForm = ({loginHandler}) => {
  const loginRef = useRef()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  return (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={(event) => {
        event.preventDefault()
        loginHandler(username, password)
        setUsername('')
        setPassword('')
        loginRef.current?.focus()
      }}>
        <div>
          username: <input
            autoFocus
            ref={loginRef}
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)} />
        </div>
        <div>
          password: <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)} />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  )
}


const NewBlogForm = ({createNewBlogHandler}) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  return (
    <div>
      <h2>create new blog</h2>
      <form onSubmit={(event) => {
        event.preventDefault()
        createNewBlogHandler(title, author, url)
        setTitle('')
        setAuthor('')
        setUrl('')
      }}>
        <div>
          title: <input
            type="text"
            value={title}
            onChange={ ({target}) => setTitle(target.value) } />
        </div>
        <div>
          author: <input
            type="text"
            value={author}
            onChange={ ({target}) => setAuthor(target.value) } />
        </div>
        <div>
          url: <input
            type="text"
            value={url}
            onChange={ ({target}) => setUrl(target.value) } />
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  )
}


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

  useEffect(() => {
    if (notification) {
      clearTimeout(notificationTimeout)
      setNotificationTimeout(setTimeout(() => setNotification(null), 5000))
    }
  }, [notification])

  useEffect(() => {
    blogService.setToken(user?.token ? user.token : null)
  }, [user])

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem(
        'loggedBloglistUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setNotification({
        type: 'success',
        message: `Welcome ${user.name}!`
      })
    } catch(e) {
      setNotification({
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
    setNotification({
      type: 'success',
      message: 'Logged out'
    })
  }

  const handleCreateNewBlog = async (title, author, url) => {
    try {
      const newBlog = await blogService.create({ title, author, url })
      setBlogs(blogs.concat(newBlog))

      setNotification({
        type: 'success',
        message: `a new blog ${title} by ${author} added`
      })
    } catch(e) {
      setNotification({
        type: 'error',
        message: e.response?.data?.error
          ? e.response.data.error
          : e.message
      })
    }
  }


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
      <NewBlogForm createNewBlogHandler={handleCreateNewBlog} />
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App
