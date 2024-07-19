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

import { initializeAuth } from '#reducers/authReducer'

const ProtectedRoute = ({ children }) => {
  const auth = useSelector(state => state.auth)
  if (!auth) return <Navigate to="/login" />
  return children
}

const App = () => {
  const [authInitialized, setAuthInitialized] = useState(false)
  const dispatch = useDispatch()
  const auth = useSelector(state => state.auth)
  const notification = useSelector(state => state.notification)

  useEffect(() => {
    dispatch(initializeAuth())
    setAuthInitialized(true)
  }, [])

  if (!authInitialized) return null


  return (
    <div>
      <h2>blogs</h2>
      <Notification notification={notification} />
      { auth &&
        <div>
          <Link to="/blogs">Blogs</Link>
          <Link to="/users">Users</Link>
          <LoggedInUserInfo />
        </div> }
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
