const { test, expect, beforeEach, describe } = require('@playwright/test')
const { logIn, addBlog } = require('./helpers')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await page.goto('/')
  })


  test('Login form is shown', async ({ page }) => {
    await expect(page.getByTestId('LoginForm:input:username')).toBeVisible()
    await expect(page.getByTestId('LoginForm:input:password')).toBeVisible()
  })


  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await logIn(page, {username: 'test', password: 'testPassword'})
      await expect(page.getByText('Test Name logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await logIn(page, {username: 'test', password: 'wrong'})
      await expect(page.getByText('invalid username or password')).toBeVisible()
    })

  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await logIn(page, {username: 'test', password: 'testPassword'})
    })

    test('a new blog can be created', async ({ page }) => {
      addBlog(page, {
        title: 'New blog title',
        author: 'New blog author',
        url: 'https://example.com'
      })

      await expect(page.locator('.blog-entry').getByText(/New blog title/)).toBeVisible()
    })


    test('existing blog can be liked', async ({ page }) => {
      const existingBlog = page
        .locator('.blog-entry')
        .nth(0)

      await existingBlog.getByRole('button', {name: 'show'}).click()

      const oldLikes = parseInt((await existingBlog.getByText(/Likes/).textContent()).match(/(\d+)/)[0])
      await existingBlog.getByRole('button', {name: 'like'}).click()
      await expect(existingBlog).toContainText(`Likes: ${oldLikes + 1}`)
    })


    test('can remove blogs created by logged in user', async ({ page }) => {
      addBlog(page, {
        title: 'To be removed',
        author: 'Hello',
        url: 'google.com'
      })

      const blog = page.locator('.blog-entry').getByText('To be removed').locator('..')

      await blog.getByRole('button', {name: 'show'}).click()

      page.on('dialog', dialog => dialog.accept())
      await blog.getByRole('button', {name: 'remove'}).click()

      await expect(blog).toHaveCount(0)
    })


    test('remove button only visible for blogs added by logged in user', async ({ page }) => {
      const blogEntriesLocator = page.locator('.blog-entry')
      await blogEntriesLocator.first().waitFor()

      for (const el of await blogEntriesLocator.all()) {
        await el.getByRole('button', {name: 'show'}).click()
        const addedBy = (await el.getByText(/Added by/).textContent()).match(/Added by: (.*)/)[1]
        const removeButton = el.getByRole('button', {name: 'remove'})

        if (addedBy !== 'Test Name') {
          await expect(removeButton).toBeHidden()
        } else {
          await expect(removeButton).toBeVisible()
        }
      }
    })


    test('blogs are ordered by number of likes, descending', async ({ page }) => {
      const blogEntriesLocator = page.locator('.blog-entry')
      await blogEntriesLocator.first().waitFor()

      const likes = await Promise.all(
        (await blogEntriesLocator.all())
          .map(async el => {
            return parseInt(
              (await el.getByText(/Likes/).textContent()).match(/(\d+)/)[0]
            )
          }
        )
      )

      const sortedLikes = [...likes].sort((a,b) => b-a)
      expect(likes).toStrictEqual(sortedLikes)
    })
  })

})
