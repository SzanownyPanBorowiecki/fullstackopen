import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'


import { storeAuth } from '#reducers/authReducer'
import { useLoginMutation } from '#services/auth'

import { notifySuccess, notifyError } from '#reducers/notificationReducer'

const LoginForm = () => {
  const loginRef = useRef()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [authenticate, authResult] = useLoginMutation()
  const {
    data: auth,
    isLoading, isSuccess, isError, error
  } = authResult
  const storedAuth = useSelector(state => state.auth)
  const dispatch = useDispatch()

  useEffect(() => {
    if ( isError ) {
      dispatch(storeAuth(auth))
      dispatch(notifyError(`Auth error: ${error.data?.error ?? error.status}`))
    } else if ( isSuccess ) {
      dispatch(notifySuccess(`Welcome ${auth.name}!`))
    }
  }, [authResult])


  if (storedAuth) {
    return <Navigate replace to="/" />
  }

  if ( isLoading ) {
    return <p>Logging in...</p>
  } else if ( isSuccess ) {
    dispatch(storeAuth(auth))
    return <Navigate replace to="/" />
  }

  return (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={(event) => {
        event.preventDefault()
        authenticate({ username, password })
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
