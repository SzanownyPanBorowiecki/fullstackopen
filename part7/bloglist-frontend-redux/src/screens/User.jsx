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


  return (
    <>
      <UserDetails user={user} isLoading={isUserLoading}/>
      <h4>Blogs added by user:</h4>
      <BlogList blogs={blogs} isLoading={isBlogsLoading} />
    </>
  )
}

export default User
