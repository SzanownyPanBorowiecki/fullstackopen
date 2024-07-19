import { useSelector, useDispatch } from 'react-redux'

import { removeAuth } from '#reducers/authReducer'
import { notifySuccess } from '#reducers/notificationReducer'

const LoggedInUserInfo = () => {
  const dispatch = useDispatch()
  const auth = useSelector(state => state.auth)

  const handleLogout = async (event) => {
    dispatch(removeAuth())
    dispatch(notifySuccess('Logged out'))
  }

  return (auth &&
    <>
      <b>{auth.name}</b> logged in
      <button onClick={handleLogout}>logout</button>
    </>
  )
}

export default LoggedInUserInfo
