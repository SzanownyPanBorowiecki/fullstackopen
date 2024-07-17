import { useSelector, useDispatch } from 'react-redux'

import { logoutUser } from '#reducers/userReducer'
import { notifySuccess } from '#reducers/notificationReducer'

const LoggedInUserInfo = () => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)

  const handleLogout = async (event) => {
    dispatch(logoutUser())
    dispatch(notifySuccess('Logged out'))
  }

  return (user &&
    <>
      <b>{user.name}</b> logged in
      <button onClick={handleLogout}>logout</button>
    </>
  )
}

export default LoggedInUserInfo
