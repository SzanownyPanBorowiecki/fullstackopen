import { useRef } from 'react'
import { useDispatch } from 'react-redux'

import BlogList from '#components/Blogs/BlogList'
import NewBlogForm from '#components/Blogs/NewBlogForm'
import Togglable from '#components/Togglable'

import {
  useGetAllBlogsQuery,
  useAddBlogMutation
} from '#services/blogs'

import { notifyError, notifySuccess } from '#reducers/notificationReducer'

const Blogs = () => {
  const dispatch = useDispatch()
  // should initialize blogs here

  //const blogs = useSelector(state => state.blogs)
  const { data, error, isLoading } = useGetAllBlogsQuery()
  const [addBlog, addBlogResult] = useAddBlogMutation()

  const newBlogFormTogglableRef = useRef()

  const handleCreateNewBlog = async blog => {
    try {
      await addBlog(blog)
      dispatch(
        notifySuccess(`a new blog ${blog.title} by ${blog.author} added`)
      )
      newBlogFormTogglableRef.current.setVisible(false)
      return true
    } catch (error) {
      console.log(error)
      dispatch(notifyError(error.data?.error ?? `Error ${error.status}`))
      return false
    }
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  if ( isLoading ) {
    return <div>Loading blogs...</div>
  }

  return (
    <div>
      <Togglable
        buttonLabel="create new"
        ref={newBlogFormTogglableRef}
        cancelVisible={!addBlogResult.isLoading}
      >
        <NewBlogForm
          handleCreateNewBlog={handleCreateNewBlog}
          isAddBlogPending={addBlogResult.isLoading}
        />
      </Togglable>
      <BlogList blogs={data} />
    </div>
  )
}

export default Blogs
