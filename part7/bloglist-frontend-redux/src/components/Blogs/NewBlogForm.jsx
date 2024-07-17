import { useState } from 'react'
import { useDispatch } from 'react-redux'

import { createBlog } from '#reducers/blogsReducer'
import { notifyError, notifySuccess } from '#reducers/notificationReducer'

const NewBlogForm = ({parentTogglableRef}) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const dispatch = useDispatch()

  const handleCreateNewBlog = async blog => {
    try {
      await dispatch(createBlog(blog))
      dispatch(notifySuccess(
          `a new blog ${blog.title} by ${blog.author} added`
      ))
      if (parentTogglableRef) {
        parentTogglableRef.current.setVisible(false)
      }

      setTitle('')
      setAuthor('')
      setUrl('')

    } catch (e) {
      dispatch(notifyError(
        e.response?.data?.error
          ? e.response.data.error
          : e.message
      ))
    }
  }


  return (
    <div>
      <h2>create new blog</h2>
      <form onSubmit={(event) => {
        event.preventDefault()
        handleCreateNewBlog({ title, author, url })
      }}>
        <div>
          title: <input
            data-testid='NewBlogForm:input:title'
            id='input-title'
            type="text"
            value={title}
            onChange={({ target }) => setTitle(target.value)} />
        </div>
        <div>
          author: <input
            data-testid='NewBlogForm:input:author'
            id='input-author'
            type="text"
            value={author}
            onChange={({ target }) => setAuthor(target.value)} />
        </div>
        <div>
          url: <input
            data-testid='NewBlogForm:input:url'
            id='input-url'
            type="text"
            value={url}
            onChange={({ target }) => setUrl(target.value)} />
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  )
}

export default NewBlogForm
