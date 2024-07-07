import { useState } from 'react'

const Blog = ({
  blog,
  removeButtonVisible,
  likeHandler,
  removeHandler
}) => {
  const [detailsVisible, setDetailsVisible] = useState(false)


  const toggleDetails = () => {
    setDetailsVisible(!detailsVisible)
  }

  const showDetailsWhenVisible = { display: detailsVisible ? '' : 'none' }
  const showRemoveButtonWhenVisible = { display: removeButtonVisible ? '' : 'none' }
  return (
    <div className='blog-entry'>
      <div className='blog-header'>
        {blog.title} by {blog.author}
        <button onClick={toggleDetails}>{ detailsVisible ? 'hide' : 'show' }</button>
      </div>

      <div className='blog-details' style={showDetailsWhenVisible}>
        <div>URL: {blog.url}</div>
        <div>Likes: {blog.likes} <button onClick={() => likeHandler(blog)}>like</button></div>
        <div>Added by: {blog.user?.name}</div>
        <div>
          <button className='remove-button' style={showRemoveButtonWhenVisible} onClick={() => removeHandler(blog)}>
            remove
          </button>
        </div>
      </div>
    </div>
  )
}

export default Blog
