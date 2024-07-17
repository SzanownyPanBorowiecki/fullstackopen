const BlogDetails = ({blog, removeButtonVisible, handleRemove, handleLike}) => {
  const showRemoveButtonWhenVisible = { display: removeButtonVisible ? '' : 'none' }

  return (
    <div className='blog-entry'>
      <div className='blog-header'>
        <h2>{blog.title} by {blog.author}</h2>
      </div>

      <div className='blog-details'>
        <div><a href={blog.url}>{blog.url}</a></div>
        <div>{blog.likes} likes <button onClick={() => handleLike(blog)}>like</button></div>
        <div>added by {blog.user?.name}</div>
        <div>
          <button className='remove-button' style={showRemoveButtonWhenVisible} onClick={() => handleRemove(blog)}>
            remove
          </button>
        </div>
      </div>
    </div>
  )
}

export default BlogDetails
