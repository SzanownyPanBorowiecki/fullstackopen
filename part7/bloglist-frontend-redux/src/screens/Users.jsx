import {
  useGetAllUsersQuery,
} from '#services/users'

import UserList from '#components/Users/UserList'

const Users = () => {
  const { data: users, isLoading } = useGetAllUsersQuery()

  return (
    <div>
      <h2>Users</h2>
      <UserList users={users} isLoading={isLoading} />
    </div>
  )
}

export default Users
