import { Card, Button, Spinner } from 'react-bootstrap'

const BlogDetails = ({
  blog,
  removeButtonVisible,
  handleRemove,
  handleLike,
  isLoading,
  isLikePending,
  isRemovePending
}) => {
  if ( isLoading ) return (
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  )
  //const showRemoveButtonWhenVisible = { display: removeButtonVisible ? '' : 'none' }
  return (
    <Card>
      <Card.Body>
        <Card.Title>{blog.title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          by {blog.author}
        </Card.Subtitle>
        <Card.Text>
          Likes: {blog.likes}
          { isLikePending
            ? <Button variant="primary" disabled>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                <span className="visually-hidden">Loading...</span>
              </Button>
            : <Button onClick={() => handleLike(blog)}>Like</Button>
          }
        </Card.Text>
        <Card.Text>
          Added by: {blog.user.name}
        </Card.Text>
        <Button variant="primary">Go to {blog.url}</Button>
        { removeButtonVisible && (
            isRemovePending
              ? <Button variant="danger" disabled>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  Removing...
                </Button>
              : <Button variant="danger" onClick={() => handleRemove(blog)}>
                  Remove
                </Button>
        )}
      </Card.Body>
    </Card>

    // <div className='blog-entry'>
    //   <div className='blog-header'>
    //     <h2>{blog.title} by {blog.author}</h2>
    //   </div>

    //   <div className='blog-details'>
    //     <div><a href={blog.url}>{blog.url}</a></div>
    //     <div>
    //       {blog.likes} likes
    //       { isLikePending
    //         ? <Button variant="primary" disabled>
    //             <Spinner
    //               as="span"
    //               animation="border"
    //               size="sm"
    //               role="status"
    //               aria-hidden="true"
    //             />
    //             <span className="visually-hidden">Loading...</span>
    //           </Button>
    //         : <Button onClick={() => handleLike(blog)}>Like</Button>
    //       }
    //     </div>
    //     <div>added by {blog.user?.name}</div>
    //     { removeButtonVisible &&
    //       <div>
    //         { isRemovePending
    //           ? <>Removing blog...</>
    //           : <button className='remove-button' onClick={() => handleRemove(blog)}>
    //               remove
    //             </button> }
    //       </div> }
    //   </div>
    // </div>
  )
}

export default BlogDetails
