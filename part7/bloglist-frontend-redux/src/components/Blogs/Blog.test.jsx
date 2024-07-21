import { render, screen, act } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', async () => {
  const blog = {
    title: 'Test title',
    author: 'Test author',
    url: 'https://example.com',
    likes: 2137,
    user: {
      username: 'testusername',
      name: 'Test Name'
    }
  }

  let handleLike
  let handleRemove
  let container

  beforeEach(() => {
    handleLike = vi.fn()
    handleRemove = vi.fn()

    container = render(
      <Blog
        blog={blog}
        removeButtonVisible='false'
        likeHandler={handleLike}
        removeHandler={handleRemove}
      />
    ).container
  })

  test(
    'renders title and author, but not URL or number of likes by default',
    async () => {
      const titleElement = screen.getByText(`${blog.title} by ${blog.author}`)
      const urlElement = screen.getByText(`URL: ${blog.url}`)
      const likesElement = screen.getByText(`Likes: ${blog.likes}`)

      expect(titleElement).toBeVisible()
      expect(urlElement).not.toBeVisible()
      expect(likesElement).not.toBeVisible()
    }
  )

  test(
    'URL and number of likes are shown when button is clicked',
    async () => {
      const titleElement = screen.getByText(`${blog.title} by ${blog.author}`)
      const urlElement = screen.getByText(`URL: ${blog.url}`)
      const likesElement = screen.getByText(`Likes: ${blog.likes}`)
      const detailsButton = screen.getByText('show')

      const user = userEvent.setup()
      await act(async () => {
        await user.click(detailsButton)
      })

      expect(titleElement).toBeVisible()
      expect(urlElement).toBeVisible()
      expect(likesElement).toBeVisible()
    }
  )

  test(
    'When like button is clicked twice the event handler is called twice',
    async () => {
      const user = userEvent.setup()
      const likeButton = screen.getByText('like')

      await user.click(likeButton)
      await user.click(likeButton)

      expect(handleLike.mock.calls).toHaveLength(2)
    }
  )

})
