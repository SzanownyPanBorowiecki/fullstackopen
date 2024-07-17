import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'

import { initializeUsers } from '#reducers/usersReducer'

import UserDetails from '#components/Users/UserDetails'

const User = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(initializeUsers())
  }, [])

  const userId = useParams().id

  const user = useSelector(state =>
    state.users.find(el => el.id === userId)
  )

  if (!user) {
    return <div>User not found!</div>
  }

  return <UserDetails user={user} />
}

export default User
