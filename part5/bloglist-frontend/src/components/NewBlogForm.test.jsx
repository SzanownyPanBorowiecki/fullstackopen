import { render, screen, act } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import NewBlogForm from './NewBlogForm'

describe('<NewBlogForm />', async () => {
  test(
    'submit button calls the right event handler with the right parameters',
    async () => {
      const testData = {
        title: 'Test title',
        author: 'Test author',
        url: 'https://example.com'
      }

      const handler = vi.fn()

      const container = render(<NewBlogForm createNewBlogHandler={handler} />)
        .container

      const titleInput = container.querySelector("#input-title")
      const authorInput = container.querySelector("#input-author")
      const urlInput = container.querySelector("#input-url")
      const submitButton = screen.getByText('Create')

      await act(async () => {
        const user = userEvent.setup()
        await user.type(titleInput, testData.title)
        await user.type(authorInput, testData.author)
        await user.type(urlInput, testData.url)
        await user.click(submitButton)
      })

      expect(handler.mock.calls).toHaveLength(1)
      expect(handler.mock.calls[0][0]).toEqual(testData)
    }
  )
})
