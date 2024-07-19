import { useParams } from 'react-router-dom'

import {
  useGetUserByIdQuery,
  useGetBlogsByUserIdQuery
} from '#services/users'

//import { useGetBlogByIdQuery } from '#services/blogs'

import UserDetails from '#components/Users/UserDetails'
import BlogList from '#components/Blogs/BlogList'


const User = () => {
  const userId = useParams().id
  const { data: user, isLoading: isUserLoading } = useGetUserByIdQuery(userId)
  const { data: blogs, isLoading: isBlogsLoading } = useGetBlogsByUserIdQuery(userId)

  if ( isUserLoading ) return <p>Loading...</p>

  if (!user) {
    return <div>User not found!</div>
  }

  return (
    <>
      <UserDetails user={user} />
      <h4>Blogs added by user:</h4>
      { isBlogsLoading ? <p>Loading list of blogs...</p> : <BlogList blogs={blogs} /> }
    </>
  )
}

export default User
