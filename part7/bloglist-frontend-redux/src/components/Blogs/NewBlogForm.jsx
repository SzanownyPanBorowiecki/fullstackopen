import { useState } from 'react'
import { useDispatch } from 'react-redux'

//import { createBlog } from '#reducers/blogsReducer'
// import { notifyError, notifySuccess } from '#reducers/notificationReducer'

const NewBlogForm = ({
  handleCreateNewBlog,
  isAddBlogPending
}) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  // const dispatch = useDispatch()

  return (
    <div>
      <h2>create new blog</h2>
      <form onSubmit={async (event) => {
        event.preventDefault()
        const success = await handleCreateNewBlog({ title, author, url })
        if (success) {
          setTitle('')
          setAuthor('')
          setUrl('')
        }
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
        <div>
        { isAddBlogPending
          ? 'Adding blog...'
          : <button type="submit">Create</button> }
        </div>
      </form>
    </div>
  )
}

export default NewBlogForm
