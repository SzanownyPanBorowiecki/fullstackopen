//import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'

import { Spinner, ListGroup } from 'react-bootstrap'
// import Togglable from '#components/Togglable'
// import NewBlogForm from '#components/Blogs/NewBlogForm'

const BlogList = ({ blogs, isLoading }) => {
  const navigate = useNavigate()

  if ( isLoading ) return (
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  )

  return (blogs &&
    <ListGroup>
      {
        [...blogs]
        .sort((a, b) => b.likes - a.likes)
        .map(blog =>
          <ListGroup.Item action key={blog.id} onClick={() => navigate(`/blogs/${blog.id}`)}>
            {blog.title} by {blog.author}
          </ListGroup.Item>
        )
      }
    </ListGroup>
  )
}

export default BlogList
