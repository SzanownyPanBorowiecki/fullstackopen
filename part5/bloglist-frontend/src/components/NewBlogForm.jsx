import { useState } from 'react'

const NewBlogForm = ({ createNewBlogHandler }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  return (
    <div>
      <h2>create new blog</h2>
      <form onSubmit={(event) => {
        event.preventDefault()
        createNewBlogHandler({ title, author, url })
        setTitle('')
        setAuthor('')
        setUrl('')
      }}>
        <div>
          title: <input
            type="text"
            value={title}
            onChange={({ target }) => setTitle(target.value)} />
        </div>
        <div>
          author: <input
            type="text"
            value={author}
            onChange={({ target }) => setAuthor(target.value)} />
        </div>
        <div>
          url: <input
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
