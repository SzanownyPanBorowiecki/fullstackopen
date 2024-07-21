import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useLocation, Routes, Route, Navigate, Link } from 'react-router-dom'

import { Navbar, Nav, NavDropdown } from 'react-bootstrap'


import BlogsScreen from '#screens/Blogs'
import BlogScreen from '#screens/Blog'
import UsersScreen from '#screens/Users'
import UserScreen from '#screens/User'
import LoginScreen from '#screens/Login'

import Notification from '#components/Notification'
//import LoggedInUserInfo from '#components/LoggedInUserInfo'

import { initializeAuth, removeAuth } from '#reducers/authReducer'
import { notifyError, notifySuccess } from '#reducers/notificationReducer'

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
  const location = useLocation()

  useEffect(() => {
   dispatch(initializeAuth())
   setAuthInitialized(true)
  }, [])

  const handleLogout = async (event) => {
    dispatch(removeAuth())
    dispatch(notifySuccess('Logged out'))
  }


  if (!authInitialized) return null


  return (
    <div className="container">
      { auth &&
        <Navbar collapseOnSelect expand="lg">
          <Navbar.Brand>Bloglist</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto" activeKey={location.pathname}>
              <Nav.Item>
                <Nav.Link as={Link} to="/blogs">Blogs</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link as={Link} to="/users">Users</Nav.Link>
              </Nav.Item>
            </Nav>
            <Nav>
              <Nav.Item className="me-auto">
                { auth
                  ?  <NavDropdown
                      title={auth.name}
                      id="basic-nav-dropdown"
                    >
                      {/*<NavDropdown.Item as={Link} to="/profile">
                        Profile
                      </NavDropdown.Item>*/}
                      <NavDropdown.Item as={Link} onClick={handleLogout}>
                        Logout
                      </NavDropdown.Item>
                    </NavDropdown>
                  : <Nav.Link as={Link} to="/login">log in</Nav.Link>
                }
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      }
      <Notification notification={notification} />

      <Routes>
        <Route
          path="/"
          element={<Navigate to="/blogs" />}
        />
        <Route
          path="/blogs"
          element={<ProtectedRoute><BlogsScreen /></ProtectedRoute>}
        />
        <Route
          path="/blogs/:id"
          element={<ProtectedRoute><BlogScreen /></ProtectedRoute>}
        />
        <Route
          path="/users"
          element={<ProtectedRoute><UsersScreen /></ProtectedRoute>}
        />
        <Route
          path="/users/:id"
          element={<ProtectedRoute><UserScreen /></ProtectedRoute>}
        />
        <Route
          path="/login"
          element={<LoginScreen />}
        />
      </Routes>
    </div>
  )

}

export default App
