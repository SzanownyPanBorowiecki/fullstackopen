import { useState, useRef } from 'react'
import { PropTypes } from 'prop-types'

const LoginForm = ({ loginHandler }) => {
  const loginRef = useRef()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  return (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={(event) => {
        event.preventDefault()
        loginHandler({ username, password })
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

LoginForm.propTypes = {
  loginHandler: PropTypes.func.isRequired
}

export default LoginForm
