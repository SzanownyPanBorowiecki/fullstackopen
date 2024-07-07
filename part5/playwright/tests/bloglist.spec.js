const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Test Name',
        username: 'test',
        password: 'testPassword'
      }
    })
    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByTestId('LoginForm:input:username')).toBeVisible()
    await expect(page.getByTestId('LoginForm:input:password')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByTestId('LoginForm:input:username').fill('test')
      await page.getByTestId('LoginForm:input:password').fill('testPassword')
      await page.getByTestId('LoginForm:button:login').click()
      await expect(page.getByText('Test Name logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByTestId('LoginForm:input:username').fill('test')
      await page.getByTestId('LoginForm:input:password').fill('wrong')
      await page.getByTestId('LoginForm:button:login').click()
      await expect(page.getByText('invalid username or password')).toBeVisible()
    })

  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      // ...
    })

    test('a new blog can be created', async ({ page }) => {
      // ...
    })

    test('existing blog can be liked', async ({ page }) => {
      // ...
    })

    test('can remove blogs created by logged in user', async ({ page }) => {
      // ...
    })

    test('can not remove blogs created by other user', async ({ page }) => {
      // ...
    })

    test('remove button only visible for blogs added by logged in user', async ({ page }) => {
      // ...
    })

  })

  test('blogs are ordered by number of likes, descending', async ({ page }) => {
    // ...
  })
})
