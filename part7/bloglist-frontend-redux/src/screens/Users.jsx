import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { initializeUsers } from '#reducers/usersReducer'

import UserList from '#components/Users/UserList'

const Users = () => {
  const users = useSelector(state => state.users)

  return (users &&
    <div>
      <h2>Users</h2>
      <UserList users={users} />
    </div>
  )
}

export default Users
