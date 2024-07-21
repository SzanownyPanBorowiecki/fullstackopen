import { useState } from 'react'
import { Form, Row, Col, Button, Spinner } from 'react-bootstrap'

const NewCommentForm = ({
  handleAddComment,
  isAddCommentPending
}) => {
  const [content, setContent] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    const success = await handleAddComment(content)
    if (success)
      setContent('')
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Row className="align-items-center">
        <Col xs="auto">
          <Form.Control
            type="text"
            placeholder="Your comment"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </Col>
        <Col>
        { isAddCommentPending
          ? <Button variant="primary" disabled>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              Adding comment...
            </Button>
          : <Button type="submit">Add comment</Button> }
        </Col>
      </Row>
    </Form>
  )
}

export default NewCommentForm
