import { useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

import { loginUser } from '#reducers/userReducer'
import { notifySuccess, notifyError } from '#reducers/notificationReducer'

const LoginForm = () => {
  const loginRef = useRef()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()

  const handleLogin = async credentials => {
    try {
      const user = await dispatch(loginUser(credentials))
      dispatch(notifySuccess(`Welcome ${user.name}`))
    } catch (e) {
      dispatch(notifyError(
        e.response?.data?.error
          ? e.response.data.error
          : e.message
      ))
    }
  }

  const user = useSelector(state => state.user)
  if (user !== null) {
    return <Navigate replace to="/" />
  }

  return (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={(event) => {
        event.preventDefault()
        handleLogin({ username, password })
        setUsername('')
        setPassword('')
        loginRef.current?.focus()
      }}>
        <div>
          username: <input
            autoFocus
            data-testid="LoginForm:input:username"
            ref={loginRef}
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)} />
        </div>
        <div>
          password: <input
            data-testid="LoginForm:input:password"
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)} />
        </div>
        <button data-testid="LoginForm:button:login" type="submit">Login</button>
      </form>
    </div>
  )
}

export default LoginForm
