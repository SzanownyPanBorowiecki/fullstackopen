import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'


import { notifyError, notifySuccess } from '#reducers/notificationReducer'

import {
  useGetBlogByIdQuery,
  useLikeBlogMutation,
  useRemoveBlogMutation
} from '#services/blogs'
import {
  useGetCommentsByBlogIdQuery,
  useAddCommentToBlogIdMutation
} from '#services/comments'

import BlogDetails from '#components/Blogs/BlogDetails'
import CommentsList from '#components/Blogs/CommentsList'
import NewCommentForm from '#components/Blogs/NewCommentForm'

const Blog = () => {
  const blogId = useParams().id
  const blogQuery = useGetBlogByIdQuery(blogId)
  const commentsQuery = useGetCommentsByBlogIdQuery(blogId)
  const [likeBlog, likeBlogResult] = useLikeBlogMutation()
  const [removeBlog, removeBlogResult ] = useRemoveBlogMutation()
  const [addComment, addCommentResult] = useAddCommentToBlogIdMutation()

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const auth = useSelector(state => state.auth)

  // if (blogQuery.isLoading) return <div>Loading blog...</div>
  if (blogQuery.isError && blogQuery.error.status === 404) {
    return <div>Blog not found!</div>
  }
  const blog = blogQuery.data

  const handleLike = async () => {
    try {
      await likeBlog(blogId).unwrap()
      dispatch(
        notifySuccess(`You now like blog ${blog.title} by ${blog.author}`)
      )
    } catch (error) {
      dispatch(
        notifyError(error.data?.error ?? `Error ${error.status}`)
      )
    }
  }


  const handleRemove = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      try {
        await removeBlog(blogId).unwrap()
        dispatch(
          notifySuccess(`Blog ${blog.title} by ${blog.author} has been removed`)
        )
        navigate(-1)
      } catch (error) {
        dispatch(
          notifyError(error.data?.error ?? `Error ${error.status}`)
        )
      }
    }
  }

  const handleAddComment = async content => {
    try {
      await addComment({ blogId, content }).unwrap()
      dispatch(
        notifySuccess(`Comment '${content}' saved`)
      )
      return true
    } catch (error) {
      console.log(error)
      dispatch(
        notifyError(error.data?.error ?? `Error ${error.status}`)
      )
      return false
    }
  }

  const removeButtonVisible = auth.username === blog?.user?.username
  return (
    <div>
      <BlogDetails
        blog={blog}
        removeButtonVisible={removeButtonVisible}
        handleRemove={handleRemove}
        handleLike={handleLike}
        isLoading={blogQuery.isLoading}
        isLikePending={likeBlogResult.isLoading}
        isRemovePending={removeBlogResult.isLoading}
      />
      <h4>comments</h4>
      <NewCommentForm
        isAddCommentPending={addCommentResult.isLoading}
        handleAddComment={handleAddComment}
      />
      <CommentsList comments={commentsQuery.data} isLoading={commentsQuery.isLoading} isError={commentsQuery.isError} />
    </div>

  )
}

export default Blog
