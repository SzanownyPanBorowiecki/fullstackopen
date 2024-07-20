import { Spinner } from 'react-bootstrap'

const CommentsList = ({
  comments,
  isLoading
}) => {
  if (isLoading) return (
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading comments...</span>
    </Spinner>
  )

  return (
    <ul>
    { [...comments]
      .reverse()
      .map(comment =>
        <li key={comment.id}>{comment.content}</li>
      ) }
    </ul>
  )
}

export default CommentsList
