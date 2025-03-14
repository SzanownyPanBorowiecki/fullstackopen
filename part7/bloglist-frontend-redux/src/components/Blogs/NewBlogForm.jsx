import { useState } from 'react'
import { Form, Row, Col, Button, Spinner } from 'react-bootstrap'

const NewBlogForm = ({
  handleCreateNewBlog,
  isAddBlogPending
}) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    const success = await handleCreateNewBlog({ title, author, url })
    if (success) {
      setTitle('')
      setAuthor('')
      setUrl('')
    }
  }

  return (
    <div>
      <h2>create new blog</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="2">
            Title
          </Form.Label>
          <Col sm="10">
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="2">
            Author
          </Form.Label>
          <Col sm="10">
            <Form.Control
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="2">
            URL
          </Form.Label>
          <Col sm="10">
            <Form.Control
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </Col>
        </Form.Group>
        { isAddBlogPending
          ? <Button variant="primary" disabled>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              Creating...
            </Button>
          : <Button variant="primary" type="submit">Create</Button> }
      </Form>
    </div>
  )
}

export default NewBlogForm
