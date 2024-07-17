import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Routes, Route, Navigate, Link } from 'react-router-dom'

import BlogsScreen from '#screens/Blogs'
import BlogScreen from '#screens/Blog'
import UsersScreen from '#screens/Users'
import UserScreen from '#screens/User'
import LoginScreen from '#screens/Login'

import Notification from '#components/Notification'
import LoggedInUserInfo from '#components/LoggedInUserInfo'

import { initializeUser } from '#reducers/userReducer'
import { initializeBlogs } from '#reducers/blogsReducer'
import { initializeUsers } from '#reducers/usersReducer'

const ProtectedRoute = ({ children }) => {
  const [userInitialized, setUserInitialized] = useState(false)
  const dispatch = useDispatch()

  const user = useSelector(state => state.user)
  useEffect(() => {
    dispatch(initializeUser())
    setUserInitialized(true)
  }, [])

  if (!userInitialized) return null
  if (!user) return <Navigate to="/login" />
  return children
}

const App = () => {
  const dispatch = useDispatch()

  const notification = useSelector(state => state.notification)
  const user = useSelector(state => state.user)

  useEffect(() => {
    const loadData = async () => {
      dispatch(initializeUsers())
      dispatch(initializeBlogs())
    }

    if (user) {
      loadData()
    }
  }, [user])

  return (
    <div>
      <h2>blogs</h2>
      <Notification notification={notification} />
      <div>
        <Link to="/blogs">Blogs</Link>
        <Link to="/users">Users</Link>
        {user && <LoggedInUserInfo />}
      </div>
      <Routes>
        <Route path="/" element={<Navigate to="/blogs" />} />
        <Route path="/blogs" element={<ProtectedRoute><BlogsScreen /></ProtectedRoute>} />
        <Route path="/blogs/:id" element={<ProtectedRoute><BlogScreen /></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute><UsersScreen /></ProtectedRoute>} />
        <Route path="/users/:id" element={<ProtectedRoute><UserScreen /></ProtectedRoute>} />
        <Route path="/login" element={<LoginScreen />} />
      </Routes>
    </div>
  )

}

export default App
