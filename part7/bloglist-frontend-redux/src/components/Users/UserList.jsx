import { useNavigate } from 'react-router-dom'
import {
  Spinner,
  Table
} from 'react-bootstrap'

const UserList = ({ users, isLoading }) => {
  const navigate = useNavigate()
  if ( isLoading ) return (
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  )

  return (users &&
    <Table stripped bordered hover>
      <thead>
        <tr>
          <td>Name</td>
          <td>Blogs created</td>
        </tr>
      </thead>
      <tbody>
        {users.map(user =>
          <tr role="button" key={user.id} onClick={() => navigate(`/users/${user.id}`)}>
            <td>
              {user.name}
            </td>
            <td>{user.blogs.length}</td>
          </tr>
        )}
      </tbody>
    </Table>
  )
}

export default UserList
