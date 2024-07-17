import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import { likeBlog, removeBlog, createComment } from '#reducers/blogsReducer'
import { notifyError, notifySuccess } from '#reducers/notificationReducer'

import BlogDetails from '#components/Blogs/BlogDetails'

const Blog = () => {
  const blogId = useParams().id

  const blog = useSelector(state =>
    state.blogs.find(el => el.id === blogId)
  )
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()

  const handleLike = async blog => {
    try {
      await dispatch(likeBlog(blog))
      dispatch(notifySuccess(
        `You now like blog ${blog.title} by ${blog.author}`
      ))
    } catch (e) {
      dispatch(notifyError(
        e.response?.data?.error
          ? e.response.data.error
          : e.message
      ))
    }
  }

  const handleRemove = async blog => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      try {
        await dispatch(removeBlog(blog))
        dispatch(notifySuccess(
          `Blog ${blog.title} by ${blog.author} has been removed`
        ))
        navigate('/')
      } catch (e) {
        dispatch(notifyError(
          e.response?.data?.error
            ? e.response.data.error
            : e.message
        ))
      }
    }
  }

  const handleAddComment = async (event) => {
    event.preventDefault()
    console.log(event.target.comment.value)
    try {
      await dispatch(createComment(blog, event.target.comment.value))
      dispatch(notifySuccess('Added comment'))
    } catch(e) {
      dispatch(notifyError(
        e.response?.data?.error
          ? e.response.data.error
          : e.message
      ))
    }
  }


  if (!blog) {
    return <div>Blog not found!</div>
  }

  const removeButtonVisible = user.username === blog.user?.username
  //const showRemoveButtonWhenVisible = { display: removeButtonVisible ? '' : 'none' }

  return (
    <div>
      <BlogDetails
        blog={blog}
        removeButtonVisible={removeButtonVisible}
        handleRemove={handleRemove}
        handleLike={handleLike}
      />
      <h4>comments</h4>
      <form onSubmit={handleAddComment}>
        <input name="comment" />
        <button>add comment</button>
      </form>
      <ul>
        {blog.comments?.map(comment => <li>{comment}</li>)}
      </ul>
    </div>

  )
}

export default Blog
