import {
  useGetAllUsersQuery,
} from '#services/users'

import UserList from '#components/Users/UserList'

const Users = () => {
  const getAllUsersQuery = useGetAllUsersQuery()
  const { data: users } = getAllUsersQuery
  console.log('query: ', getAllUsersQuery)
  console.log(users)
  if (getAllUsersQuery.isLoading) return <p>Loading users...</p>

  console.log('users:', users)

  return (users &&
    <div>
      <h2>Users</h2>
      <UserList users={users} />
    </div>
  )
}

export default Users
