import { Container, Row, Col, Card, Spinner } from 'react-bootstrap'

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
    <Container className="mt-4">
      {
        [...comments]
          .reverse()
          .map(comment =>
            <Card
              key={comment.id}
              className="mb-4"
            >
              <Card.Body>
                <Card.Text>
                  {comment.content}
                </Card.Text>
                <Card.Text className="text-right small text-muted mb-0">
                  Added on {comment.createdAt}
                </Card.Text>
              </Card.Body>
            </Card>
          )
      }
    </Container>
  )
}

export default CommentsList
