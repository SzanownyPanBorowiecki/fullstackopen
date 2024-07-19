//import { useRef } from 'react'
import { Link } from 'react-router-dom'

// import Togglable from '#components/Togglable'
// import NewBlogForm from '#components/Blogs/NewBlogForm'

const BlogList = ({ blogs }) => {
  return (blogs &&
    <div>
      {
        [...blogs]
        .sort((a, b) => b.likes - a.likes)
        .map(blog =>
          <div key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>{blog.title} by {blog.author}</Link>
          </div>
        )
      }
    </div>
  )
}

export default BlogList
