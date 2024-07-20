import { Button, Spinner } from 'react-bootstrap'

const NewCommentForm = ({
  handleAddComment,
  isAddCommentPending
}) => (
  <form onSubmit={handleAddComment}>
    <input name="comment" />
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
  </form>
)

export default NewCommentForm
