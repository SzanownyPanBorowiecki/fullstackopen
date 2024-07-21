import { Spinner } from 'react-bootstrap'

const UserDetails = ({ user, isLoading }) => {
  if ( isLoading ) return (
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  )

  return (
    <div>
      <h2>{user.name}</h2>
    </div>
  )
}

export default UserDetails
