import { Link } from 'react-router-dom'

const UserList = ({ users }) => (
  <table>
    <thead>
      <tr>
        <td>Name</td>
        <td>blogs created</td>
      </tr>
    </thead>
    <tbody>
      {users.map(user =>
        <tr key={user.id}>
          <td>
            <Link to={`/users/${user.id}`}>
              {user.name}
            </Link>
          </td>
          <td>{user.blogs.length}</td>
        </tr>
      )}
    </tbody>
  </table>
)

export default UserList
