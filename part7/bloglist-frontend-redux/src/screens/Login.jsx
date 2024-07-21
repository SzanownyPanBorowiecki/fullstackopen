import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Navigate } from 'react-router-dom'
import { Form, Button, Row, Col, Spinner } from 'react-bootstrap'


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
  const navigate = useNavigate()

  useEffect(() => {
    if ( isError ) {
      dispatch(notifyError(`Auth error: ${error.data?.error ?? error.status}`))
    } else if ( isSuccess ) {
      dispatch(storeAuth(auth))
      dispatch(notifySuccess(`Welcome ${auth.name}!`))
      navigate('/')
    }
  }, [authResult])


  if (storedAuth) {
    return <Navigate replace to="/" />
  }

  const handleLogin = (event) => {
    event.preventDefault()
    authenticate({ username, password })
    setUsername('')
    setPassword('')
    loginRef.current?.focus()
  }

  return (
    <Form onSubmit={handleLogin}>
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm="2">
          Login
        </Form.Label>
        <Col sm="10">
          <Form.Control ref={loginRef} type="text" onChange={({ target }) => setUsername(target.value)}/>
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm="2">
          Password
        </Form.Label>
        <Col sm="10">
          <Form.Control type="password" onChange={({ target }) => setPassword(target.value)} />
        </Col>
      </Form.Group>
      { isLoading
        ? <Button variant="primary" disabled>
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
            Logging in...
          </Button>
        : <Button variant="primary" type="submit">Log In</Button> }
    </Form>
  )
}

export default LoginForm
